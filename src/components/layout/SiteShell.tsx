"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import CookieConsent from "@/components/ui/CookieConsent";

export default function SiteShell({
  children,
  featuredProducts,
}: {
  children: React.ReactNode;
  featuredProducts?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  const showProducts =
    !pathname.startsWith("/academy") && !pathname.startsWith("/products");

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      {showProducts && featuredProducts}
      <Footer />
      <WhatsAppFloat />
      <CookieConsent />
    </>
  );
}
