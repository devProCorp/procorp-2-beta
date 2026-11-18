import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { WPPost } from "@/lib/wordpress-presentation";
import {
  getFeaturedImageUrl,
  getFeaturedImageAlt,
  getPostAuthor,
  getPostCategories,
  stripHtml,
} from "@/lib/wordpress-presentation";
import { T, CategoryName, PostDate, ReadTime } from "./Txt";

/*
 * Piezas del listado del blog (propuesta B, 2026-11-18): un artículo
 * destacado en horizontal, tarjetas y filas compactas. Superficie plana con
 * borde de 1 px, sin sombras ni brillos; el rojo solo en la categoría.
 */

const href = (post: WPPost) => `/blog/${post.slug.trim() || post.id}/`;
const title = (post: WPPost) => post.title.rendered;

function Category({ post, className = "" }: { post: WPPost; className?: string }) {
  const cat = getPostCategories(post)[0];
  if (!cat) return null;
  return (
    <p className={`m-0 text-[13px] font-semibold text-blog-accent ${className}`}>
      <CategoryName slug={cat.slug} name={cat.name} />
    </p>
  );
}

function Meta({ post, author = false }: { post: WPPost; author?: boolean }) {
  const who = author ? getPostAuthor(post)?.name : null;
  return (
    <p className="m-0 flex flex-wrap gap-x-1.5 text-[13px] text-blog-meta">
      {who && (
        <>
          <span>{who}</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <PostDate date={post.date} />
      {post.reading_minutes && (
        <>
          <span aria-hidden="true">·</span>
          <ReadTime minutes={post.reading_minutes} short />
        </>
      )}
      {post.audio_url && (
        <>
          <span aria-hidden="true">·</span>
          <T k="journal.withAudio" />
        </>
      )}
    </p>
  );
}

function Cover({ post, sizes, className }: { post: WPPost; sizes: string; className: string }) {
  const url = getFeaturedImageUrl(post, "medium_large");
  return (
    <div className={`relative overflow-hidden bg-blog-panel ${className}`}>
      {url && (
        <Image
          src={url}
          alt={getFeaturedImageAlt(post) || stripHtml(title(post))}
          fill
          className="object-cover"
          sizes={sizes}
        />
      )}
    </div>
  );
}

/** Artículo destacado: imagen a la izquierda y entradilla a la derecha. */
export function PostFeatured({ post }: { post: WPPost }) {
  return (
    <article className="grid overflow-hidden rounded-xl border border-blog-border bg-blog-surface md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <Cover
        post={post}
        sizes="(max-width: 768px) 100vw, 60vw"
        className="aspect-[16/10] md:aspect-auto md:min-h-[380px]"
      />
      <div className="flex min-w-0 flex-col justify-center gap-4 p-6 md:p-10">
        <Category post={post} className="text-sm" />
        <h2 className="m-0 font-blog-title text-[1.75rem] font-bold leading-[1.18] tracking-[-0.015em] text-blog-text text-balance md:text-[2.125rem]">
          <Link
            href={href(post)}
            className="hover:underline decoration-2 underline-offset-4"
            dangerouslySetInnerHTML={{ __html: title(post) }}
          />
        </h2>
        {post.lead && (
          <p className="m-0 text-[17px] leading-relaxed text-blog-soft text-pretty line-clamp-4">{post.lead}</p>
        )}
        <Meta post={post} author />
        <Link
          href={href(post)}
          tabIndex={-1}
          aria-hidden="true"
          className="inline-flex h-11 items-center gap-2 self-start rounded-lg border border-blog-control px-[18px] text-[15px] font-medium text-blog-text transition-colors hover:border-blog-text"
        >
          <T k="journal.readArticle" />
          <ArrowRight size={16} aria-hidden="true" className="text-blog-accent" />
        </Link>
      </div>
    </article>
  );
}

/** Tarjeta: imagen 16:10, categoría, título y datos. */
export function PostCard({ post, headingLevel = "h3" }: { post: WPPost; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-blog-border bg-blog-surface transition-colors hover:border-blog-control focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-primary-light">
      <Cover post={post} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col gap-2.5 p-[22px]">
        <Category post={post} />
        <Heading className="m-0 font-blog-title text-xl font-bold leading-[1.3] text-blog-text text-balance">
          {/* El enlace cubre toda la tarjeta con ::after: un solo destino al tabular. */}
          <Link
            href={href(post)}
            className="outline-none after:absolute after:inset-0 group-hover:underline decoration-2 underline-offset-4"
            dangerouslySetInnerHTML={{ __html: title(post) }}
          />
        </Heading>
        <div className="mt-auto pt-1">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}

/** Fila compacta: miniatura cuadrada y título. */
export function PostRow({ post }: { post: WPPost }) {
  return (
    <li className="group relative grid grid-cols-[88px_minmax(0,1fr)] items-start gap-4 border-b border-blog-border py-[22px] sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-[18px]">
      <Cover post={post} sizes="120px" className="aspect-square rounded-lg" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <Category post={post} />
        <h3 className="m-0 text-[17px] font-semibold leading-[1.35] text-blog-text">
          <Link
            href={href(post)}
            className="outline-none after:absolute after:inset-0 group-hover:underline underline-offset-4 focus-visible:underline"
            dangerouslySetInnerHTML={{ __html: title(post) }}
          />
        </h3>
        <Meta post={post} />
      </div>
    </li>
  );
}

/** Rejilla de tarjetas (filtros, páginas siguientes y «Sigue leyendo»). */
export default function ArticleList({
  posts,
  headingLevel = "h3",
}: {
  posts: WPPost[];
  headingLevel?: "h2" | "h3";
}) {
  if (posts.length === 0) {
    return (
      <p className="py-20 text-center text-lg text-blog-soft">
        <T k="journal.empty" />
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} headingLevel={headingLevel} />
      ))}
    </div>
  );
}

/**
 * Portada (primera página sin filtro): destacado, «Lo más reciente» con
 * tres tarjetas y «Más artículos» en filas a dos columnas.
 */
export function BlogFront({ posts }: { posts: WPPost[] }) {
  const [first, ...rest] = posts;
  const recent = rest.slice(0, 3);
  const more = rest.slice(3);
  if (!first) return <ArticleList posts={[]} />;
  return (
    <div className="flex flex-col gap-14">
      <PostFeatured post={first} />
      {recent.length > 0 && (
        <section aria-labelledby="blog-recientes">
          <h2 id="blog-recientes" className="m-0 mb-5 font-blog-title text-[22px] font-bold text-blog-text">
            <T k="journal.latest" />
          </h2>
          <ArticleList posts={recent} />
        </section>
      )}
      {more.length > 0 && (
        <section aria-labelledby="blog-mas">
          <h2 id="blog-mas" className="m-0 mb-1 font-blog-title text-[22px] font-bold text-blog-text">
            <T k="journal.more" />
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-x-10 p-0 md:grid-cols-2">
            {more.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

