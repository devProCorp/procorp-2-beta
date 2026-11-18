# UX — Blog de pro-corp.net (listado `/blog/` y artículos)

**Persona y tarea:** lector que llega desde redes, Google o el boletín, casi siempre en el móvil. Quiere
encontrar un artículo de su interés, leerlo o escucharlo (blogcast) y, si le convence, suscribirse o pedir el
diagnóstico de inversión.
**Cómo se revisó:** producción con `auditar.mjs` a 380 y 1280 px (capturas y medidas), más lectura del código
(`web/src/components/journal/*`, `web/src/app/globals.css`). Después, la rama en local a 380, 768 y 1280 px.
**Criterio de estilo:** el del cliente (pbakaus/impeccable): sin rótulos «eyebrow» en mayúsculas espaciadas,
sin bordes laterales de más de 1 px, sin degradados ni brillos de adorno, sin efecto vidrio, contraste de
4,5:1 como mínimo y letra de 12 px como mínimo. Inter es la fuente de marca.
**Sin cubrir:** lectores de pantalla reales, Safari en iPhone real, prueba con usuarios.

## Veredicto

Se podía leer, pero la página daba señales de poca confianza: un formulario de suscripción que no enviaba
nada, un «5 min de lectura» idéntico en artículos de 3 y de 10 minutos, y mucho adorno típico de diseño
generado por IA (brillos, vidrio, rótulos de 10 px en mayúsculas). Lo primero que se arregló fue la
suscripción y el tiempo de lectura.

## Hallazgos (todos aplicados en `feature/blog-auditoria-ux`)

### 1. [Grave] El boletín no suscribía a nadie
- **Qué pasaba:** `NewsletterSection.tsx` tenía un `<input>` y un `<button>` sin formulario ni manejador.
  Al pulsar «Suscribirse» no pasaba nada y el correo se perdía.
- **Por qué importa:** es la única acción de conversión del listado, y además falla sin avisar.
- **Cambio:** formulario real con la misma API que la ventana de salida (`/api/interes`, Supabase + HubSpot),
  consentimiento obligatorio, trampa para bots, errores junto al campo, foco en el primer error y mensaje de
  confirmación. `origen.pagina = /blog/` permite al equipo saber de dónde vino la suscripción. Probado con
  la API simulada.
- **Decisión abierta:** hoy se suscribe a la misma lista que la ventana de salida («nuevas oportunidades»).
  Si habrá un boletín editorial aparte, hace falta separar la lista.

### 2. [Grave] Tiempo de lectura falso
- **Qué pasaba:** `journal.readTime` era el texto fijo «5 min lectura» en todas las tarjetas.
- **Cambio:** `readingMinutes()` lo calcula con las palabras reales del artículo, a 200 palabras por minuto.
  Ahora sale en las tarjetas y bajo el título del artículo (de 3 a 10 min en la primera página).

### 3. [Media] Contraste insuficiente en metadatos y enlaces
- **Qué pasaba:** «Leer más» en rojo 3,03:1, fechas 3,54:1, «Filtrar por» 3,78:1, categoría del artículo
  3,26:1 y fecha del artículo 3,81:1, todos en 10–11 px.
- **Cambio:** metadatos en gris claro (gray-300/400, ≥ 6,8:1) a 13–14 px; el rojo solo en flechas y fondos.

### 4. [Media] La categoría tapaba el icono de audio en el móvil
- **Qué pasaba:** a 380 px, la píldora «Spanish Nationality by Sephardic Origin» ocupaba dos líneas y quedaba
  debajo del icono de auriculares.
- **Cambio:** la categoría sale de la imagen y pasa a ser la primera línea del texto de la tarjeta. En la
  imagen solo queda el icono de audio, que ahora tiene un texto para lectores de pantalla.

### 5. [Media] Títulos de artículo en mayúsculas gigantes
- **Qué pasaba:** h1 de 64 px en mayúsculas, con interlineado de 0,95 y espaciado negativo. Los títulos largos
  ocupaban la pantalla entera en el móvil y costaba leerlos.
