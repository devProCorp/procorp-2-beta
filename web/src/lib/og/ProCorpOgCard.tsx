import type { CSSProperties } from "react";

export const PRO_CORP_OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

interface ProCorpOgCardProps {
  title: string;
  subtitle: string;
  domain: string;
  imageUrl?: string;
  eyebrow?: string;
}

const absolute: CSSProperties = {
  position: "absolute",
  display: "flex",
};

function truncate(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

/** Shared 1200×630 social card built only with ImageResponse-safe CSS. */
export function ProCorpOgCard({
  title,
  subtitle,
  domain,
  imageUrl,
  eyebrow,
}: ProCorpOgCardProps) {
  const hasImage = Boolean(imageUrl);
  // Long titles (journal articles) drop to a smaller size and up to 3 lines.
  const displayTitle = truncate(title, hasImage ? 84 : 100);
  const longTitle = displayTitle.length > (hasImage ? 50 : 68);
  const displaySubtitle = truncate(
    subtitle,
    longTitle ? (hasImage ? 110 : 120) : hasImage ? 150 : 170,
  );
  const titleSize = hasImage
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
  const textWidth = hasImage ? 600 : 820;
  const sidePadding = hasImage ? 58 : 72;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "linear-gradient(118deg, #171A20 0%, #101216 72%)",
        color: "#F7F7F5",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {hasImage ? (
        <div
          style={{
            ...absolute,
            right: 0,
            top: 0,
            width: 470,
            height: 630,
            overflow: "hidden",
            borderLeft: "10px solid #CE1026",
            background: "#1E222A",
          }}
        >
          {/* The generator pre-fetches this image; failures never reach here. */}
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
              left: 0,
              top: 0,
              width: 74,
              height: 630,
              background:
                "linear-gradient(90deg, rgba(16,18,22,0.56) 0%, rgba(16,18,22,0) 100%)",
            }}
          />
        </div>
      ) : (
        <>
          <div
            style={{
              ...absolute,
              right: 0,
              top: 0,
              width: 390,
              height: 630,
              background: "linear-gradient(180deg, #1E222A 0%, #15181E 100%)",
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
          <div
            style={{
              ...absolute,
              right: 82,
              top: 94,
              width: 178,
              height: 178,
              borderTop: "12px solid #CE1026",
              borderRight: "12px solid #CE1026",
            }}
          />
          <div
            style={{
              ...absolute,
              right: 82,
              bottom: 92,
              width: 178,
              height: 178,
              borderBottom: "12px solid rgba(206,16,38,0.48)",
              borderLeft: "12px solid rgba(206,16,38,0.48)",
            }}
          />
        </>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: `${hasImage ? 48 : 58}px ${sidePadding}px 0`,
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 27,
            background: "#CE1026",
            color: "white",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          PC
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 1.2,
            }}
          >
            PRO CORP
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 3,
              color: "#A7ADB7",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 2.1,
            }}
          >
            BUSINESS ENGINEERING
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: textWidth,
          margin: `${hasImage ? 58 : 72}px ${sidePadding}px 0`,
        }}
      >
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              marginBottom: 16,
              color: "#E74A5D",
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
            maxHeight: titleSize * (longTitle ? 3.4 : 2.3),
            overflow: "hidden",
            color: "#F7F7F5",
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: -2.7,
          }}
        >
          {displayTitle}
        </div>
        <div
          style={{
            display: "flex",
            width: hasImage ? 590 : 760,
            maxHeight: hasImage ? 105 : 112,
            overflow: "hidden",
            marginTop: 22,
            color: "#B8BDC6",
            fontSize: hasImage ? 23 : 26,
            fontWeight: 400,
            lineHeight: 1.35,
          }}
        >
          {displaySubtitle}
        </div>
      </div>

      <div
        style={{
          ...absolute,
          left: sidePadding,
          right: hasImage ? 500 : 72,
          bottom: 49,
          height: 1,
          background: "rgba(255,255,255,0.16)",
        }}
      />
      <div
        style={{
          ...absolute,
          left: sidePadding,
          bottom: 45,
          width: 154,
          height: 9,
          background: "#CE1026",
        }}
      />
      <div
        style={{
          ...absolute,
          // Satori rejects CSS properties whose value is undefined.
          ...(hasImage ? { left: sidePadding } : { right: 72 }),
          bottom: 20,
          color: "#A7ADB7",
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        {domain}
      </div>
    </div>
  );
}
