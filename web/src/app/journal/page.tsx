import { Suspense } from "react";
import { getPosts, getCategories } from "@/lib/wordpress";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalBrowser from "@/components/journal/JournalBrowser";
import NewsletterSection from "@/components/journal/NewsletterSection";

// The static export cannot read `?cat=`/`?page=` at build time, so the page
// ships the whole content-free index and JournalBrowser filters and paginates
// it in the browser. Same URLs, same UI as the previous server-side version.
export default async function Journal() {
  const [categories, { posts }] = await Promise.all([
    getCategories(),
    getPosts(1, Number.MAX_SAFE_INTEGER),
  ]);

  return (
    <main className="min-h-screen bg-background-dark pb-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <JournalHeader />

        <Suspense fallback={null}>
          <JournalBrowser posts={posts} categories={categories} />
        </Suspense>

        <NewsletterSection />
      </div>
    </main>
  );
}
