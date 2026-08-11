import ManifestoStory from '@/components/manifesto/ManifestoStory';
import {
  WhyWeExist,
  Triad,
  OurWay,
  Pillars,
  Beliefs,
  FinalCTA,
} from '@/components/manifesto/StorySections';
import MicroSimulator from '@/components/manifesto/MicroSimulator';
import LiaChat from '@/components/home/LiaChat';

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
      <ManifestoStory />
      <WhyWeExist />
      <Triad />
      <OurWay />
      <Pillars />
      <MicroSimulator />
      <Beliefs />
      <FinalCTA />
      <LiaChat />
    </main>
  );
}
