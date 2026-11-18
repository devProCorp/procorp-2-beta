import type { Metadata } from "next";
import { Suspense } from "react";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalBrowser from "@/components/journal/JournalBrowser";
import NewsletterSection from "@/components/journal/NewsletterSection";

// Static shell only — no build-time snapshot. JournalBrowser fetches
// everything live from Supabase on mount, so this page never shows stale
// content that then jumps to the real thing. See
// docs/decisions/0004-journal-live-fetch.md.
export const metadata: Metadata = { alternates: { canonical: "/blog/" } };

export default function Journal() {
  return (
    <main className="min-h-screen bg-background-dark text-blog-text">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-10 md:px-8 md:pt-14">
        <JournalHeader />

        <Suspense fallback={null}>
          <JournalBrowser />
        </Suspense>
      </div>

      <NewsletterSection />
    </main>
  );
}
