// COPIA de packages/ui/src/ProCorpOgCard.tsx (repo pro-corp-platform): cambiar ambos.
import type { CSSProperties } from "react";
import {
  DEFAULT_OG_CONFIG,
  OG_ACCENTS,
  OG_BACKGROUNDS,
  type OgLayoutConfig,
} from "./config";
import { PRO_CORP_LOGO, PRO_CORP_LOGO_WHITE } from "./logo";

export const PRO_CORP_OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

interface ProCorpOgCardProps {
  title: string;
  subtitle: string;
  domain: string;
  /** Foto ya preparada (data URL) al tamaño de ogPhotoSize(config). */
  imageUrl?: string;
  eyebrow?: string;
  /** Diseño editable desde el Taller de tarjetas; por defecto, el clásico. */
  config?: OgLayoutConfig;
}

const absolute: CSSProperties = {
  position: "absolute",
  display: "flex",
};

const LOGO_WIDTH = { s: 200, m: 280, l: 360 } as const;

function truncate(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function rgba(hex: string, alpha: number) {
  const value = parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
}

/** Tamaño del título y límites de texto según espacio y máximo de líneas. */
function measureText(
  title: string,
  subtitle: string,
  narrow: boolean,
  maxLines: 2 | 3,
) {
  if (maxLines === 2) {
    const displayTitle = truncate(title, narrow ? 50 : 68);
    const size = narrow
      ? displayTitle.length > 38
        ? 48
        : displayTitle.length > 24
          ? 56
          : 64
      : displayTitle.length > 52
        ? 54
        : displayTitle.length > 32
          ? 62
          : 72;
    return {
      displayTitle,
      displaySubtitle: truncate(subtitle, narrow ? 180 : 220),
      size,
      lines: 2.3,
    };
  }

  // Títulos largos (artículos): letra menor y hasta 3 líneas.
  const displayTitle = truncate(title, narrow ? 84 : 100);
  const long = displayTitle.length > (narrow ? 50 : 68);
  const size = narrow
    ? displayTitle.length > 60
      ? 40
      : displayTitle.length > 38
        ? 48
        : displayTitle.length > 24
          ? 56
          : 64
    : displayTitle.length > 68
      ? 48
      : displayTitle.length > 52
        ? 54
        : displayTitle.length > 32
          ? 62
          : 72;
  return {
    displayTitle,
    displaySubtitle: truncate(
      subtitle,
      long ? (narrow ? 110 : 120) : narrow ? 150 : 170,
    ),
    size,
    lines: long ? 3.4 : 2.3,
  };
}

/** Shared 1200×630 social card built only with ImageResponse-safe CSS. */
export function ProCorpOgCard({
  title,
  subtitle,
  domain,
  imageUrl,
  eyebrow,
  config = DEFAULT_OG_CONFIG,
}: ProCorpOgCardProps) {
  const layout =
    imageUrl && config.layout !== "no-photo" ? config.layout : "no-photo";
  const panel = layout === "photo-right" || layout === "photo-left";
  const hasImage = layout !== "no-photo";

  const background = OG_BACKGROUNDS[config.background];
  // Acento rojo sobre fondo rojo no se vería: pasa a blanco.
  const accent =
    config.background === "rojo" && config.accent === "rojo"
      ? OG_ACCENTS.blanco
      : OG_ACCENTS[config.accent];
  const warmBackground =
    config.background === "rojo" || config.background === "granate";
  const subtitleColor = warmBackground ? "#F1DCDF" : "#B8BDC6";
  const mutedColor = warmBackground ? "#E9C9CD" : "#A7ADB7";

  const sidePadding = panel ? 58 : 72;
  const textLeft = layout === "photo-left" ? 470 + sidePadding : sidePadding;
  const textWidth = panel ? 600 : 820;
  const topMargin = panel ? 48 : 58;

  const text = measureText(title, subtitle, panel, config.titleMaxLines);
  const titleSize = Math.round(text.size * config.titleScale);
  const centered = config.titleAlign === "center";

  // El logo en color (rojo) desaparece sobre fondo rojo: ahí siempre va blanco.
  const logo =
    config.logoVariant === "white" || config.background === "rojo"
      ? PRO_CORP_LOGO_WHITE
      : PRO_CORP_LOGO;
  const logoWidth = LOGO_WIDTH[config.logoSize];
  const logoHeight = Math.round((logoWidth * logo.height) / logo.width);
  const logoImage = (
    <img
      src={logo.src}
      alt="PRO CORP"
      width={logoWidth}
      height={logoHeight}
      style={{ width: logoWidth, height: logoHeight }}
    />
  );
  const logoSideInset =
    layout === "photo-right" || layout === "photo-background" ? 40 : 72;
  const domainOnLeft = hasImage || config.logoPosition === "bottom-right";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: `linear-gradient(118deg, ${background.from} 0%, ${background.to} 72%)`,
        color: "#F7F7F5",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {layout === "photo-background" ? (
        <div style={{ ...absolute, left: 0, top: 0, width: 1200, height: 630 }}>
          {/* The generator pre-fetches this image; failures never reach here. */}
          <img
            src={imageUrl}
            alt=""
            width={1200}
            height={630}
            style={{ width: 1200, height: 630, objectFit: "cover" }}
          />
          <div
            style={{
              ...absolute,
              left: 0,
              top: 0,
              width: 1200,
              height: 630,
              background: `linear-gradient(90deg, ${rgba(background.solid, config.overlayOpacity)} 0%, ${rgba(background.solid, config.overlayOpacity * 0.78)} 58%, ${rgba(background.solid, config.overlayOpacity * 0.35)} 100%)`,
            }}
          />
        </div>
      ) : null}

      {panel ? (
        <div
          style={{
            ...absolute,
            ...(layout === "photo-right"
              ? { right: 0, borderLeft: `10px solid ${accent.bar}` }
              : { left: 0, borderRight: `10px solid ${accent.bar}` }),
            top: 0,
            width: 470,
            height: 630,
            overflow: "hidden",
            background: "#1E222A",
          }}
        >
          <img
            src={imageUrl}
            alt=""
            width={460}
            height={630}
            style={{
              width: 460,
              height: 630,
              objectFit: "cover",
            }}
          />
          <div
            style={{
              ...absolute,
              ...(layout === "photo-right" ? { left: 0 } : { right: 0 }),
              top: 0,
              width: 74,
              height: 630,
              background: `linear-gradient(${layout === "photo-right" ? 90 : 270}deg, rgba(16,18,22,0.56) 0%, rgba(16,18,22,0) 100%)`,
            }}
          />
        </div>
      ) : null}

      {layout === "no-photo" && config.showDecor ? (
        <>
          <div
            style={{
              ...absolute,
              right: 0,
              top: 0,
              width: 390,
              height: 630,
              background: warmBackground
                ? "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.22) 100%)"
                : "linear-gradient(180deg, #1E222A 0%, #15181E 100%)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          {[910, 1040, 1170].map((left) => (
            <div
              key={left}
              style={{
                ...absolute,
                left,
                top: 0,
                width: 1,
                height: 630,
                background: "rgba(255,255,255,0.06)",
              }}
            />
          ))}
          {[158, 315, 472].map((top) => (
            <div
              key={top}
              style={{
                ...absolute,
                right: 0,
                top,
                width: 390,
                height: 1,
                background: "rgba(255,255,255,0.06)",
              }}
            />
          ))}
          {config.logoPosition !== "top-right" ? (
            <div
              style={{
                ...absolute,
                right: 82,
                top: 94,
                width: 178,
                height: 178,
                borderTop: `12px solid ${accent.bar}`,
                borderRight: `12px solid ${accent.bar}`,
              }}
            />
          ) : null}
          <div
            style={{
              ...absolute,
              right: 82,
              bottom: 92,
              width: 178,
              height: 178,
              borderBottom: `12px solid ${rgba(accent.bar, 0.48)}`,
              borderLeft: `12px solid ${rgba(accent.bar, 0.48)}`,
            }}
          />
        </>
      ) : null}

      {/* Logo: en el flujo arriba a la izquierda; en otra posición, el hueco se
          mantiene para que el texto no cambie de altura. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: logoHeight,
          margin: `${topMargin}px 0 0 ${textLeft}px`,
        }}
      >
        {config.logoPosition === "top-left" ? logoImage : null}
      </div>
      {config.logoPosition === "top-right" ? (
        <div style={{ ...absolute, top: topMargin, right: logoSideInset }}>
          {logoImage}
        </div>
      ) : null}
      {config.logoPosition === "bottom-right" ? (
        <div style={{ ...absolute, bottom: 34, right: logoSideInset }}>
          {logoImage}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          ...(centered ? { alignItems: "center" } : {}),
          width: textWidth,
          margin: `${panel ? 58 : 72}px 0 0 ${textLeft}px`,
        }}
      >
        {eyebrow && config.showEyebrow ? (
          <div
            style={{
              display: "flex",
              marginBottom: 16,
              color: accent.eyebrow,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            ...(centered
              ? { justifyContent: "center", textAlign: "center" }
              : {}),
            maxHeight: titleSize * text.lines,
            overflow: "hidden",
            color: "#F7F7F5",
            fontSize: titleSize,
            fontWeight: config.titleWeight,
            lineHeight: 1.12,
            letterSpacing: -2.7,
          }}
        >
          {text.displayTitle}
        </div>
        {config.showSubtitle && text.displaySubtitle ? (
          <div
            style={{
              display: "flex",
              ...(centered
                ? { justifyContent: "center", textAlign: "center" }
                : {}),
              width: panel ? 590 : 760,
              maxHeight: panel ? 105 : 112,
              overflow: "hidden",
              marginTop: 22,
              color: subtitleColor,
              fontSize: panel ? 23 : 26,
              fontWeight: 400,
              lineHeight: 1.35,
            }}
          >
            {text.displaySubtitle}
          </div>
        ) : null}
      </div>

      {/* Elementos absolutos sueltos: dentro de un fragmento <> Satori los
          posiciona mal (la barra subía hasta el subtítulo). */}
      {config.showAccentBar ? (
        <div
          style={{
            ...absolute,
            left: textLeft,
            right: layout === "photo-right" ? 500 : 72,
            bottom: 49,
            height: 1,
            background: "rgba(255,255,255,0.16)",
          }}
        />
      ) : null}
      {config.showAccentBar ? (
        <div
          style={{
            ...absolute,
            left: textLeft,
            bottom: 45,
            width: 154,
            height: 9,
            background: accent.bar,
          }}
        />
      ) : null}
      {config.showDomain ? (
        <div
          style={{
            ...absolute,
            // Satori rejects CSS properties whose value is undefined.
            ...(domainOnLeft ? { left: textLeft } : { right: 72 }),
            bottom: 20,
            color: mutedColor,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: 0.3,
          }}
        >
          {domain}
        </div>
      ) : null}
    </div>
  );
}
