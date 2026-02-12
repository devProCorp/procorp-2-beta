"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { WPCategory } from "@/lib/wordpress";

interface CategoryFilterProps {
  categories: WPCategory[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
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
    router.push(qs ? `/journal?${qs}` : "/journal");
  }

  return (
    <div className="flex flex-wrap gap-3 mb-16">
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("cat");
          params.delete("page");
          const qs = params.toString();
          router.push(qs ? `/journal?${qs}` : "/journal");
        }}
        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border rounded-full transition-colors font-ui ${
          !active
            ? "bg-primary text-white border-primary"
            : "border-white/20 text-white/60 hover:border-primary hover:text-primary"
        }`}
      >
        {t("projects.filter.all")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleClick(cat.slug)}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border rounded-full transition-colors font-ui ${
            active === cat.slug
              ? "bg-primary text-white border-primary"
              : "border-white/20 text-white/60 hover:border-primary hover:text-primary"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
