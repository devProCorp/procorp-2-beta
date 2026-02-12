"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function JournalHeader() {
  const { t } = useLanguage();

  return (
    <header className="mb-20">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 uppercase font-display text-white">
        {t("journal.title")}
        <span className="text-primary">.</span>
      </h1>
      <p className="max-w-xl text-lg text-white/70 font-light leading-relaxed font-ui">
        {t("journal.desc")}
      </p>
    </header>
  );
}