- **Cambio:** tipo frase (como en el listado), 32 px en móvil y 48 px en escritorio, y `text-wrap: balance`.

### 6. [Media] Texto justificado con «ríos»
- **Qué pasaba:** desde 768 px, los párrafos iban justificados y con guiones automáticos, y se veían huecos
  entre palabras (captura de producción).
- **Cambio:** bandera a la izquierda en todos los anchos y `text-wrap: pretty` contra palabras huérfanas.

### 7. [Media] El blogcast competía con el artículo
- **Qué pasaba:** bloque rojo con degradado, sombra roja, elevación al pasar el ratón y rótulos de 9–10 px con
  5 px de espaciado. La hoja de estilos incrustada en cada artículo lo forzaba con `!important`.
- **Cambio:** superficie plana con borde de 1 px, título de 16 px y subtítulo de 14 px sin mayúsculas forzadas.
  Las reglas superan en especificidad a las del artículo, así que no hay que tocar los 376 artículos.

### 8. [Media] Filtros: estado y alcance poco claros
- **Qué pasaba:** los botones no decían cuál estaba activo (sin `aria-pressed`). En escritorio la fila se
  cortaba («SPANISH NATI…») aunque había sitio para dos líneas. Rótulos de 11 px en mayúsculas.
- **Cambio:** `aria-pressed` y `role="group"`. En escritorio las píldoras pasan a dos líneas; en el móvil se
  deslizan con una barra fina visible. Texto de 14 px y objetivos de 44 px. Además, ya no se salta al inicio
  de la página al filtrar.

### 9. [Media] Paginación con botones en lugar de enlaces
- **Qué pasaba:** «Anterior/Siguiente» usaban `router.push`, así que no se podían abrir en otra pestaña ni
  los seguían los buscadores. «1 / 21» no decía qué era.
- **Cambio:** enlaces reales con `rel="prev/next"` dentro de un `<nav>`, y el texto «Página 1 de 21».

### 10. [Menor] Adorno «generado por IA» (criterio del cliente)
- **Qué pasaba:** manchas de brillo difuminadas, sombras rojas brillantes en el título y en las píldoras, un punto
  que parpadea (`animate-pulse`) en cada tarjeta, efecto vidrio (`backdrop-blur`), un borde rojo de 4 px a la
  izquierda de la entradilla, imágenes oscurecidas al 40 % hasta pasar el ratón (en el móvil nunca se aclaraban)
  y un zoom del 110 %.
- **Cambio:** todo retirado. Las tarjetas son planas con borde de 1 px, la imagen va a su color real y el zoom
  queda en 3 % (desactivado con `prefers-reduced-motion`).

### 11. [Menor] Orden de encabezados
- **Qué pasaba:** en el listado se saltaba de h1 a h3 (los títulos de las tarjetas).
- **Cambio:** h2 en el listado y h3 en «Sigue leyendo», que ya tiene su propio h2.

### 12. [Menor] Estados de carga y error
- **Cambio:** el esqueleto tiene ahora la misma forma que la tarjeta nueva y se anuncia («Cargando…»,
  `aria-busy`). El error de carga se anuncia con `role="alert"`.

## Lo que funciona y conviene conservar

- La ruta lector → artículo → «¿Quieres invertir con PRO CORP?» (InvestCta) está clara y medida con UTM.
- Las recomendaciones personales al final, sin enviar el historial fuera del dispositivo.
- Artículos prerenderizados con tarjeta OG propia y JSON-LD.
- La columna de lectura de 42 rem (~75 caracteres) y el texto al 86 % de blanco.

## Verificación

- `auditar.mjs` en local a 380/768/1280: sin desbordamiento, sin controles sin nombre ni campos sin etiqueta y
  sin saltos de encabezado en el blog. Los avisos de contraste que quedan son del pie de página global y del
  botón «Anterior» desactivado, que WCAG no exige.
- Boletín probado con la API simulada: errores de vacío, de correo mal escrito y de falta de consentimiento,
  foco en el primer error y confirmación final con el payload correcto.
- `tsc` sin errores, lint sin errores nuevos y `next build` correcto (376 rutas de artículo, ninguna con el
  404 de Next).
