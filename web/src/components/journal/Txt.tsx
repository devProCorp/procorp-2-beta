"use client";

// Piezas traducibles del blog para usar dentro de componentes de servidor
// (ArticleView, ArticleList, RelatedArticles) sin convertirlos a cliente.
import { useLanguage } from "@/context/LanguageContext";
import { catName, DATE_LOCALE } from "@/lib/blog-categories";
import { formatDate } from "@/lib/wordpress-presentation";

export function T({ k }: { k: string }) {
  const { t } = useLanguage();
  return <>{t(k)}</>;
}

export function CategoryName({ slug, name }: { slug: string; name: string }) {
  const { lang } = useLanguage();
  return <>{catName(slug, name, lang)}</>;
}

export function PostDate({ date }: { date: string }) {
  const { lang } = useLanguage();
  return <>{formatDate(date, DATE_LOCALE[lang] ?? "es-ES")}</>;
}

export function AudioBadgeTitle({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  return <span title={t("journal.audio")}>{children}</span>;
}
