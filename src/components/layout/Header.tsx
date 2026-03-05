"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";

const navLinks = [
  { href: "/", label: "בית" },
  { href: "/academy", label: "המכללה" },
  { href: "/products", label: "מוצרים" },
  { href: "/blog", label: "הדרכות ומתכונים" },
  { href: "/contact", label: "שיתופי פעולה" },
  { href: "/links", label: "קישורים" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-black/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <Link href="/" className="group relative">
            <span className="text-2xl font-black tracking-tighter">
              mamy<span className="text-text-secondary">.liel</span>
            </span>
            <span className="absolute -bottom-1 right-0 w-0 h-[2px] bg-foreground group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
            <UserMenu />
          </nav>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            aria-label="פתח תפריט"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.header>

      {/* Full-screen mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="text-2xl font-black tracking-tighter">
                mamy<span className="text-text-secondary">.liel</span>
              </span>
              <motion.button
                onClick={() => setMobileOpen(false)}
                whileTap={{ scale: 0.9, rotate: 90 }}
                className="w-10 h-10 flex items-center justify-center"
                aria-label="סגור תפריט"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-10 gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-4xl font-black py-3 hover:text-text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-10 pb-10 text-sm text-text-light"
            >
              @mamy.liel
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
