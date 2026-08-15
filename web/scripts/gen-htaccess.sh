#!/usr/bin/env bash
#
# Compose production's .htaccess from its parts.
#
# That single file is what lets the static site, WordPress, the legacy portal and
# the microsites share one document root, and the order of its blocks is load
# bearing: anything that must win has to appear before WordPress's catch-all,
# which sends every unmatched request to index.php. Editing it by hand is how
# that order gets broken, so it is assembled instead.
#
# Usage:
#   ./scripts/gen-htaccess.sh                 > deploy/htaccess-produccion
#   ./scripts/gen-htaccess.sh --con-login     > deploy/htaccess-produccion
#
# Install it with the commands in the README; the file is chmod 444 on the
# server, so it has to be opened for writing and closed again.
#
set -euo pipefail

cd "$(dirname "$0")/.."

CON_LOGIN=0
for arg in "$@"; do
  case "$arg" in
    --con-login) CON_LOGIN=1 ;;
    *) echo "Opción desconocida: $arg" >&2; exit 2 ;;
  esac
done

for f in deploy/redirects-wp-posts.conf deploy/paginas-migradas.conf deploy/wordpress-block.conf; do
  [[ -s "$f" ]] || { echo "Falta $f" >&2; exit 1; }
done
if (( CON_LOGIN )); then
  [[ -s deploy/login-redirect.conf ]] || { echo "Falta deploy/login-redirect.conf" >&2; exit 1; }
fi

cat <<'CABECERA'
# ─────────────────────────────────────────────────────────────────────────────
# GENERADO POR scripts/gen-htaccess.sh — NO EDITAR A MANO.
# Editar las piezas en deploy/ y regenerar.
#
# Convivencia en un único document root:
#   · DirectoryIndex sirve index.html (sitio nuevo) antes que index.php (WP).
#   · Los archivos y directorios reales se sirven tal cual — así las rutas del
#     sitio nuevo ganan a WordPress sin necesidad de ninguna regla, y por eso
#     migrar una página es simplemente crearla y publicar.
#   · Lo que no existe en disco cae al bloque de WordPress del final, que
#     mantiene vivas sus 48 páginas en sus URLs originales.
#
# El ORDEN de los bloques importa: todo lo que deba ganar va antes del bloque
# de WordPress, cuyo catch-all manda cualquier petición no resuelta a index.php.
# ─────────────────────────────────────────────────────────────────────────────

DirectoryIndex index.html index.php

CABECERA

echo "# ── Artículos del blog → /journal/ ──────────────────────────────────────────"
grep -v '^#' deploy/redirects-wp-posts.conf | grep -v '^[[:space:]]*$' | {
  echo "<IfModule mod_rewrite.c>"
  echo "RewriteEngine On"
  cat
  echo "</IfModule>"
}
echo

if (( CON_LOGIN )); then
  cat deploy/login-redirect.conf
  echo
fi

cat deploy/paginas-migradas.conf
echo

cat deploy/wordpress-block.conf
