#!/usr/bin/env bash
#
# Generate the 301 map from the old WordPress blog to the new /journal.
#
# WordPress used /%postname%/ permalinks, so every article lived at the root of
# the domain — the same space the new site occupies. Each published post needs an
# explicit redirect; a blanket rule to the home page would throw away the ranking
# of every article.
#
# Reads wp_posts straight from the live database over SSH, so the map always
# matches what is actually published. Credentials are read from wp-config.php on
# the server and never leave it.
#
# Usage:  ./scripts/gen-redirects.sh > deploy/redirects-wp-posts.conf
#
set -euo pipefail

SSH_ALIAS="procorp-portal"

slugs=$(ssh "$SSH_ALIAS" 'cd ~/public_html && php -r "
include \"wp-config.php\";
\$c = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
\$r = \$c->query(\"SELECT post_name FROM wp_posts WHERE post_status=\x27publish\x27 AND post_type=\x27post\x27 AND post_name != \x27\x27 ORDER BY post_name\");
while (\$row = \$r->fetch_row()) echo \$row[0] . \"\n\";
"' 2>/dev/null)

count=$(printf '%s\n' "$slugs" | grep -c . || true)

cat <<EOF
# Redirects 301 de los artículos del blog de WordPress al journal del sitio nuevo.
# Generado desde wp_posts (post_type=post, post_status=publish) el $(date +%Y-%m-%d).
# Los permalinks eran /%postname%/, es decir los artículos vivían en la raíz del dominio.
# Regenerar con scripts/gen-redirects.sh — no editar a mano.
#
# Cobertura: $count artículos.

EOF

printf '%s\n' "$slugs" | grep . | while read -r s; do
  echo "Redirect 301 /$s/ /journal/$s/"
done
