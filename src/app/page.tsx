export const dynamic = "force-dynamic";

import HeroSection from "@/components/home/HeroSection";
import QuickLinks from "@/components/home/QuickLinks";
import Marquee from "@/components/home/Marquee";
import InstagramCTA from "@/components/home/InstagramCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Marquee />
      <QuickLinks />
      <InstagramCTA />
    </>
  );
}
