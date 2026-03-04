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
      {/* Icon: botanical leaf with heart */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Main leaf shape */}
        <path
          d="M20 4C20 4 8 12 8 24C8 30 13 36 20 36C27 36 32 30 32 24C32 12 20 4 20 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Center vein */}
        <path
          d="M20 10V32"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Side veins */}
        <path
          d="M20 16L13 21M20 21L12 27M20 16L27 21M20 21L28 27"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Small heart at top of leaf */}
        <path
          d="M20 11C20 11 18 9.5 17 10.5C16 11.5 17.5 12.5 20 14.5C22.5 12.5 24 11.5 23 10.5C22 9.5 20 11 20 11Z"
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
