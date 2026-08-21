"""
Calcula qué campos hay que añadir al formulario de JotForm para que recoja todo
lo que pide el formulario de la web, y devuelve el cuerpo de la petición.

Los campos se crean con required="No" a propósito. Ese formulario está embebido
en /contacto-pcp/ y en un artículo del blog: un campo obligatorio de consultoría
impediría enviar a quien entra desde allí a preguntar por una nacionalidad.

Es idempotente: si un campo ya existe, no lo vuelve a crear.
"""
import json
import re
import sys
import urllib.parse

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

# (nombre interno, tipo JotForm, etiqueta, opciones)
NUEVOS = [
    ("organizacion", "control_textbox", "Organización", None),
    ("telefono", "control_phone", "Teléfono", None),
    ("areaInteres", "control_dropdown", "Área de interés", AREAS),
    ("nivelMadurez", "control_dropdown", "Nivel de madurez", NIVELES),
    ("detalles", "control_textarea", "Detalles", None),
]


def main() -> None:
    preguntas = json.loads(sys.argv[1]).get("content", {})

    # Se compara por nombre interno Y por etiqueta normalizada. El teléfono del
    # formulario ya existe pero se llama "numeroDe30": comparando sólo el nombre
    # se habría creado un segundo campo de teléfono.
    def normaliza(t: str) -> str:
        t = re.sub(r"<[^>]+>", " ", t or "").lower()
        for a, b in (("á", "a"), ("é", "e"), ("í", "i"), ("ó", "o"), ("ú", "u")):
            t = t.replace(a, b)
        return re.sub(r"[^a-z]", "", t)

    existentes = {q.get("name", "") for q in preguntas.values()}
    etiquetas = {normaliza(q.get("text", "")) for q in preguntas.values()}
    SINONIMOS = {
        "telefono": {"telefono", "numerodetelefono", "phone"},
        "organizacion": {"organizacion", "empresa", "compania"},
        "detalles": {"detalles", "mensaje", "comentarios"},
        "areaInteres": {"areadeinteres"},
        "nivelMadurez": {"niveldemadurez"},
    }
    siguiente = max((int(k) for k in preguntas), default=0) + 1
    orden = max((int(q.get("order", 0) or 0) for q in preguntas.values()), default=0) + 1

    payload = {}
    creados = []
    for nombre, tipo, etiqueta, opciones in NUEVOS:
        if nombre in existentes:
            continue
        if etiquetas & SINONIMOS.get(nombre, set()):
            print(f"  ya existe (por etiqueta): {etiqueta}", file=sys.stderr)
            continue
        pregunta = {
            "type": tipo,
            "text": etiqueta,
            "name": nombre,
            "order": str(orden),
            "required": "No",
        }
        if opciones:
            pregunta["options"] = "|".join(opciones)
        payload[str(siguiente)] = pregunta
        creados.append(etiqueta)
        siguiente += 1
        orden += 1

    if not payload:
        print("YA_ESTABAN")
        return

    print(urllib.parse.urlencode({"questions": json.dumps(payload)}))
    print("Se crearán: " + ", ".join(creados), file=sys.stderr)


if __name__ == "__main__":
    main()
