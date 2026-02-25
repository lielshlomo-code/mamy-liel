import Link from "next/link";
import {
  Instagram,
  MessageCircle,
  Heart,
  PenLine,
  Handshake,
  ExternalLink,
} from "lucide-react";
import type { SocialLink } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  messageCircle: MessageCircle,
  heart: Heart,
  penLine: PenLine,
  handshake: Handshake,
};

export default function SocialLinkButton({ link }: { link: SocialLink }) {
  const Icon = iconMap[link.icon] || ExternalLink;

  const className =
    "flex items-center gap-3 w-full px-6 py-4 rounded-xl border border-border bg-white hover:bg-muted transition-all duration-200 hover:scale-[1.02] group";

  const content = (
    <>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-base font-medium flex-1">{link.label}</span>
      <ExternalLink className="w-4 h-4 text-text-light group-hover:text-foreground transition-colors" />
    </>
  );

  if (link.internal) {
    return (
      <Link href={link.url} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  );
}
