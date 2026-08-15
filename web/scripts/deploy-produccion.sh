#!/usr/bin/env bash
#
# Publish the site to pro-corp.net.
#
# Production is a shared document root: the static site lives alongside
# WordPress, the legacy client portal in /login/, /crm/ and several microsites.
# A careless sync here takes all of that down, so this script refuses to run
# unless the build looks right, never deletes anything remote, and never touches
# the .htaccess that holds the whole arrangement together.
#
# Usage:
#   ./scripts/deploy-produccion.sh              # snapshot + build + sync
#   ./scripts/deploy-produccion.sh --dry-run    # rehearse, writes nothing
#   ./scripts/deploy-produccion.sh --sin-snapshot   # skip the WordPress capture
#
set -euo pipefail

SSH_ALIAS="procorp-portal"
REMOTE_DIR="public_html"
SITE_URL="https://www.pro-corp.net"

cd "$(dirname "$0")/.."

DRY_RUN=0
SNAPSHOT=1
for arg in "$@"; do
  case "$arg" in
    --dry-run)       DRY_RUN=1 ;;
    --sin-snapshot)  SNAPSHOT=0 ;;
    *) echo "Opción desconocida: $arg" >&2; exit 2 ;;
  esac
done

abort() { printf '\n✗ %s\n' "$1" >&2; exit 1; }
step()  { printf '\n→ %s\n' "$1"; }

# ── 1. Capture the WordPress content ────────────────────────────────────────
# The journal is a snapshot of the WordPress blog taken over its REST API. New
# articles only reach the static site through this step.
if (( SNAPSHOT )); then
  step "Capturando artículos de WordPress…"
  node scripts/snapshot-wp.mjs
  if ! git diff --quiet -- content/journal public/journal 2>/dev/null; then
    nuevos=$(git status --porcelain -- content/journal/posts | grep -c '^??' || true)
    echo "  El snapshot trae cambios${nuevos:+ ($nuevos artículos nuevos)}."
    echo "  Acuérdate de commitearlos para que el repo refleje lo publicado."
  else
    echo "  Sin cambios: el snapshot ya estaba al día."
  fi
else
  step "Snapshot omitido (--sin-snapshot)"
fi

# ── 2. Build ────────────────────────────────────────────────────────────────
# No NEXT_PUBLIC_NOINDEX here: that variable belongs to beta, and shipping it to
# production would hide the whole site from search engines.
step "Compilando para producción…"
NEXT_PUBLIC_SITE_URL="$SITE_URL" yarn build

# ── 3. Guards ───────────────────────────────────────────────────────────────
# Everything below is cheap and catches the mistakes that would be expensive.
step "Comprobando el build…"
[[ -s out/index.html ]]  || abort "out/index.html no existe o está vacío: el build no sirve."
[[ -d out/_next ]]       || abort "falta out/_next: el build está incompleto."
[[ -s out/robots.txt ]]  || abort "falta out/robots.txt."

grep -q '^Disallow: /$' out/robots.txt &&
  abort "robots.txt bloquea todo el sitio — es un build de beta. Recompila sin NEXT_PUBLIC_NOINDEX."

grep -rq 'beta\.pro-corp\.net' out/sitemap.xml &&
  abort "el sitemap apunta a beta. Recompila con NEXT_PUBLIC_SITE_URL=$SITE_URL."

archivos=$(find out -type f | wc -l | tr -d ' ')
(( archivos > 500 )) || abort "sólo $archivos archivos en out/: el build parece truncado."
echo "  $archivos archivos, robots y sitemap correctos."

# ── 4. Sync ─────────────────────────────────────────────────────────────────
# --checksum: every build rewrites out/ with new timestamps, so without it rsync
#   resends the whole ~1 GB each time.
# --exclude .htaccess: production's .htaccess is NOT the one in public/. It is
#   deploy/htaccess-cutover, which carries the 166 blog redirects and the
#   fallthrough that keeps WordPress serving its landing pages. Overwriting it
#   with the beta one would break the site.
# No --delete, ever: the remote directory holds WordPress, /login/ and the
#   microsites, none of which exist in out/.
RSYNC_FLAGS=(-a --checksum --partial --human-readable --progress --exclude=".htaccess" --stats)

if (( DRY_RUN )); then
  RSYNC_FLAGS+=(--dry-run --itemize-changes)
  step "SIMULACRO: no se escribe nada en el servidor"
else
  step "Vas a publicar en $SITE_URL (producción, compartida con WordPress y /login/)"
  read -r -p "  Escribe 'publicar' para continuar: " respuesta
  [[ "$respuesta" == "publicar" ]] || abort "Cancelado."
fi

rsync "${RSYNC_FLAGS[@]}" -e ssh out/ "$SSH_ALIAS:$REMOTE_DIR/"

# ── 5. Verify ───────────────────────────────────────────────────────────────
if (( DRY_RUN )); then
  printf '\nSimulacro terminado. Nada se escribió.\n'
  exit 0
fi

step "Verificando el sitio publicado…"
./scripts/check-produccion.sh || abort "el sitio publicado no pasa las comprobaciones. Revisa antes de dar por buena la publicación."

cat <<'EOF'

Publicado.

Falta un paso manual: purgar la caché de Sucuri desde su panel. Hasta entonces
los visitantes pueden seguir viendo la versión anterior — y tú también, así que
no confundas la caché con un despliegue fallido.
EOF
