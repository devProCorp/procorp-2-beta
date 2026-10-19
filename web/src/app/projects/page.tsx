import ProjectsView from '@/components/projects/ProjectsView';
import { fetchProjects } from '@/lib/projects-live';

// Las tarjetas se leen de investment_projects en el build (HTML con contenido)
// y ProjectsGrid las vuelve a pedir en el navegador. Si la función no responde
// en el build, la página se genera igual y carga los proyectos en vivo.
export default async function ProjectsPage() {
    const initial = await fetchProjects({ live: false });
    return <ProjectsView initial={initial} />;
}
