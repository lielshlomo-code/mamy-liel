// Cached for a day. This page has no per-user state, and the five-minute window
// it used to sit on regenerated six pages 288 times a day — most of the team's
// 4h/month Vercel Fluid CPU allowance, and running out pauses every site.
// Admin edits don't wait for the window; they call revalidateSite() themselves.
export const revalidate = 86400;

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
