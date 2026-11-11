# Entrega de cargo — procorp-2-beta — web pública

> **Ausencia de Christian Daza del 7 al 27 de septiembre de 2026** (regreso el 28).
> Este repositorio queda cubierto por la entrega de cargo de septiembre de 2026.

Este repositorio es **público**, así que aquí solo consta lo imprescindible. El detalle
operativo —estado, accesos, pendientes, contactos y el resto de sistemas— vive en la
documentación interna de la entrega, en un repositorio privado.

| | |
| --- | --- |
| **Repositorio** | [`devProCorp/procorp-2-beta`](https://github.com/devProCorp/procorp-2-beta) |
| **En producción** | `pro-corp.net` |
| **Verificado el** | 4 de septiembre de 2026 |

## Qué es

Web pública de la compañía (Next.js estático). En producción desde el 14 de agosto,
conviviendo con el WordPress anterior.

## Estado verificado el 4 de septiembre de 2026

| | |
| --- | --- |
| Rama por defecto | `main` |
| Última confirmación en `main` | `30cc99b` — 2026-08-28 |

## Lo que hay que saber antes de tocarlo

- El despliegue a producción **no se dispara por push**: es un `workflow_dispatch`
  (`deploy-produccion.yml`) que envuelve el script de despliegue, para que cada confirmación en
  `main` no publique sobre un docroot compartido.

- Delante hay una capa de caché. Una respuesta correcta no prueba que el origen esté bien: hay
  que comprobar contra el origen antes de dar nada por desplegado.

## Dónde está el conocimiento

- Documentación y decisiones dentro del propio repositorio, en `docs/`.

La documentación de la entrega (acta, relación, panorama técnico y temas abiertos) está en el
repositorio **privado** de conocimiento del equipo. Quien necesite acceso lo pide internamente.

---

*Documento generado el 4 de septiembre de 2026 a partir del estado real del repositorio. **No contiene
contraseñas, llaves, tokens, rutas de servidor ni datos de infraestructura.***
