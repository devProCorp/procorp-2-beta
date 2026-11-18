"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight } from "lucide-react";
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
      className="mt-10 rounded-xl border border-blog-border bg-blog-surface p-6 md:p-8"
    >
      <h2
        id="invertir-con-pro-corp"
        className="m-0 font-blog-title text-2xl md:text-[1.625rem] font-bold leading-tight text-blog-text"
      >
        {t("journal.invest.title")}
      </h2>
      <p className="mt-3 mb-0 text-base leading-relaxed text-blog-soft">
        {t("journal.invest.text")}
      </p>
      <a
        href={href}
        onClick={() => trackArticle(postId, "invest")}
        target="_blank"
        rel="noopener"
        className="mt-6 inline-flex h-[46px] items-center gap-2 rounded-lg bg-primary px-5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
      >
        {t("journal.invest.button")}
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </section>
  );
}
