"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function JournalHeader() {
  const { t } = useLanguage();

  return (
    <header className="mb-12 md:mb-16">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.05]">
        {t("journal.title")}
      </h1>
      <p className="max-w-[62ch] text-lg md:text-xl text-gray-300 leading-relaxed text-pretty">
        {t("journal.desc")}
      </p>
    </header>
  );
}
