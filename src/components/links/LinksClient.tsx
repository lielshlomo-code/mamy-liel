"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Instagram,
  MessageCircle,
  Heart,
  PenLine,
  Handshake,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import type { SocialLink, SiteConfig } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  messageCircle: MessageCircle,
  heart: Heart,
  penLine: PenLine,
  handshake: Handshake,
};

function LinkButton({ link, index }: { link: SocialLink; index: number }) {
  const Icon = iconMap[link.icon] || ExternalLink;

  const className =
    "group flex items-center gap-4 w-full px-6 py-5 rounded-2xl border-2 border-black/5 bg-white hover:border-foreground hover:bg-foreground hover:text-white transition-all duration-300";

  const content = (
    <>
      <div className="w-10 h-10 rounded-full bg-muted group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-base font-semibold flex-1">{link.label}</span>
      <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
    </>
  );

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  };

  if (link.internal) {
    return (
      <motion.div {...motionProps}>
        <Link href={link.url} className={className}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps}>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    </motion.div>
  );
}

export default function LinksClient({
  links,
  config,
}: {
  links: SocialLink[];
  config: SiteConfig;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-20 pt-28 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center gap-8 relative z-10">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="w-28 h-28 rounded-full bg-foreground text-white flex items-center justify-center text-4xl font-black">
            {config.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              {config.fullName}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {config.tagline}
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-12 h-[2px] bg-foreground origin-center"
        />

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link, i) => (
            <LinkButton key={link.id} link={link} index={i} />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-text-light mt-4 tracking-widest uppercase"
        >
          {config.siteName}
        </motion.p>
      </div>
    </div>
  );
}
