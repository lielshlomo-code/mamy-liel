// Cached for five minutes. This page has no per-user state, so rendering it
// fresh on every request bought nothing and burned Vercel Fluid CPU — the
// whole team shares a 4h/month allowance and overrunning it pauses the sites.
// Admin edits show up within the window.
export const revalidate = 300;

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
