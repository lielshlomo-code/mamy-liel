import HeroSection from "@/components/home/HeroSection";
import QuickLinks from "@/components/home/QuickLinks";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Marquee from "@/components/home/Marquee";
import InstagramCTA from "@/components/home/InstagramCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Marquee />
      <QuickLinks />
      <FeaturedProducts />
      <InstagramCTA />
    </>
  );
}
