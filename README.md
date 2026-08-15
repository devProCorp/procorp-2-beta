# Pro Corp 2.0

Sitio web corporativo de Pro Corp construido con Next.js. El proyecto genera una
exportación completamente estática para publicarse en el hosting compartido de
GoDaddy, donde Apache sirve los archivos HTML, CSS, JavaScript y recursos sin
necesidad de ejecutar Node.js en el servidor.

## Estructura del repositorio

- `web/`: aplicación Next.js.
- `web/src/app/`: páginas y rutas del sitio.
- `web/src/components/`: componentes visuales y de navegación.
- `web/content/journal/`: instantánea local de los artículos de WordPress.
- `web/public/`: imágenes, audio y otros archivos públicos.
- `web/scripts/deploy-beta.sh`: build y despliegue de `beta.pro-corp.net`.
- `web/deploy/htaccess-cutover`: `.htaccess` de producción que permite que el
  sitio estático conviva con WordPress y los portales existentes.

## Requisitos locales

- Node.js 18 o superior.
- Yarn 1.x.
- Acceso al repositorio en GitHub.
- Acceso SSH configurado con el alias `procorp-portal`.
- `rsync` disponible localmente.

La configuración SSH y las llaves son locales. Nunca deben guardarse en el
repositorio.

Ejemplo de configuración en `~/.ssh/config`:

```sshconfig
Host procorp-portal
    HostName <servidor>
    User <usuario>
    IdentityFile <ruta-a-la-llave-privada>
```

Comprueba el acceso sin abrir una sesión interactiva:

```bash
ssh -o BatchMode=yes procorp-portal 'pwd'
```

## Desarrollo local

```bash
cd web
yarn install --frozen-lockfile
yarn dev
```

El servidor de desarrollo queda disponible en `http://localhost:4000`.

Validaciones recomendadas antes de publicar:

```bash
cd web
yarn lint
NEXT_PUBLIC_SITE_URL=https://www.pro-corp.net yarn build
```

El build genera la exportación estática en `web/out/`. Las fuentes de Google se
descargan durante el proceso, por lo que el equipo necesita acceso a internet.

## Traer cambios antes de un despliegue

Verifica primero que no haya trabajo local sin guardar:

```bash
git status --short --branch
git fetch --prune origin
```

En la rama que se va a publicar, integra la versión aprobada de `main`:

```bash
git merge origin/main
```

No continúes si hay conflictos o archivos locales inesperados. Resuélvelos y
vuelve a ejecutar el build antes de conectarte al servidor.

## Despliegue por SSH a beta

El subdominio beta tiene un directorio exclusivo, por lo que puede utilizar el
script automatizado:

```bash
cd web
./scripts/deploy-beta.sh --dry-run
./scripts/deploy-beta.sh
```

El script compila con `NEXT_PUBLIC_NOINDEX=1`, conserva beta fuera de los
buscadores y sincroniza `out/` con `~/procorp-beta/`.

## Despliegue por SSH a producción

Producción usa `~/public_html/`. En ese directorio conviven el sitio estático,
WordPress, `/login/`, `/crm/` y varios micrositios.

> **Importante:** no ejecutes `deploy-beta.sh` contra producción y nunca uses
> `rsync --delete` sobre `public_html`. Hacerlo eliminaría WordPress y los demás
> portales que comparten el directorio.

### 1. Generar el build de producción

No definas `NEXT_PUBLIC_NOINDEX`:

```bash
cd web
yarn install --frozen-lockfile
NEXT_PUBLIC_SITE_URL=https://www.pro-corp.net yarn build
```

`yarn lint` sirve como auditoría adicional, pero actualmente reporta hallazgos
preexistentes en scripts auxiliares y efectos de React. El comando que debe
terminar correctamente para generar la exportación es `yarn build`. No confundas
un build exitoso con la revisión funcional posterior en el navegador.

Comprueba que el build existe y que no contiene referencias de beta o `noindex`:

```bash
test -f out/index.html
test -f out/robots.txt
rg 'beta\.pro-corp\.net|noindex' out/robots.txt out/sitemap.xml out/index.html
```

El último comando debe terminar sin coincidencias relevantes.

Antes de continuar, confirma que estás dentro de `web/` y que la exportación no
está vacía:

