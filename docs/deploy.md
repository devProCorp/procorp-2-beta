# Cómo hacer deploy a producción

## Vía normal (recomendada) — GitHub Actions

1. Entra a: https://github.com/devProCorp/procorp-2-beta/actions/workflows/deploy-produccion.yml
2. Click en **"Run workflow"** (arriba a la derecha).
3. Selecciona la rama `main` y confirma con el botón verde **"Run workflow"**.

Esto dispara `deploy-produccion.yml`, que:
1. Corre `web/scripts/deploy-produccion.sh --yes` (snapshot de Supabase → build → guardas de seguridad → `rsync` a producción vía SSH con la clave `ci-deploy` ya guardada como secret en GitHub).
2. Purga la caché de Sucuri (best-effort, vía SSH al propio servidor de producción — no desde el runner, porque Sucuri bloquea el IP de GitHub Actions).

No hace falta `gh` CLI, claves SSH locales ni tocar `~/.ssh/`. Requiere solo tener sesión iniciada en GitHub con permiso sobre el repo.

## ¿Cuándo hace falta correr esto?

- **Cambios de código** (páginas, componentes, estilos): sí, hace falta — primero commitear y pushear a `main`, luego correr el workflow.
- **Posts del blog publicados desde el panel/CMS**: NO hace falta — `/journal` lee en vivo desde Supabase en el navegador del visitante, así que un post publicado se ve al instante. El deploy solo sirve para que el **sitemap estático** recoja el post nuevo más rápido.

Antes de correr el workflow "porque sí", conviene revisar si `main` ya tiene todo lo que se quiere publicar:

```bash
git status --short              # cambios sin commitear
git log origin/main..main       # commits locales sin pushear
```

Si ambos salen vacíos, correr el workflow solo reconstruye y republica lo mismo que ya está en producción.

## Después de correr el deploy

La purga de caché de Sucuri es automática pero puede tardar en propagarse. Si entras al sitio justo después del deploy y ves la versión anterior, probablemente sea caché, no un deploy fallido.

## Notas técnicas (por si hace falta debug)

- Función Edge `supabase/functions/trigger-deploy/index.ts`: dispara este mismo workflow vía `workflow_dispatch` de la API de GitHub, usada por el flujo de publicar posts desde `web/src/app/journal/preview/page.tsx` (`triggerDeploy()` en `web/src/lib/journal-live.ts`). Es un camino alterno al botón manual, pensado para el flujo de publicación de blog, no para deploys de código.
- El script `web/scripts/deploy-produccion.sh` **no** se debe correr localmente con `--yes` a mano — esa flag es solo para CI. Localmente pide escribir `publicar` para confirmar.
- Producción es un `document root` compartido con WordPress, `/login/`, `/crm/` y microsites — el script nunca borra archivos remotos (`--delete` no se usa) ni toca `.htaccess`.
- Ver también: `docs/decisions/0003-blog-fetch-via-edge-function.md`, `docs/decisions/0004-journal-live-fetch.md`, `docs/decisions/0004-n8n-publish-edge-function.md`.
