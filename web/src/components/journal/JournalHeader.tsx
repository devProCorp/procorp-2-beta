"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function JournalHeader() {
  const { t } = useLanguage();

  return (
    <header className="mb-8">
      <h1 className="m-0 font-blog-title text-[2.75rem] font-bold leading-[1.05] tracking-[-0.025em] text-blog-text md:text-[3.5rem]">
        {t("journal.title")}
      </h1>
      <p className="mt-3.5 mb-0 max-w-[60ch] text-lg leading-relaxed text-blog-soft text-pretty md:text-[19px]">
        {t("journal.desc")}
      </p>
    </header>
  );
}
