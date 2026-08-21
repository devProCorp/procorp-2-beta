"""
Añade al formulario de JotForm los campos que el formulario de la web recoge y
él no tiene todavía.

La API de JotForm acepta altas de preguntas por POST /form/{id}/questions con
los parámetros en question[...] — el PUT masivo que documenta como alternativa
devuelve 400, y el endpoint /question en singular no existe.

Los campos se crean opcionales a propósito: este formulario está embebido en
/contacto-pcp/ y en un artículo del blog, y un campo obligatorio de consultoría
impediría enviar a quien entra desde allí a preguntar por una nacionalidad.

Es idempotente: compara por nombre interno y por etiqueta, así que no duplica
(el teléfono ya existía como "numeroDe30" y se detecta igual).
"""
import json
import re
import sys
import urllib.parse
import urllib.request

API = "https://api.jotform.com"

AREAS = [
    "Automatización de Procesos de Negocio", "Mapeo Funcional de Procesos",
    "Reingeniería de Modelos Operativos", "Implementación de LIA",
    "Inventario Digital", "Simulación Financiera", "Simulación de Operaciones",
    "Mapeo y Estructuración de Proyectos", "Tokenización", 'Legal "Express"',
    "Business Cockpit / Reportes en Tiempo Real",
]
NIVELES = [
    "Inicial (Procesos manuales predominantes)",
    "En desarrollo (Herramientas aisladas)",
    "Avanzado (Sistemas integrados)",
    "Optimizado (Automatización inteligente)",
]

NUEVOS = [
    ("organizacion", "control_textbox", "Organización", None),
    ("telefono", "control_phone", "Teléfono", None),
    ("areaInteres", "control_dropdown", "Área de interés", AREAS),
    ("nivelMadurez", "control_dropdown", "Nivel de madurez", NIVELES),
    ("detalles", "control_textarea", "Detalles", None),
]

SINONIMOS = {
    "telefono": {"telefono", "numerodetelefono", "phone"},
    "organizacion": {"organizacion", "empresa", "compania"},
    "detalles": {"detalles", "mensaje", "comentarios"},
    "areaInteres": {"areadeinteres"},
    "nivelMadurez": {"niveldemadurez"},
}


def normaliza(texto: str) -> str:
    texto = re.sub(r"<[^>]+>", " ", texto or "").lower()
    for a, b in (("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u")):
        texto = texto.replace(a, b)
    return re.sub(r"[^a-z]", "", texto)


def llamar(key: str, metodo: str, ruta: str, datos=None):
    cuerpo = urllib.parse.urlencode(datos).encode() if datos else None
    req = urllib.request.Request(f"{API}{ruta}", data=cuerpo, method=metodo)
    req.add_header("APIKEY", key)
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.loads(r.read().decode())


def main() -> int:
    key, form_id = sys.argv[1], sys.argv[2]
    preguntas = llamar(key, "GET", f"/form/{form_id}/questions").get("content", {})
    nombres = {q.get("name", "") for q in preguntas.values()}
    etiquetas = {normaliza(q.get("text", "")) for q in preguntas.values()}
    orden = max((int(q.get("order", 0) or 0) for q in preguntas.values()), default=0) + 1

    creados, omitidos = [], []
    for nombre, tipo, etiqueta, opciones in NUEVOS:
        if nombre in nombres or (etiquetas & SINONIMOS.get(nombre, set())):
            omitidos.append(etiqueta)
            continue
        datos = {
            "question[type]": tipo,
            "question[text]": etiqueta,
            "question[name]": nombre,
            "question[order]": str(orden),
            "question[required]": "No",
        }
        if opciones:
            datos["question[options]"] = "|".join(opciones)
        resp = llamar(key, "POST", f"/form/{form_id}/questions", datos)
        if resp.get("responseCode") != 200:
            print(f"  x {etiqueta}: {resp.get('message')}")
            return 1
        creados.append(f"{etiqueta} (qid {resp['content'].get('qid')})")
        orden += 1

    for o in omitidos:
        print(f"  = ya existía: {o}")
    for c in creados:
        print(f"  + creado: {c}")
    if not creados:
        print("  Nada que añadir.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
