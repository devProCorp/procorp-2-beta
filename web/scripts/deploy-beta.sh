#!/usr/bin/env bash
#
# Deploy the static export to beta.pro-corp.net (GoDaddy shared hosting).
#
# The host has no Node runtime, so the site ships as prerendered HTML served by
# Apache. WordPress lives in ~/public_html and is never touched: this subdomain
# has its own docroot at ~/procorp-beta.
#
# Usage:  ./scripts/deploy-beta.sh [--dry-run]
#
set -euo pipefail

SSH_ALIAS="procorp-portal"          # ~/.ssh/config → pablo216@160.153.72.70
REMOTE_DIR="procorp-beta"           # docroot of beta.pro-corp.net
SITE_URL="https://beta.pro-corp.net"

cd "$(dirname "$0")/.."

# --progress, not --info=progress2: macOS ships rsync 2.6.9, which predates it.
# --checksum compares content instead of timestamps — every build rewrites the
# whole out/ tree, so without it rsync would resend ~1 GB on each deploy.
RSYNC_FLAGS=(-a --delete --partial --human-readable --progress --checksum)
if [[ "${1:-}" == "--dry-run" ]]; then
  RSYNC_FLAGS+=(--dry-run)
  echo "→ DRY RUN: nothing will be written to the server"
fi

echo "→ Building static export…"
# NEXT_PUBLIC_NOINDEX=1 keeps this staging copy out of search results so it does
# not compete with the WordPress site on www.pro-corp.net. Drop it (and the
# X-Robots-Tag line in public/.htaccess) if this ever becomes the public site.
NEXT_PUBLIC_SITE_URL="$SITE_URL" \
NEXT_PUBLIC_NOINDEX=1 \
  yarn build

if [[ ! -f out/.htaccess ]]; then
  echo "✗ out/.htaccess missing — security headers would not be applied. Aborting." >&2
  exit 1
fi

echo "→ Syncing out/ → $SSH_ALIAS:~/$REMOTE_DIR/ …"
rsync "${RSYNC_FLAGS[@]}" -e ssh out/ "$SSH_ALIAS:$REMOTE_DIR/"

echo "→ Done. Verify: curl -sI $SITE_URL | head -20"
