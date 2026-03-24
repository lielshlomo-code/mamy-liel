"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ExternalLink } from "lucide-react";

const STORAGE_KEY = "mamy-liel-promo-popup-seen";
const DELAY_MS = 3000;

interface PopupLink {
  title: string;
  url: string;
}

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [links, setLinks] = useState<PopupLink[]>([]);

  useEffect(() => {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;

    fetch("/api/popup-links")
      .then((r) => r.json())
      .then((data: PopupLink[]) => {
        if (data.length === 0) return;
        setLinks(data);
        const timer = setTimeout(() => setVisible(true), DELAY_MS);
        return () => clearTimeout(timer);
      })
      .catch(() => {});
  }, []);

  function close() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-l from-rose-100 to-pink-50 px-6 pt-6 pb-4">
                <button
                  onClick={close}
                  className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-white/60 transition-colors"
                  aria-label="סגירה"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">הנחות ומבצעים</h2>
                    <p className="text-sm text-text-secondary">
                      הקישורים הכי שווים שלי
                    </p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="px-4 py-3 max-h-72 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-rose-200 hover:bg-rose-50/50 transition-all group"
                    >
                      <span className="flex-1 text-sm font-medium truncate">
                        {link.title}
                      </span>
                      <ExternalLink className="w-4 h-4 text-text-light group-hover:text-rose-400 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-border">
                <button
                  onClick={close}
                  className="w-full text-center text-sm text-text-secondary hover:text-foreground transition-colors py-1"
                >
                  אולי אחר כך
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
