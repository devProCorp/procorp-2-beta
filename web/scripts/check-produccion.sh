#!/usr/bin/env bash
#
# Health check for pro-corp.net after the cutover.
#
# The static site and WordPress share one document root, and the whole thing is
# held together by public_html/.htaccess. WordPress plugins regenerate that file
# — LiteSpeed Cache and ShortPixel both have markers in it — and if one of them
# rewrites it, the 166 article redirects vanish silently: no error anywhere, just
# traffic dying in 404s. This checks that they are still there.
#
# Everything is checked against the ORIGIN, not through Sucuri: the proxy answers
# curl with a 307 JavaScript challenge no matter what the origin is doing, so
# testing the public URL would report success even on a broken deploy.
#
# Usage:  ./scripts/check-produccion.sh
# Exit:   0 = all good, 1 = something needs attention.
#
set -uo pipefail

SSH_ALIAS="procorp-portal"
ORIGIN_IP="160.153.72.70"
HOST="www.pro-corp.net"
EXPECTED_REDIRECTS=166

fallos=0
ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$1"; fallos=$((fallos + 1)); }

# curl against the origin, bypassing Sucuri. -k because the origin certificate
# does not have to match the proxied hostname.
fetch() {
  curl --resolve "$HOST:443:$ORIGIN_IP" -k -s -m 30 "$@"
}
code()  { fetch -o /dev/null -w '%{http_code}' "https://$HOST$1"; }
final() { fetch -L -o /dev/null -w '%{http_code}' "https://$HOST$1"; }

# Imunify360 (instalado en el hosting) sirve un challenge "One moment, please…"
# con HTTP 200 a clientes que le parecen automatizados. Si eso ocurre, TODAS las
# comprobaciones de abajo mienten: los redirects parecen 200 en vez de 301 y la
# portada parece no ser el sitio nuevo. Se detecta antes para no confundir un
# bloqueo hacia nosotros con un sitio roto.
sonda=$(fetch "https://$HOST/")
if grep -qi "One moment, please" <<<"$sonda"; then
  echo
  echo "El servidor está sirviendo un challenge anti-bot (Imunify360) a esta máquina,"
  echo "no el sitio. Las comprobaciones por HTTP no son fiables ahora mismo."
  echo
  echo "  · No significa que el sitio esté caído: un navegador real pasa el challenge."
  echo "  · Suele deberse a muchas peticiones automatizadas seguidas; se pasa solo."
  echo "  · Para comprobar mientras tanto, mirar los archivos por SSH o abrirlo en el navegador."
  exit 2
fi

echo "→ Reglas en el servidor"
reglas=$(ssh -o BatchMode=yes "$SSH_ALIAS" "grep -c 'R=301' ~/public_html/.htaccess" 2>/dev/null | tr -d '[:space:]')
if [[ "$reglas" == "$EXPECTED_REDIRECTS" ]]; then
  ok "$reglas redirects presentes"
else
  fail "hay $reglas redirects, se esperaban $EXPECTED_REDIRECTS — ¿un plugin reescribió .htaccess?"
  echo "     restaurar: rsync -a web/deploy/htaccess-cutover $SSH_ALIAS:public_html/.htaccess"
fi

if ssh -o BatchMode=yes "$SSH_ALIAS" "grep -q '^DirectoryIndex index.html' ~/public_html/.htaccess" 2>/dev/null; then
  ok "DirectoryIndex sirve el sitio nuevo antes que WordPress"
else
  fail "falta DirectoryIndex — la portada la estaría sirviendo WordPress"
fi

echo "→ Sitio nuevo"
titulo=$(fetch "https://$HOST/" | grep -o '<title>[^<]*' | head -1)
case "$titulo" in
  *"PRO CORP"*) ok "la portada es el sitio nuevo" ;;
  *)            fail "la portada no parece el sitio nuevo: ${titulo:-sin título}" ;;
esac

for ruta in /about/ /journal/ /projects/ /studio/ /contact/; do
  c=$(code "$ruta")
  [[ "$c" == "200" ]] && ok "$ruta responde 200" || fail "$ruta responde $c"
done

echo "→ Servicios que no pueden caerse"
c=$(code /login/);    [[ "$c" == "200" ]] && ok "/login/ (portal de clientes) responde 200" || fail "/login/ responde $c"
c=$(code /wp-admin/); [[ "$c" =~ ^(200|302)$ ]] && ok "/wp-admin/ accesible ($c)" || fail "/wp-admin/ responde $c"
c=$(final /nomada-digital/); [[ "$c" == "200" ]] && ok "landings de WordPress sirviendo" || fail "landing /nomada-digital/ responde $c"

echo "→ Redirects del blog (muestra)"
for slug in zona-schengen ccse vivir-en-portugal; do
  c=$(code "/$slug/"); f=$(final "/$slug/")
  if [[ "$c" == "301" && "$f" == "200" ]]; then
    ok "/$slug/ → 301 → 200"
  else
    fail "/$slug/ devuelve $c y acaba en $f (se esperaba 301 → 200)"
  fi
done

echo "→ Indexación"
robots=$(fetch "https://$HOST/robots.txt")
if grep -q 'Disallow: /$' <<<"$robots"; then
  fail "robots.txt bloquea todo el sitio — ¿se desplegó un build de beta?"
else
  ok "robots.txt permite indexación"
fi

echo
if (( fallos == 0 )); then
  echo "Todo correcto."
else
  echo "$fallos comprobación(es) fallaron."
fi
exit $(( fallos > 0 ? 1 : 0 ))