```bash
test "$(basename "$PWD")" = "web"
test -s out/index.html
test -s out/robots.txt
test -d out/_next
find out -type f | wc -l
du -sh out
```

Si cualquiera de los `test` falla, no ejecutes `rsync`.

### 2. Preparar el `.htaccess` de producción

`web/public/.htaccess` está diseñado para beta. No debe subirse como
configuración raíz de producción. Crea una copia temporal del build y reemplaza
allí el archivo:

```bash
PROCORP_STAGE_DIR="$(mktemp -d /tmp/procorp-prod-build.XXXXXX)"
cp -a out/. "$PROCORP_STAGE_DIR/"
cp deploy/htaccess-cutover "$PROCORP_STAGE_DIR/.htaccess"
test -s "$PROCORP_STAGE_DIR/index.html"
cmp deploy/htaccess-cutover "$PROCORP_STAGE_DIR/.htaccess"
```

Ejecuta los pasos siguientes en la misma terminal para conservar las variables
`PROCORP_STAGE_DIR` y `PROCORP_BACKUP_ID`. Si abres otra sesión, vuelve a definir
ambas con los valores correctos; nunca las dejes vacías ni las adivines.

El `.htaccess` de producción hace que Apache prefiera `index.html`, conserva la
caída a WordPress para las páginas heredadas y redirige los artículos antiguos a
`/journal/<slug>/`.

### 3. Inspeccionar y respaldar el servidor

Antes de sobrescribir archivos, verifica la identidad del servidor, el espacio,
la estructura y el estado actual. Estos comandos son de solo lectura:

```bash
ssh -o BatchMode=yes procorp-portal \
  'pwd; hostname; du -sh public_html; df -h .; \
   test -f public_html/wp-config.php && echo "WordPress: presente"; \
   test -d public_html/login && echo "login: presente"; \
   test -d public_html/crm && echo "crm: presente"'
```

Crea un identificador único y un snapshot completo de `public_html` antes de
publicar. `cp -al` crea enlaces duros en el mismo disco: conserva el contenido
anterior sin duplicar inicialmente los 43 GB del hosting.

```bash
PROCORP_BACKUP_ID="$(date +%Y%m%d-%H%M%S)"
echo "$PROCORP_BACKUP_ID"

ssh -o BatchMode=yes procorp-portal \
  "umask 077; mkdir -p backups-cutover/$PROCORP_BACKUP_ID && \
   chmod 700 backups-cutover/$PROCORP_BACKUP_ID && \
   cp -al public_html backups-cutover/$PROCORP_BACKUP_ID/public_html"
```

Guarda también una exportación independiente de la base de datos de WordPress.
El comando obtiene las credenciales desde `wp-config.php`; no las imprime ni las
guarda en el repositorio:

```bash
ssh -o BatchMode=yes procorp-portal \
  "umask 077; set -o pipefail; \
   wp --path=public_html db export - --quiet | \
   gzip > backups-cutover/$PROCORP_BACKUP_ID/wordpress.sql.gz"
```

Valida el respaldo antes de continuar:

```bash
ssh -o BatchMode=yes procorp-portal \
  "test -s backups-cutover/$PROCORP_BACKUP_ID/public_html/index.html && \
   test -s backups-cutover/$PROCORP_BACKUP_ID/public_html/.htaccess && \
   test -s backups-cutover/$PROCORP_BACKUP_ID/wordpress.sql.gz && \
   sha256sum \
     backups-cutover/$PROCORP_BACKUP_ID/public_html/index.html \
     backups-cutover/$PROCORP_BACKUP_ID/public_html/.htaccess && \
   du -sh backups-cutover/$PROCORP_BACKUP_ID"
```

Los respaldos de transición quedan en:

```text
~/backups-cutover/<fecha-y-hora>/
```

No continúes si falta `public_html`, `wp-config.php`, el snapshot, el SQL o si el
disco no tiene espacio suficiente.

### 4. Simular la sincronización

```bash
test -n "${PROCORP_STAGE_DIR:-}"
test -s "$PROCORP_STAGE_DIR/index.html"
test -s "$PROCORP_STAGE_DIR/.htaccess"

rsync -an \
  --checksum \
  --human-readable \
  --itemize-changes \
  --stats \
  -e ssh \
  "$PROCORP_STAGE_DIR/" \
  procorp-portal:public_html/
```

