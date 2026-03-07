import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-warm-300/40 relative overflow-hidden bg-warm-gradient">
      {/* Decorative background */}
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-rose-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 -left-20 w-[300px] h-[300px] bg-warm-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div>
            <span className="text-2xl font-black tracking-tighter">
              mamy<span className="text-text-secondary">.liel</span>
            </span>
            <p className="text-sm text-text-secondary mt-2 max-w-xs">
              משתפת דברים שטובים לי ולבית שלי
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-10 sm:gap-16">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-4">
                ניווט
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { href: "/products", label: "מוצרים" },
                  { href: "/blog", label: "הדרכות ומתכונים" },
                  { href: "/contact", label: "שיתופי פעולה" },
                  { href: "/links", label: "קישורים" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-4">
                חברתי
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://instagram.com/mamy.liel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-4">
                מדיניות
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { href: "/privacy", label: "מדיניות פרטיות" },
                  { href: "/terms", label: "תנאי שימוש" },
                  { href: "/cookies", label: "מדיניות קוקיז" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-light">
            &copy; {new Date().getFullYear()} mamy.liel | ליאל שלמה
          </p>
          <p className="text-xs text-text-light">
            כל הזכויות שמורות
          </p>
        </div>
      </div>
    </footer>
  );
}
