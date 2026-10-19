"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { WPCategory } from "@/lib/wordpress-presentation";
import { catName } from "@/lib/blog-categories";

interface CategoryFilterProps {
  categories: WPCategory[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  const active = searchParams.get("cat") ?? "";

  function handleClick(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === active) {
      params.delete("cat");
    } else {
      params.set("cat", slug);
      params.delete("page");
    }
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : "/blog");
  }

  return (
    <div className="sticky top-20 z-40 bg-background-dark/80 backdrop-blur-xl py-6 mb-12 -mx-4 px-4 md:px-0 md:mx-0 border-b border-surface-border/50 supports-[backdrop-filter]:bg-background-dark/60">
      <div className="flex gap-4 overflow-x-auto pb-4 items-center hide-scrollbar">
        <span className="text-gray-500 text-[10px] font-bold mr-2 whitespace-nowrap uppercase tracking-[0.2em]">{t("journal.filter.by")}</span>
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("cat");
            params.delete("page");
            const qs = params.toString();
            router.push(qs ? `/blog?${qs}` : "/blog");
          }}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-6 transition-all text-[11px] font-bold uppercase tracking-widest ${!active
              ? "bg-primary text-white shadow-[0_0_15px_rgba(206,16,38,0.4)] border border-primary-light/50"
              : "glass-panel text-gray-400 hover:text-white border border-surface-border hover:border-primary/50 hover:bg-surface-dark"
            }`}
        >
          {t("journal.filter.all")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-6 transition-all text-[11px] font-bold uppercase tracking-widest ${active === cat.slug
                ? "bg-primary text-white shadow-[0_0_15px_rgba(206,16,38,0.4)] border border-primary-light/50"
                : "glass-panel text-gray-400 hover:text-white border border-surface-border hover:border-primary/50 hover:bg-surface-dark"
              }`}
          >
            {catName(cat.slug, cat.name, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}
