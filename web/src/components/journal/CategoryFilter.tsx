"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { WPCategory } from "@/lib/wordpress";

interface CategoryFilterProps {
  categories: WPCategory[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    <div className="sticky top-20 z-40 bg-background-dark/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 md:px-0 md:mx-0 border-b border-surface-border/50">
      <div className="flex gap-3 overflow-x-auto pb-2 items-center">
        <span className="text-secondary text-xs font-medium mr-2 whitespace-nowrap uppercase tracking-wider">Filtrar por:</span>
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("cat");
            params.delete("page");
            const qs = params.toString();
            router.push(qs ? `/journal?${qs}` : "/journal");
          }}
          className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all text-sm font-bold ${
            !active
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-surface-dark hover:bg-[#333] border border-surface-border hover:border-primary/50 text-gray-300 hover:text-white"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all text-sm font-medium ${
              active === cat.slug
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-surface-dark hover:bg-[#333] border border-surface-border hover:border-primary/50 text-gray-300 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
