# Migración del blog de WordPress a Supabase

Documento de contexto para que otro agente/IA entienda qué se hizo, por qué, y
en qué estado quedó. Escrito 2026-08-20.

## Objetivo

Pro Corp va a **decomisionar WordPress** (`pro-corp.net`, el blog corporativo).
Antes de apagarlo hay que migrar el contenido del blog a Supabase para que deje
de depender de que WordPress siga respondiendo — texto, SEO, imágenes y audio
incluidos, no solo los datos "planos".

Repo: monorepo `pro-corp-platform` (Next.js + Supabase compartido entre 3 apps:
`inversiones`, `firma`, `intranet`). Todo el código de esta migración vive en
`apps/intranet/`.

## Fuente: WordPress REST API

- Base: `https://pro-corp.net/wp-json/wp/v2`
- Sin autenticación para lectura de posts publicados (API pública).
- **`/wp-json/wp/v2/users` está bloqueado por el WAF (Sucuri/GoDaddy)** —
  devuelve una página HTML "Access Denied", no JSON. El nombre del autor solo
  se puede obtener vía `_embed=1` en `/posts`, nunca consultando `/users`.
- Estructura del post estable en 6 años (verificado con muestras de 2020,
  2022, 2023, 2025, 2026): `id, slug, link, status, date_gmt, modified_gmt,
  title.rendered, content.rendered, excerpt.rendered, author, featured_media,
  categories, tags, yoast_head_json, _embedded`.
- **Yoast SEO activo**: `yoast_head_json` trae meta title/description,
  canonical, Open Graph, Twitter Card y el JSON-LD `schema` completo —
  se migra 1:1, no se reconstruye.
- **Total histórico: 166 posts** (2020-10-01 → presente). Rango de 2 años
  (`after=2024-08-19`): **84 posts**.

### Hallazgos de formato que importan para cualquier código que toque esto

1. `title.rendered` puede traer HTML embebido (ej. `<strong>`) — no tratarlo
   como texto plano ingenuo.
2. `featured_media: 0` en posts sin imagen destacada (nullable, `_embedded`
   puede no traer `wp:featuredmedia`).
3. **Widget de audio "blogcast"**: desde **2026-02-06** algunos posts inyectan
   un reproductor de audio inline en `content.rendered`
   (`<audio class="procorp-audio-player-pcaudio_...">`). El archivo está mal
   etiquetado por WordPress: extensión `.mp4`/`Content-Type: video/mp4` real,
   pero se usa como `type="audio/mpeg"` en el HTML — funciona bien en
   `<audio>`, pero no asumir `.mp3`.
4. Un fragmento de `<img>` de Gravatar queda embebido por accidente al final
   de `content.rendered` en al menos un post — residuo de un widget de
   comentarios de WordPress, no es contenido editorial. Se limpia, no se migra.
5. `modified_gmt` siempre difiere de `date_gmt` — los posts se editan después
   de publicados, el sync tiene que capturar ediciones, no solo altas.

### Bug de categorización en WordPress (no es nuestro, es de origen)

Desde **2026-04-06** el pipeline que publica en WordPress **dejó de asignar
categoría**: los últimos 14 posts consecutivos (hasta el más reciente,
2026-08-12) caen todos en "Uncategorized" (category id `1`). En total, **37
de los 84 posts del rango de 2 años** tienen este problema (algunos sueltos
antes también). No hay credenciales de WordPress para arreglarlo en la fuente
y de todas formas se va a apagar, así que se corrige al migrar (ver
`categorize.ts` más abajo).

Categorías reales (todo lo que no sea "Uncategorized"):

| id | nombre |
|----|--------|
| 56 | Ciudadanía europea |
| 57 | Emigrar a España |
| 58 | Emigrar a Portugal |
| 59 | Vivir en Europa |
| 156 | Nacionalidad española por origen sefardí |

## Assets: por qué no basta con guardar la URL de WordPress

Como WordPress se apaga, **ningún campo puede depender de que
`wp-content/uploads/...` siga resolviendo**. Esto obliga a: descargar cada
asset, subirlo a Supabase Storage, y **reescribir las URLs dentro del propio
`content_html` y del JSON-LD (`seo_schema`)** — no alcanza con un campo nuevo
apuntando al asset rehosteado si el HTML del post sigue citando la URL vieja.

Inventario real (rango de 2 años, 84 posts):

