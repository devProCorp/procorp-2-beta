// Proyectos de inversión de /projects/: misma fuente que inversion.pro-corp.net
// (investment_projects + home_categories, solo visibles), servida por la Edge
// Function get-investment-projects con una lista cerrada de campos públicos.
// La página la llama en el build (HTML con tarjetas) y otra vez en el
// navegador, para que un proyecto nuevo salga sin redeploy.

const PROJECTS_URL =
  "https://cpojgmwfpbuvtutnbtam.supabase.co/functions/v1/get-investment-projects";

type Traducciones = Record<string, { name?: string; description?: string }>;

export interface ProjectCategory {
  id: number;
  name: string;
  description: string | null;
  slug: string | null;
  url: string | null;
  i18n: Traducciones;
}

export interface InvestmentProject {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  url: string | null;
  i18n: Traducciones;
}

export interface ProjectsData {
  categories: ProjectCategory[];
  projects: InvestmentProject[];
}

// En el build NO se puede usar `cache: "no-store"`: en un prerender estático
// Next lo trata como uso dinámico y lanza (y el catch dejaría la página vacía).
export async function fetchProjects(
  { live }: { live: boolean } = { live: true },
): Promise<ProjectsData | null> {
  try {
    const res = await fetch(PROJECTS_URL, live ? { cache: "no-store" } : { cache: "force-cache" });
    if (!res.ok) return null;
    const data = (await res.json()) as ProjectsData;
    return Array.isArray(data?.projects) ? data : null;
  } catch {
    return null;
  }
}

// El español va en las columnas; en/pt solo si están traducidos.
export const localized = (
  row: { name: string; description: string | null; i18n: Traducciones },
  lang: string,
) => ({
  name: row.i18n?.[lang]?.name ?? row.name,
  description: row.i18n?.[lang]?.description ?? row.description,
});
