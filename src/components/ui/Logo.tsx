import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  className?: string;
}

export default function Logo({ size = "md", asLink = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { text: "text-lg", dot: "w-1.5 h-1.5", line: "w-4" },
    md: { text: "text-2xl", dot: "w-2 h-2", line: "w-5" },
    lg: { text: "text-3xl", dot: "w-2.5 h-2.5", line: "w-6" },
  };

  const s = sizes[size];

  const content = (
    <span className={`inline-flex items-baseline ${className}`}>
      {/* "mamy" - bold uppercase with wide tracking */}
      <span className={`${s.text} font-black tracking-wide uppercase`}>
        mamy
      </span>
      {/* Decorative dot separator */}
      <span className={`${s.dot} rounded-full bg-foreground mx-1 mb-[0.2em] inline-block`} />
      {/* "liel" - thin italic lowercase */}
      <span className={`${s.text} font-extralight tracking-widest lowercase italic`}>
        liel
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" className="group relative inline-block">
      {content}
      <span className="absolute -bottom-1 right-0 w-0 h-[2px] bg-foreground group-hover:w-full transition-all duration-300" />
    </Link>
  );
}
