"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { WPCategory } from "@/lib/wordpress-presentation";
import { catName } from "@/lib/blog-categories";

interface CategoryFilterProps {
  categories: WPCategory[];
}

const CHIP =
  "flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light";
const CHIP_ON = "border-primary bg-primary text-white";
const CHIP_OFF = "border-blog-border-strong bg-blog-surface text-blog-text hover:border-blog-control";

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  const active = searchParams.get("cat") ?? "";

  function go(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!slug || slug === active) params.delete("cat");
    else params.set("cat", slug);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : "/blog", { scroll: false });
  }

  return (
    <div className="mb-10 border-b border-blog-border pb-7">
      <div
        role="group"
        aria-label={t("journal.filter.by").replace(/:$/, "")}
        className="flex items-center gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0 hide-scrollbar"
      >
        <button type="button" aria-pressed={!active} onClick={() => go("")} className={`${CHIP} ${!active ? CHIP_ON : CHIP_OFF}`}>
          {t("journal.filter.all")}
        </button>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            aria-pressed={active === cat.slug}
            onClick={() => go(cat.slug)}
            className={`${CHIP} ${active === cat.slug ? CHIP_ON : CHIP_OFF}`}
          >
            {catName(cat.slug, cat.name, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}