La `n` de `-an` significa *dry run*: no escribe nada. Revisa la salida completa.
No debe aparecer `deleting` y no se deben tocar `wp-admin/`, `wp-content/`,
`wp-includes/`, `login/`, `crm/` ni los micrositios. Si aparece alguna de esas
rutas, detente y revisa el origen y el destino.

### 5. Sincronizar el build

```bash
test -n "${PROCORP_STAGE_DIR:-}"
test -s "$PROCORP_STAGE_DIR/index.html"
test -s "$PROCORP_STAGE_DIR/.htaccess"

rsync -a \
  --checksum \
  --partial \
  --delay-updates \
  --omit-dir-times \
  --human-readable \
  --stats \
  -e ssh \
  "$PROCORP_STAGE_DIR/" \
  procorp-portal:public_html/
```

La barra final de `"$PROCORP_STAGE_DIR/"` es intencional: copia el contenido del
build dentro de `public_html/`.

No añadas ninguna de estas opciones al comando de producción:

- `--delete`, `--delete-before`, `--delete-after` o `--delete-excluded`.
- `--remove-source-files`.
- Una ruta remota distinta de `procorp-portal:public_html/` sin verificarla.

Tampoco ejecutes `rm`, `find -delete`, `git clean` ni limpiezas recursivas en el
servidor durante el despliegue. El flujo de producción solo añade o reemplaza
los archivos presentes en el build; no elimina archivos remotos.

### 6. Verificación posterior

Comprueba las rutas públicas principales:

```bash
curl -sSI https://www.pro-corp.net/
curl -sSI https://www.pro-corp.net/about/
curl -sSI https://www.pro-corp.net/projects/
curl -sSI https://www.pro-corp.net/journal/
curl -sSI https://www.pro-corp.net/login/
```

Confirma además por SSH que los archivos críticos continúan presentes:

```bash
ssh -o BatchMode=yes procorp-portal \
  'test -f public_html/wp-config.php && \
   test -d public_html/wp-admin && \
   test -d public_html/wp-content && \
   test -d public_html/login && \
   test -d public_html/crm && \
   echo "Archivos y portales críticos: presentes"'
```

También se debe verificar:

- Una URL antigua de WordPress responde `301` hacia `/journal/<slug>/`.
- El destino del artículo responde `200`.
- `robots.txt` permite indexación y apunta al sitemap de `www.pro-corp.net`.
- La portada contiene la URL canónica `https://www.pro-corp.net/`.
- Los audios, imágenes y archivos bajo `/_next/` responden `200`.
- `wp-config.php`, `/login/` y los demás portales siguen presentes.

Sucuri puede continuar sirviendo la versión anterior después de actualizar el
origen. Al finalizar el despliegue, purga la caché desde el panel de Sucuri y
repite las comprobaciones sin parámetros de query.

## Rollback

Si la validación falla:

1. No borres WordPress ni ningún portal existente.
2. Identifica el respaldo correcto y verifica su contenido antes de restaurar.
3. Restaura únicamente los archivos afectados. No uses `--delete` durante el
   rollback.
4. Si el problema está en la portada o el enrutamiento, restaura primero
   `index.html` y `.htaccess`:

   ```bash
   ssh -o BatchMode=yes procorp-portal \
     "cp backups-cutover/$PROCORP_BACKUP_ID/public_html/index.html public_html/index.html && \
      cp backups-cutover/$PROCORP_BACKUP_ID/public_html/.htaccess public_html/.htaccess"
   ```

5. Solo restaura la base de datos si una operación la modificó y después de
   confirmar que el archivo SQL corresponde al respaldo correcto. Un despliegue
   estático normal no modifica la base de datos.
6. Purga la caché de Sucuri.
7. Vuelve a comprobar inicio, Journal, `/login/` y los micrositios.

Conserva el respaldo hasta que el build haya sido validado tanto en el origen
como a través de Sucuri.

## Notas de seguridad

- Nunca guardes contraseñas, llaves privadas, tokens o credenciales de hosting
  en Git.
- Una credencial expuesta en código, terminal compartida o chat debe tratarse
  como comprometida y rotarse.
- Haz respaldo antes de cualquier cambio irreversible.
- Ejecuta primero `rsync --dry-run` y revisa el destino exacto.
- Producción y beta usan configuraciones distintas de indexación y Apache.
