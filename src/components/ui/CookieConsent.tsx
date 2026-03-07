"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "mamy-liel-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash immediately on page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="rounded-2xl border border-warm-300/40 bg-white/90 backdrop-blur-md shadow-xl shadow-warm-200/25 p-5">
            <div className="flex items-start gap-3">
              <Cookie className="w-5 h-5 text-rose-300 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-text-secondary leading-relaxed">
                  אנו משתמשים בקוקיז כדי לשפר את חוויית הגלישה שלך.
                  בהמשך השימוש באתר את/ה מסכים/ה לשימוש בקוקיז.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={accept}
                    className="px-4 py-1.5 bg-foreground text-white text-sm font-medium rounded-full hover:bg-foreground/90 transition-colors"
                  >
                    אישור
                  </button>
                  <Link
                    href="/cookies"
                    className="text-sm text-text-light hover:text-foreground transition-colors underline"
                  >
                    מידע נוסף
                  </Link>
                </div>
              </div>
              <button
                onClick={accept}
                className="text-text-light hover:text-foreground transition-colors shrink-0"
                aria-label="סגירה"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
