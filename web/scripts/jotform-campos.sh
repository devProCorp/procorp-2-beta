#!/usr/bin/env bash
#
# Discover the field names of a JotForm form, without any API key.
#
# JotForm accepts plain form submissions at submit.jotform.com, but each input
# has to be named exactly as that form expects — q3_nombre, q4_email and so on.
# Those names are visible in the form's own public HTML, so they can be read
# without credentials: the API key stays out of the repo and out of the browser.
#
# Usage:  ./scripts/jotform-campos.sh <formID>
#         ./scripts/jotform-campos.sh 240123456789012
#
set -euo pipefail

FORM_ID="${1:-}"
[[ -n "$FORM_ID" ]] || { echo "Uso: $0 <formID>" >&2; exit 2; }
[[ "$FORM_ID" =~ ^[0-9]+$ ]] || { echo "El formID son sólo dígitos (está en la URL del formulario)." >&2; exit 2; }

URL="https://form.jotform.com/${FORM_ID}"
html=$(curl -sL -m 30 -A "Mozilla/5.0" "$URL") || { echo "No se pudo descargar $URL" >&2; exit 1; }

if grep -qi "not found\|no longer available\|formulario no" <<<"$html" && [[ ${#html} -lt 5000 ]]; then
  echo "El formulario $FORM_ID no existe o no es público." >&2
  exit 1
fi

echo "Formulario: $URL"
title=$(grep -oE '<title>[^<]*' <<<"$html" | head -1 | sed 's/<title>//')
[[ -n "$title" ]] && echo "Título: $title"
echo "Endpoint de envío: https://submit.jotform.com/submit/${FORM_ID}"
echo
echo "Campos (name → tipo):"

# Los campos reales de JotForm empiezan por q<n>_
grep -oE '<(input|select|textarea)[^>]*' <<<"$html" \
  | grep -oE 'name="q[0-9]+_[^"]*"|type="[a-z]+"' \
  | paste - - 2>/dev/null \
  | sed 's/name="//; s/"//g; s/type=//' \
  | sort -u \
  | awk '{printf "  %-40s %s\n", $1, $2}'

echo
echo "Campos ocultos que hay que enviar tal cual:"
grep -oE '<input[^>]*type="hidden"[^>]*' <<<"$html" \
  | grep -oE 'name="[^"]*"' \
  | sed 's/name="//; s/"//' \
  | grep -vE '^q[0-9]+_' \
  | sort -u \
  | sed 's/^/  /' || echo "  (ninguno)"
