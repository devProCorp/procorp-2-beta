import ManifestoStory from '@/components/manifesto/ManifestoStory';
import {
  WhyWeExist,
  Pillars,
  FinalCTA,
} from '@/components/manifesto/StorySections';
import LiaChat from '@/components/home/LiaChat';
import RollingToggle from '@/components/home/RollingToggle';

/**
 * Home — Business Engineering.
 * El manifiesto contado como historia: hero cinemático de 5 actos
 * (auto-rueda al cargar; el scroll toma el control) y las secciones
 * que lo sostienen. Trilingüe ES/EN/PT.
 * Home anterior conservado en git (commit e3fc3bf, src/app/page.tsx).
 */
export default function Home() {
  return (
    <main className="bg-background-dark">
      <RollingToggle />
      <ManifestoStory />
      <WhyWeExist />
      <Pillars />
      <FinalCTA />
      <LiaChat />
    </main>
  );
}
