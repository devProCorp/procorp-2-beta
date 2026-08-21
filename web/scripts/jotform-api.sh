#!/usr/bin/env bash
#
# Cliente mínimo de la API de JotForm para el trabajo de formularios.
#
# La API key se lee de web/.env.local, que git ignora. Viaja en la cabecera
# APIKEY y no en la URL, para que no quede registrada en logs ni en el historial
# del shell. El script nunca la imprime.
#
# Uso:
#   ./scripts/jotform-api.sh verificar          # comprueba que la key funciona
#   ./scripts/jotform-api.sh formularios        # lista los formularios de la cuenta
#   ./scripts/jotform-api.sh campos <formID>    # preguntas de un formulario
#   ./scripts/jotform-api.sh anadir-campos <id> # anade los campos del sitio
#
set -euo pipefail
cd "$(dirname "$0")/.."

# La key puede estar en .env o .env.local; git ignora ambos (.gitignore: .env*).
ENV_FILE=""
for f in .env.local .env; do
  [[ -f "$f" ]] && grep -qE '^JOTFORM_API_KEY=.' "$f" && { ENV_FILE="$f"; break; }
done
[[ -n "$ENV_FILE" ]] || { echo "Falta JOTFORM_API_KEY en web/.env o web/.env.local" >&2; exit 1; }
KEY=$(grep -E '^JOTFORM_API_KEY=' "$ENV_FILE" | cut -d= -f2- | tr -d '"'"'"' \r\n')
[[ -n "$KEY" && "$KEY" != "PON_AQUI_TU_API_KEY" ]] || {
  echo "JOTFORM_API_KEY sigue sin valor en $ENV_FILE." >&2; exit 1; }

API="https://api.jotform.com"
llamar() {  # método, ruta, [datos]
  local metodo="$1" ruta="$2"; shift 2
  curl -s -m 45 -X "$metodo" -H "APIKEY: $KEY" "$@" "${API}${ruta}"
}

comando="${1:-}"; shift || true
case "$comando" in
  verificar)
    resp=$(llamar GET /user)
    python3 - "$resp" <<'PY'
import json, sys
d = json.loads(sys.argv[1])
if d.get("responseCode") != 200:
    print("  ✗ La API key no es válida:", d.get("message", d.get("responseCode"))); raise SystemExit(1)
u = d["content"]
print(f"  ✓ Conectado como {u.get('username')} ({u.get('email')})")
print(f"    cuenta: {u.get('accountType')} · estado: {u.get('status')}")
PY
    ;;
  formularios)
    resp=$(llamar GET "/user/forms?limit=100&orderby=updated_at")
    python3 - "$resp" <<'PY'
import json, sys
d = json.loads(sys.argv[1])
forms = [f for f in d.get("content", []) if f.get("status") == "ENABLED"]
print(f"  {len(forms)} formularios activos:\n")
print(f"  {'ID':<18} {'ENVÍOS':>7}  TÍTULO")
for f in forms:
    print(f"  {f['id']:<18} {f.get('count','0'):>7}  {f.get('title','')[:50]}")
PY
    ;;
  campos)
    [[ $# -ge 1 ]] || { echo "Uso: $0 campos <formID>" >&2; exit 2; }
    resp=$(llamar GET "/form/$1/questions")
    python3 - "$resp" <<'PY'
import json, sys
d = json.loads(sys.argv[1])
qs = d.get("content", {})
print(f"  {'QID':<5} {'TIPO':<22} {'OBLIG':<6} ETIQUETA")
for qid in sorted(qs, key=lambda x: int(x)):
    q = qs[qid]
    print(f"  {qid:<5} {q.get('type','').replace('control_',''):<22} {q.get('required','No'):<6} {q.get('text','')[:44]}")
PY
    ;;
  anadir-campos)
    [[ $# -ge 1 ]] || { echo "Uso: $0 anadir-campos <formID>" >&2; exit 2; }
    python3 scripts/jotform_anadir.py "$KEY" "$1"
    ;;
  *)
    echo "Uso: $0 {verificar|formularios|campos <id>|anadir-campos <id>}" >&2; exit 2 ;;
esac
