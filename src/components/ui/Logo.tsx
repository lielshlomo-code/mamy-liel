import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  className?: string;
}

export default function Logo({ size = "md", asLink = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { text: "text-xl" },
    md: { text: "text-2xl" },
    lg: { text: "text-3xl" },
  };

  const s = sizes[size];

  const content = (
    <span className={`${s.text} font-black tracking-widest uppercase ${className}`}>
      liel
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
