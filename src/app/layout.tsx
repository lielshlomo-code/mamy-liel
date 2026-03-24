import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { AuthProvider } from "@/components/auth/AuthProvider";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: {
    default: "mamy.liel | ליאל שלמה",
    template: "%s | mamy.liel",
  },
  description:
    "ליאל שלמה | אמא של מיה ורנה | קופונים, הנחות והמלצות למוצרי תינוקות, בית ולייפסטייל",
  openGraph: {
    title: "mamy.liel | ליאל שלמה",
    description: "קופונים, הנחות והמלצות למוצרי תינוקות, בית ולייפסטייל",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <SiteShell featuredProducts={<FeaturedProducts />}>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
