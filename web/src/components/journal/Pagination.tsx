"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const BTN =
  "inline-flex h-11 items-center gap-2 rounded-full border border-blog-control px-5 text-sm font-medium text-blog-text transition-colors hover:border-blog-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light";
const BTN_OFF = "inline-flex h-11 items-center gap-2 rounded-full border border-blog-border px-5 text-sm font-medium text-blog-meta opacity-70";

/** Enlaces reales (no botones): se abren en otra pestaña y los buscadores los siguen. */
export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  if (totalPages <= 1) return null;

  function href(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  }

  const prev = currentPage > 1;
  const next = currentPage < totalPages;

  return (
    <nav aria-label={t("journal.pagination")} className="mt-12 mb-16 flex flex-wrap items-center justify-center gap-4">
      {prev ? (
        <Link href={href(currentPage - 1)} rel="prev" className={BTN}>
          <ArrowLeft size={16} aria-hidden="true" /> {t("journal.prev")}
        </Link>
      ) : (
        <span aria-disabled="true" className={BTN_OFF}>
          <ArrowLeft size={16} aria-hidden="true" /> {t("journal.prev")}
        </span>
      )}

      <span className="text-sm text-blog-meta tabular-nums" aria-current="page">
        {t("journal.pageOf").replace("{n}", String(currentPage)).replace("{total}", String(totalPages))}
      </span>

      {next ? (
        <Link href={href(currentPage + 1)} rel="next" className={BTN}>
          {t("journal.next")} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <span aria-disabled="true" className={BTN_OFF}>
          {t("journal.next")} <ArrowRight size={16} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
