'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { fetchProjects, localized, type ProjectsData } from '@/lib/projects-live';

// Color de acento por categoría (slug de home_categories); el resto, rojo de marca.
const ACCENT: Record<string, string> = {
  'real-state': '#CE1026',
  'distress-assets': '#F59E0B',
  energy: '#10B981',
  edutainment: '#F97316',
  fintech: '#3B82F6',
  agroindustrial: '#65A30D',
  legal: '#A855F7',
  'other-sectors': '#8B5CF6',
  predios: '#84CC16',
  bvk: '#0EA5E9',
};
const accentOf = (slug: string | null) => (slug && ACCENT[slug]) || '#CE1026';

export default function ProjectsGrid({ initial }: { initial: ProjectsData | null }) {
  const { t, lang } = useLanguage();
  const [data, setData] = useState<ProjectsData | null>(initial);
  const [cat, setCat] = useState<number | null>(null);

  // Lo del build puede tener días: se refresca al abrir la página.
  useEffect(() => {
    let vivo = true;
    fetchProjects().then((d) => vivo && d && setData(d));
    return () => {
      vivo = false;
    };
  }, []);

  const categorias = useMemo(() => {
    if (!data) return [];
    const usadas = new Set(data.projects.map((p) => p.category_id));
    return data.categories.filter((c) => usadas.has(c.id));
  }, [data]);

  const visibles = useMemo(() => {
    if (!data) return [];
    const orden = new Map(data.categories.map((c, i) => [c.id, i]));
    return data.projects
      .filter((p) => cat == null || p.category_id === cat)
      // Agrupados por el orden de las categorías; dentro, el de la tabla.
      .map((p, i) => ({ p, i }))
      .sort((a, b) => (orden.get(a.p.category_id) ?? 99) - (orden.get(b.p.category_id) ?? 99) || a.i - b.i)
      .map(({ p }) => p);
  }, [data, cat]);

  if (!data) {
    return <p className="py-16 text-center text-gray-400">{t('studio.inv.projects.error')}</p>;
  }

  const catById = new Map(data.categories.map((c) => [c.id, c]));
  const chip = (activo: boolean) =>
    `flex h-10 shrink-0 items-center rounded-xl px-5 text-[11px] font-bold uppercase tracking-widest transition-all ${
      activo
        ? 'bg-primary text-white border border-primary-light/50 shadow-[0_0_15px_rgba(206,16,38,0.4)]'
        : 'glass-panel text-gray-400 hover:text-white border border-surface-border hover:border-primary/50'
    }`;

  return (
    <>
      {/* Filtro por categoría */}
      <div className="mb-10 flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        <button onClick={() => setCat(null)} className={chip(cat == null)}>
          {t('journal.filter.all')}
        </button>
        {categorias.map((c) => (
          <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className={chip(cat === c.id)}>
            {localized(c, lang).name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((p) => {
          const c = catById.get(p.category_id);
          const color = accentOf(c?.slug ?? null);
          const { name, description } = localized(p, lang);
          const tarjeta = (
            <>
              <div className="@container relative aspect-[16/10] overflow-hidden border-b border-surface-border/50">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- export estático: imágenes de varios hosts sin optimizar
                  <img
                    src={p.image_url}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // Sin foto: degradado del color de la categoría con el nombre.
                  <div
                    className="flex h-full w-full items-end p-6"
                    style={{ background: `linear-gradient(135deg, ${color}33 0%, #0f1520 70%)` }}
                  >
                    <span className="text-2xl font-extrabold uppercase tracking-tight text-white/90">{name}</span>
                  </div>
                )}
                {/* Logo sobre fondo opaco: varias fotos traen el antiguo en esa esquina. */}
                <div className="absolute right-0 top-0 rounded-bl-[3cqw] bg-background-dark px-[3cqw] py-[2.2cqw]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
                  <img src="/brand/Logo_PCP_Business_Engineering.png" alt="" className="w-[30cqw]" />
                </div>
                {c && (
                  <span className="absolute left-4 top-4 max-w-[calc(64cqw-1.5rem)] truncate rounded-full border border-white/10 bg-background-dark/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: color }} />
                    {localized(c, lang).name}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h4 className="mb-2 text-lg font-bold uppercase tracking-wide text-white">{name}</h4>
                {description && description !== name && (
                  <p className="line-clamp-3 flex-1 text-[14px] font-light leading-relaxed text-gray-400">{description}</p>
                )}
                {p.url && (
                  <span className="mt-6 inline-flex items-center text-[11px] font-bold uppercase tracking-widest text-primary-light">
                    {t('studio.inv.projects.more')}
                    <span className="material-symbols-outlined ml-1 text-[16px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                )}
              </div>
            </>
          );
          const clase =
            'group glass-panel glass-panel-hover flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-surface-border/50';
          return p.url ? (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className={clase}>
              {tarjeta}
            </a>
          ) : (
            <div key={p.id} className={clase}>
              {tarjeta}
            </div>
          );
        })}
      </div>
    </>
  );
}
