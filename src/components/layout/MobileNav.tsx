"use client";

import Link from "next/link";
import { X, Instagram } from "lucide-react";
import { useEffect } from "react";
import Logo from "@/components/ui/Logo";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export default function MobileNav({ open, onClose, links }: MobileNavProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Logo size="sm" asLink={false} />
          <button onClick={onClose} className="p-2" aria-label="סגור תפריט">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-base font-medium py-3 px-3 rounded-lg hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 right-0 left-0 flex justify-center gap-4">
          <a
            href="https://instagram.com/mamy.liel"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-text-secondary hover:text-foreground transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </>
  );
}
