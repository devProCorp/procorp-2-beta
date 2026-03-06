"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function JournalHeader() {
  const { t } = useLanguage();

  return (
    <header className="mb-20 relative">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 uppercase text-white leading-[1.05] drop-shadow-2xl">
        {t("journal.title")}
        <span className="text-primary-light drop-shadow-[0_0_15px_rgba(206,16,38,0.5)]">.</span>
      </h1>
      <p className="max-w-xl text-lg md:text-xl text-gray-300 font-light leading-relaxed border-l-4 border-primary pl-6">
        {t("journal.desc")}
      </p>
    </header>
  );
}
