import ScrollHero from "@/components/home/ScrollHero";
import Manifesto from "@/components/home/Manifesto";
import FeatureGrid from "@/components/home/FeatureGrid";
import LiaChat from "@/components/home/LiaChat";
import VisualDivider from "@/components/home/VisualDivider";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground footer-overlap-fix">
      <ScrollHero />
      <Manifesto />
      <FeatureGrid />
      <LiaChat />
      <VisualDivider />
    </main>
  );
}
