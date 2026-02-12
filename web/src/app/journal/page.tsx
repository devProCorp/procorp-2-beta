import { Suspense } from "react";
import { getPosts, getCategories } from "@/lib/wordpress";
import JournalHeader from "@/components/journal/JournalHeader";
import CategoryFilter from "@/components/journal/CategoryFilter";
import ArticleList from "@/components/journal/ArticleList";
import Pagination from "@/components/journal/Pagination";

export const revalidate = 60;

interface JournalPageProps {
  searchParams: Promise<{ cat?: string; page?: string }>;
}

export default async function Journal({ searchParams }: JournalPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const categories = await getCategories();

  const activeCategory = params.cat
    ? categories.find((c) => c.slug === params.cat)
    : undefined;

  const { posts, totalPages } = await getPosts(
    currentPage,
    10,
    activeCategory?.id
  );

  return (
    <main className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <JournalHeader />

        <Suspense fallback={null}>
          <CategoryFilter categories={categories} />
        </Suspense>

        <ArticleList posts={posts} />

        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </div>
    </main>
  );
}
