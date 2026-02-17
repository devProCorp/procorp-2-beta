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
    9,
    activeCategory?.id
  );

  return (
    <main className="min-h-screen bg-background-dark pb-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <JournalHeader />

        <Suspense fallback={null}>
          <CategoryFilter categories={categories} />
        </Suspense>

        <ArticleList posts={posts} />

        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>

        {/* Newsletter Section */}
        <section className="rounded-2xl bg-surface-dark border border-surface-border p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Suscríbete a nuestra visión estratégica</h2>
              <p className="text-secondary font-light">Recibe análisis profundo sobre ingeniería de procesos y tendencias legales.</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input
                className="h-12 px-4 rounded-lg bg-background-dark border border-surface-border text-white placeholder:text-secondary focus:border-primary focus:ring-1 focus:ring-primary outline-none min-w-[300px]"
                placeholder="Tu correo corporativo"
                type="email"
              />
              <button className="h-12 px-6 rounded-lg bg-primary hover:bg-primary-light text-white font-bold transition-all shadow-lg shadow-primary/20 whitespace-nowrap uppercase tracking-wide text-sm">
                Suscribirse
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
