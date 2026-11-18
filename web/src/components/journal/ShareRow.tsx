"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

const BTN =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blog-control text-blog-text transition-colors hover:border-blog-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light";

/** «Comparte este análisis»: LinkedIn, WhatsApp y copiar enlace. */
export default function ShareRow({ url, title }: { url: string; title: string }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* sin portapapeles: no hacemos nada */
    }
  };

  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-blog-border py-5">
      <p className="m-0 text-[15px] font-semibold text-blog-text">{t("journal.share")}</p>
      <div className="flex gap-2">
        <a
          className={BTN}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("journal.share.linkedin")}
        >
          <LinkedInIcon />
        </a>
        <a
          className={BTN}
          href={`https://wa.me/?text=${enc(`${title} ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("journal.share.whatsapp")}
        >
          <WhatsAppIcon />
        </a>
        <button type="button" onClick={copy} className={BTN} aria-label={t(copied ? "journal.share.copied" : "journal.share.copy")}>
          {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        </button>
        <span role="status" className="sr-only">
          {copied ? t("journal.share.copied") : ""}
        </span>
      </div>
    </div>
  );
}