- 83 imágenes destacadas únicas (se guarda solo la variante `full`, no las 7
  que genera WordPress — un frontend nuevo puede generar responsive on-demand).
- 2 imágenes reales dentro del cuerpo del contenido.
- 1 foto de autor reciclada como watermark en ~10 posts (se descarga una vez).
- 33 audios "blogcast" (~8.7 MB promedio).
- 1 logo del sitio (`Organization.logo` en el JSON-LD, compartido por todos
  los posts).
- Total: ~120 archivos únicos, ~320 MB.

## Esquema en Supabase (schema dedicado `blog`)

Archivos de migración en `scripts/migrations/` (aplicar a mano en Supabase
Dashboard → SQL Editor — es la convención de este repo, ver
`docs/kb/03-flujo-de-trabajo.md` §4):

- **`061_blog_schema.sql`** — crea el schema `blog`, tablas `blog.posts` y
  `blog.posts_sync_log`, bucket público `blog-assets` (límite 20 MB,
  `allowed_mime_types` incluye `video/mp4` por el mislabeling del audio), RLS
  activado sin políticas (solo `service_role` lee/escribe).
- **`062_blog_posts_category_inferred.sql`** — agrega
  `category_inferred boolean` a `blog.posts` (trazabilidad de qué categorías
  las puso una IA vs. un editor humano).
- **`063_blog_schema_grants.sql`** — **crítico y fácil de olvidar**: crear un
  schema nuevo no da acceso automático a los roles de Postgres, eso es aparte
  de RLS. Sin este `GRANT USAGE ON SCHEMA blog TO service_role` (+ grants en
  tablas/secuencias + `ALTER DEFAULT PRIVILEGES`), cualquier query da
  `permission denied for schema blog` aunque el schema ya esté expuesto en la
  API.

### `blog.posts` — columnas clave

```
wp_id (PK), slug (unique), link, status, title, excerpt_html, content_html,
author_wp_id, author_name,
featured_image_url, featured_image_url_original,
audio_url, audio_url_original,
category_ids int[], category_names text[], category_inferred boolean,
tag_ids int[], tag_names text[],
seo_title, seo_description, seo_canonical, seo_og_image_url,
seo_robots jsonb, seo_schema jsonb,
raw_json jsonb (respuesta cruda original de WP, red de seguridad),
published_at, modified_at, synced_at
```

Sin joins para las relaciones (categorías/tags como arrays) — sigue la
convención de este repo (`client_index`, y la regla explícita en
`CLAUDE.md`: "No joins Supabase para FK — query separada").

### Paso manual no-SQL: exponer el schema en la API

Un schema nuevo **no se ve por PostgREST** hasta que se agrega a
"Exposed schemas" en Supabase Dashboard → Settings → API. Se hizo por API
directa (PATCH a `https://api.supabase.com/v1/projects/{ref}/postgrest` con
`db_schema` incluyendo `blog`, usando un Personal Access Token temporal que el
usuario generó y después revocó) en vez de `supabase config push`, porque ese
comando sube el `config.toml` completo y este repo no tiene uno — no hay forma
de confirmar que no resetea Auth/Storage/otras secciones no declaradas (es un
hueco reconocido y cerrado como "not planned" en el repo del CLI de
Supabase). El PATCH puntual solo tocó `db_schema`, se verificó que
`jwt_secret`/`db_pool`/`max_rows` quedaron intactos.

## Código (`apps/intranet/src/lib/blog/`)

