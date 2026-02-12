"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    router.push(qs ? `/journal?${qs}` : "/journal");
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-20 font-ui">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/60 border border-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
      >
        Prev
      </button>

      <span className="text-sm text-white/50 tracking-widest">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white/60 border border-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
      >
        Next
      </button>
    </div>
  );
}
