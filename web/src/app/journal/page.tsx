import { Suspense } from "react";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalBrowser from "@/components/journal/JournalBrowser";
import NewsletterSection from "@/components/journal/NewsletterSection";

// Static shell only — no build-time snapshot. JournalBrowser fetches
// everything live from Supabase on mount, so this page never shows stale
// content that then jumps to the real thing. See
// docs/decisions/0004-journal-live-fetch.md.
export default function Journal() {
  return (
    <main className="min-h-screen bg-background-dark pb-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <JournalHeader />

        <Suspense fallback={null}>
          <JournalBrowser />
        </Suspense>

        <NewsletterSection />
      </div>
    </main>
  );
}