| Archivo | Rol |
|---|---|
| `wordpress.ts` | Fetch de WP con `_embed=1`. `fetchPostsSince(afterIso)` para backfill, `fetchPostsModifiedSince(modifiedAfterIso)` para incremental (captura ediciones, no solo altas) |
| `extract.ts` | Extrae audio (regex sobre el widget `procorp-audio-player`), imágenes inline/schema, limpia el ruido de Gravatar |
| `categorize.ts` | Clasifica con **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`) contra las 5 categorías reales cuando el post llega vacío o en "Uncategorized". Fallback a categoría 59 si Claude no devuelve IDs válidos (posts fuera de tema, ver más abajo) |
| `assets.ts` | Descarga + dedup global + sube a `blog-assets` (concurrencia 5, `audio/mp4` forzado en audios pese al Content-Type real `video/mp4` de origen) |
| `transform.ts` | Post WP + mapa de URLs rehosteadas → fila `blog.posts`, reescribiendo `content_html` y `seo_schema` |
| `harvester.ts` | Orquesta todo: fetch → assets → transform → inferencia de categoría → upsert chunked (`onConflict: wp_id`) → log en `blog.posts_sync_log` |

Entry points:
- `apps/intranet/scripts/blog-backfill.ts` (`pnpm blog:backfill`, flags
  `--since`, `--dry-run`) — **corre local, no en Vercel**: ~320 MB de
  descargas está fuera del límite razonable de una función serverless.
- `apps/intranet/src/app/api/blog/sync/route.ts` — sync incremental (delta
  desde el último sync exitoso), mismo patrón de auth que
  `client-index/sync` (Bearer `CRON_SECRET` o sesión `super_admin`).
  **No tiene cron configurado todavía** — falta tocar `vercel.json` si se
  quiere automatizar.

## Bug real encontrado y corregido durante la ejecución

Primer intento del backfill: 7 assets fallaron con URLs corruptas tipo
`.../Meloncash-Intro.m4a Cambios Migratorios en España para Latinos (2025)...`
— parecía basura random pero tenía causa exacta: **6 posts de octubre 2025
tienen el meta `description` de Yoast mal auto-generado**, con una URL de
audio pegada directo al título del siguiente post sin separador real dentro
del string JSON. La regex de `extractSchemaImageUrls` (`extract.ts`) usaba
`/https?:\/\/[^"\\]+/g` — no paraba en espacios, así que capturaba la URL +
toda la frase suelta como si fuera parte del link. Fix: agregar `\s` a la
clase excluida (`/https?:\/\/[^"\\\s]+/g`). Después del fix: 120/121 assets
bajaron bien.

## Resultado final (backfill del rango de 2 años)

```json
{
  "postsFetched": 84,
  "postsUpserted": 84,
  "postsFailed": 0,
  "assetsDownloaded": 120,
  "assetsFailed": 1,
  "categoriesInferred": 37
}
```

- **84/84 posts** migrados, autosuficientes (nada depende de wp-content).
- **1 asset fallido permanente**: `wp-content/uploads/2020/06/icon.png` (logo
  del sitio, referenciado en el JSON-LD de todos los posts) — **ya no existe
  en el servidor de WordPress**, 404 real, no es un bug del código. El post
  afectado conserva la URL original (dead link) en `seo_schema`, no rompe nada.
- Verificado en vivo contra Supabase:
  `select count(*), count(audio_url), count(*) filter (where category_inferred), count(featured_image_url) from blog.posts`
  → 84 total, 33 con audio, 37 con categoría inferida, 83 con imagen.
- Un puñado de posts con categoría inferida son genuinamente fuera de tema del
  blog (geopolítica, gestión empresarial — ej. "Trump anuncia un plan de paz
  para Gaza", "Ahorro de Horas Hombre: Activo Clave en Empresas") — Claude
  correctamente se negó a forzarlos en una categoría real y el código cayó al
  fallback (`59: Vivir en Europa`). No es un bug, es contenido raro publicado
  en este blog que no encaja bien en ninguna categoría.

## Lo que NO se migró (decisión explícita del usuario)

**Los 82 posts anteriores a 2024-08-19 (histórico completo desde
2020-10-01) siguen SOLO en WordPress, no están en Supabase.** Se preguntó
explícitamente si migrar todo el histórico y el usuario eligió NO hacerlo por
ahora. **Riesgo real: si WordPress se apaga antes de correr ese backfill,
esos 82 posts se pierden para siempre.** El comando ya está listo para
cuando se decida:

```bash
cd apps/intranet && pnpm blog:backfill --since 2020-01-01
```

## Pendiente / próximos pasos

1. **Backfill histórico** (82 posts pre-2024-08-19) — solo si deciden
   migrarlo antes de apagar WordPress.
2. **Cron del sync incremental** (`/api/blog/sync`) — no configurado, los
   posts nuevos que se publiquen en WordPress de ahora en más no se copian
   solos hasta que se agregue a `vercel.json`.
3. **Frontend de reemplazo** — los datos ya están en Supabase, pero hoy
   `pro-corp.net/{slug}/` lo sigue sirviendo WordPress. Si se apaga
   WordPress sin un frontend nuevo sirviendo esas mismas URLs, se rompe todo
   el SEO indexado de 166 posts. No se diseñó todavía, es el siguiente
   bloqueante real.
4. **Revisión editorial opcional** de los 37 posts con
   `category_inferred = true` — filtrable directo con esa columna.
