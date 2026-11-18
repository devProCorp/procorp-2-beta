"use client";

// Reproductor propio del blogcast (propuesta B): sustituye al <audio> gris del
// navegador que traía el HTML del artículo (se oculta con .con-reproductor).
// Sigue siendo un <audio> nativo por dentro, así que ArticleTracker cuenta la
// escucha igual y el teclado y los lectores de pantalla tienen controles reales.

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SPEEDS = [1, 1.25, 1.5, 2];

function clock(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function BlogcastPlayer({ src }: { src: string }) {
  const { t } = useLanguage();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => setError(true));
    else a.pause();
  };

  return (
    <section
      aria-labelledby="blogcast-titulo"
      className="flex items-center gap-4 rounded-xl border border-blog-border bg-blog-surface p-4 sm:gap-[18px] sm:px-5 sm:py-[18px]"
    >
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setError(true)}
      />
      <button
        type="button"
        onClick={toggle}
        disabled={error}
        aria-label={t(playing ? "journal.player.pause" : "journal.player.play")}
        className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light sm:h-[52px] sm:w-[52px]"
      >
        {playing ? <Pause size={20} aria-hidden="true" fill="currentColor" /> : <Play size={20} aria-hidden="true" fill="currentColor" className="ml-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <h2 id="blogcast-titulo" className="m-0 font-blog text-base font-semibold text-blog-text">
          {t("journal.player.title")}
        </h2>
        <p className="mt-0.5 mb-2 text-sm text-blog-meta">
          {error ? t("journal.player.error") : t("journal.player.sub")}
        </p>
        <div className="flex items-center gap-2.5 text-[13px] tabular-nums text-blog-meta">
          <span>{clock(time)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(time, duration || 0)}
            onChange={(e) => {
              if (audio.current) audio.current.currentTime = Number(e.target.value);
            }}
            aria-label={t("journal.player.seek")}
            aria-valuetext={`${clock(time)} / ${clock(duration)}`}
            disabled={!duration}
            className="blogcast-range h-1 min-w-0 flex-1 cursor-pointer"
            style={{ ["--progreso" as string]: `${duration ? (time / duration) * 100 : 0}%` }}
          />
          <span>{clock(duration)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
        aria-label={`${t("journal.player.speed")}: ${speed}×`}
        className="h-9 flex-none rounded-lg border border-blog-control px-2.5 text-[13px] font-semibold tabular-nums text-blog-text transition-colors hover:border-blog-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
      >
        {speed}×
      </button>
    </section>
  );
}
