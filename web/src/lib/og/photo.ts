// COPIA de packages/ui/src/og/photo.ts (repo pro-corp-platform): cambiar ambos.
// Preparación de fotos para las tarjetas (servidor). Entrada propia del paquete
// (@pro-corp/ui/og-photo) para que sólo la carguen las apps que tienen sharp.
import sharp from "sharp";

const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

function isPrivateHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  )
    return true;
  const v4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  return (
    host === "::1" ||
    host.startsWith("fc") ||
    host.startsWith("fd") ||
    host.startsWith("fe80")
  );
}

/** Descarga una imagen pública (https/http, sin redirecciones ni hosts internos). */
export async function fetchPublicImage(
  url: string | null | undefined,
  timeoutMs = 4000,
) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (
      !["https:", "http:"].includes(parsed.protocol) ||
      isPrivateHost(parsed.hostname)
    ) {
      return null;
    }
    const response = await fetch(parsed, {
      redirect: "error",
      signal: AbortSignal.timeout(timeoutMs),
    });
    const type = response.headers.get("content-type")?.split(";")[0] ?? "";
    if (!response.ok || !type.startsWith("image/")) return null;
    if (Number(response.headers.get("content-length") ?? 0) > MAX_SOURCE_BYTES)
      return null;
    const bytes = Buffer.from(await response.arrayBuffer());
    return bytes.length && bytes.length <= MAX_SOURCE_BYTES ? bytes : null;
  } catch {
    return null;
  }
}

/**
 * Recorta la foto al tamaño pedido respetando un punto de encuadre (en % del
 * original) y la devuelve como data URL JPEG lista para la tarjeta.
 */
export async function cropPhotoToDataUrl(
  source: Buffer,
  size: { width: number; height: number },
  focal?: { x?: number; y?: number },
) {
  const image = sharp(source, { limitInputPixels: 40_000_000 }).rotate();
  const meta = await image.metadata();
  // Tras .rotate() las dimensiones útiles son las orientadas.
  const swap = (meta.orientation ?? 1) >= 5;
  const width = (swap ? meta.height : meta.width) ?? size.width;
  const height = (swap ? meta.width : meta.height) ?? size.height;

  const scale = Math.max(size.width / width, size.height / height);
  const resizedWidth = Math.max(size.width, Math.ceil(width * scale));
  const resizedHeight = Math.max(size.height, Math.ceil(height * scale));
  const fx = (focal?.x ?? 50) / 100;
  const fy = (focal?.y ?? 50) / 100;
  const left = Math.min(
    resizedWidth - size.width,
    Math.max(0, Math.round(resizedWidth * fx - size.width / 2)),
  );
  const top = Math.min(
    resizedHeight - size.height,
    Math.max(0, Math.round(resizedHeight * fy - size.height / 2)),
  );

  const jpeg = await image
    .resize(resizedWidth, resizedHeight, { fit: "fill" })
    .extract({ left, top, width: size.width, height: size.height })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

/** Foto lista para la tarjeta, o undefined si no hay o no se pudo leer. */
export async function prepareCardPhoto(
  url: string | null | undefined,
  size: { width: number; height: number },
  focal?: { x?: number; y?: number },
) {
  const source = await fetchPublicImage(url);
  if (!source) return undefined;
  try {
    return await cropPhotoToDataUrl(source, size, focal);
  } catch {
    return undefined;
  }
}

/** Pasa una tarjeta PNG (o una imagen terminada) a JPEG 1200×630 ≤ ~300 KB. */
export async function toCardJpeg(input: Buffer, cover = false) {
  let pipeline = sharp(input, { limitInputPixels: 40_000_000 }).rotate();
  if (cover) pipeline = pipeline.resize(1200, 630, { fit: "cover" });
  const flat = pipeline.flatten({ background: "#101216" });
  for (const quality of [84, 76, 68, 60]) {
    const jpeg = await flat.clone().jpeg({ quality, mozjpeg: true }).toBuffer();
    if (jpeg.length <= 300 * 1024 || quality === 60) return jpeg;
  }
  throw new Error("unreachable");
}
