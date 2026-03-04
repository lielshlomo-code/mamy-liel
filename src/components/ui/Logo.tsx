import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
  className?: string;
}

export default function Logo({ size = "md", asLink = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg", gap: "gap-2" },
    md: { icon: 30, text: "text-2xl", gap: "gap-2.5" },
    lg: { icon: 38, text: "text-3xl", gap: "gap-3" },
  };

  const s = sizes[size];

  const content = (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      {/* Icon: stylized leaf/heart shape */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer circle */}
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Stylized M with heart curve */}
        <path
          d="M14 32V20L24 28L34 20V32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Small heart dot above */}
        <path
          d="M24 14C24 14 21 11 19 13C17 15 19 17 24 20C29 17 31 15 29 13C27 11 24 14 24 14Z"
          fill="currentColor"
        />
      </svg>
      {/* Text */}
      <span className={`${s.text} font-black tracking-tighter leading-none`}>
        mamy<span className="text-text-secondary font-light">.liel</span>
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
