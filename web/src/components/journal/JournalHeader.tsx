"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function JournalHeader() {
  const { t } = useLanguage();

  return (
    <header className="mb-12">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 uppercase text-white leading-tight">
        {t("journal.title")}
        <span className="text-primary">.</span>
      </h1>
      <p className="max-w-xl text-lg text-secondary font-light leading-relaxed">
        {t("journal.desc")}
      </p>
    </header>
  );
}
