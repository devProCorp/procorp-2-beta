---
name: pro-corp-brand
description: Guía de identidad visual de PRO CORP Corporate Development. Usa esta skill siempre que crees cualquier material visual, presentación, documento, sitio web, componente UI o pieza de diseño para PRO CORP. Contiene colores corporativos, tipografía, reglas de uso del logotipo y lineamientos de UX/UI.
---

# PRO CORP — Guía de Marca e Identidad Visual

Aplica estas reglas cada vez que generes contenido visual (HTML, React, PPTX, DOCX, PDF, imágenes, emails, firmas, etc.) para **PRO CORP Corporate Development**.

---

## 1. Paleta de Colores

### Color primario — Rojo PRO CORP
| Sistema  | Valor                  |
|----------|------------------------|
| RGB      | 206, 16, 38            |
| HEX      | `#CE1026`              |
| CMYK     | 0, 100, 81, 4          |
| PANTONE  | PMS 186                |

### Color secundario — Gris
| Sistema  | Valor                  |
|----------|------------------------|
| RGB      | 143, 146, 149          |
| HEX      | `#8F9295`              |

### Colores de soporte
| Nombre         | HEX       | Uso                                      |
|----------------|-----------|------------------------------------------|
| Negro          | `#000000` | Textos principales, logo en versión negro |
| Blanco         | `#FFFFFF` | Fondos claros, texto sobre fondos oscuros |
| Fondo claro    | `#F5F5F5` | Fondos de secciones alternadas            |

### Reglas de color
- El rojo `#CE1026` es el color dominante de la marca. Úsalo para encabezados, acentos, CTAs y elementos destacados.
- El gris `#8F9295` se usa para subtítulos, texto secundario y elementos de soporte ("Corporate Development" en el logotipo).
- No cambies los colores del logotipo. Solo se permiten las versiones: color (rojo + gris), negro completo, y negativo (blanco sobre fondo de color).
- Para fondos oscuros con imágenes, usa la versión negativa del logo (texto blanco) o aplica sombra al logo para garantizar legibilidad.

---

## 2. Tipografía

### Logotipo
- **Fuente:** Microgramma D Extended Bold Italic
- Esta fuente es SOLO para el logotipo. No la uses en cuerpos de texto ni encabezados generales.

### Tipografía corporativa (textos generales)
- **Familia:** Montserrat (Google Fonts)
- **Pesos disponibles y recomendados:**

| Peso         | Uso                                         |
|--------------|---------------------------------------------|
| Light (300)  | Textos largos, párrafos, descripciones      |
| Regular (400)| Cuerpo de texto general                      |
| Bold (700)   | Encabezados, títulos de sección              |
| Semi-Bold (600) | Subtítulos, etiquetas                    |
| Bold Italic  | Énfasis destacado, llamadas a la acción      |

### Reglas tipográficas
- Siempre usa Montserrat como fuente principal en documentos, web y presentaciones.
- En HTML/React: importar desde Google Fonts (`https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,600;0,700;1,700&display=swap`).
- Mantén buena legibilidad: tamaño mínimo de 14px para cuerpo de texto en pantalla, 10pt en documentos impresos.

---

## 3. Logotipo — Reglas de Uso

### Dimensiones base
- Ancho estándar: **4 pulgadas** (~384px a 96dpi)
- Área de protección (padding): **0.55 pulgadas** (~53px) en todos los lados. Nunca colocar otros elementos dentro de esta zona.

### Versiones permitidas del logotipo
1. **Positivo color**: Rojo `#CE1026` + Gris `#8F9295` sobre fondo claro
2. **Positivo negro**: Negro `#000000` sobre fondo claro
3. **Negativo color**: Logo blanco con fondo rojo `#CE1026`
4. **Negativo negro**: Logo blanco con fondo negro `#000000`
5. **Con sombra**: Sobre fondos fotográficos oscuros, para garantizar contraste

### Usos INCORRECTOS (prohibidos)
- ❌ Rotar el logotipo
- ❌ Aplicar efectos 3D
- ❌ Alterar la disposición de los elementos (mover "Corporate Development" arriba del nombre)
- ❌ Cambiar colores no aprobados (no usar azul, verde, morado, etc.)
- ❌ Añadir adornos (estrellas, sombras excesivas, bordes decorativos)
- ❌ Aplicar efectos de imagen al logo (desenfoque, filtros artísticos)
- ❌ Usar el logo en baja resolución o pixelado
- ❌ Logo sin sombra sobre fondos fotográficos claros (se pierde legibilidad)
- ❌ Logo negro sobre fondos oscuros (sin contraste)

---

## 4. Lineamientos de UX/UI

### Estilo visual general
- **Estética:** Profesional, corporativa, moderna con carácter europeo.
- **Imágenes de fondo:** Se usan fotografías de ciudades europeas (Florencia, Lisboa, etc.) con overlay rojo semitransparente para dar coherencia visual.
- **Overlays:** Cuando uses imágenes de fondo, aplica un overlay rojo `rgba(206, 16, 38, 0.6)` o un gradiente oscuro para mantener la identidad de marca.

### Layouts y composición
- Usa composiciones diagonales cuando el diseño lo permita (la marca usa cortes diagonales en sus materiales).
- Alterna secciones de fondo blanco/gris claro con secciones que tienen imagen de fondo + overlay rojo.
- Mantén márgenes amplios y espacio blanco generoso.

### Componentes UI
- **Botones primarios:** Fondo rojo `#CE1026`, texto blanco, bordes redondeados mínimos (2-4px).
- **Botones secundarios:** Borde rojo `#CE1026`, fondo transparente, texto rojo.
- **Links:** Color rojo `#CE1026`, sin subrayado por defecto, subrayado al hover.
- **Encabezados:** Montserrat Bold, color rojo `#CE1026` o negro `#000000`.
- **Texto de cuerpo:** Montserrat Regular/Light, color negro o gris oscuro.
- **Tarjetas:** Fondo blanco, sombra sutil (`box-shadow: 0 2px 8px rgba(0,0,0,0.1)`), padding generoso.

### Firma de correo electrónico (referencia)
La firma corporativa sigue este formato:
```
[LOGO PRO CORP]

Nombre Completo
Cargo - Profesión

Teléfonos: +57 XXX XXX XXXX
PBX: +57 601 XXX XXXX
Email: correo@pro-corp.net
www.pro-corp.net

[Texto legal en letra pequeña]
```

---

## 5. Datos de contacto de referencia
- **Sitio web:** www.pro-corp.net
- **Email general:** gestion@pro-corp.net
- **País de origen:** Colombia
- **Sector:** Desarrollo corporativo, ciudadanía/nacionalidad europea, servicios legales

---

## 6. Checklist rápido antes de entregar

- [ ] ¿Se usa Montserrat como tipografía principal?
- [ ] ¿Los colores son exclusivamente rojo `#CE1026`, gris `#8F9295`, negro y blanco?
- [ ] ¿El logotipo respeta el área de protección de 0.55"?
- [ ] ¿No se rotó, deformó ni se le aplicó efectos al logotipo?
- [ ] ¿Los fondos fotográficos tienen overlay rojo o el logo tiene sombra/versión negativa?
- [ ] ¿El contraste del texto es suficiente sobre cualquier fondo?