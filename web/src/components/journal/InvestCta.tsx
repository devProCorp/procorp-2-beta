"use client";

import { useLanguage } from "@/context/LanguageContext";
import { trackArticle } from "@/lib/journal-engagement";

/**
 * Invitation at the end of every article to register in the investment
 * diagnosis of inversion.pro-corp.net (investor path: risk profile and the
 * open projects that fit it). Same URL pattern as the top bar link; the UTM
 * tags are stored with the registration, so the team sees which article
 * brought each reader.
 */
export default function InvestCta({ slug, postId }: { slug: string; postId: number }) {
  const { t, lang } = useLanguage();
  const base = process.env.NEXT_PUBLIC_INVERSION_URL ?? "https://inversion.pro-corp.net";
  const utm = new URLSearchParams({
    utm_source: "pro-corp.net",
    utm_medium: "blog",
    utm_campaign: "articulo",
    utm_content: slug,
  });
  const href = `${base}${lang === "es" ? "" : `/${lang}`}/diagnostico?${utm}`;

  return (
    <section
      aria-labelledby="invertir-con-pro-corp"
      className="mt-16 rounded-xl border border-white/10 bg-white/[0.03] p-6 md:p-10"
    >
      <h2
        id="invertir-con-pro-corp"
        className="font-ui text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight"
      >
        {t("journal.invest.title")}
      </h2>
      <p className="font-ui mt-4 text-base md:text-lg leading-relaxed text-white/75">
        {t("journal.invest.text")}
      </p>
      <a
        href={href}
        onClick={() => trackArticle(postId, "invest")}
        target="_blank"
        rel="noopener"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-light px-6 py-3 text-sm font-bold text-white transition-colors font-ui"
      >
        {t("journal.invest.button")}
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          arrow_forward
        </span>
      </a>
    </section>
  );
}
