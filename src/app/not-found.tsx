import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-black/[0.05] select-none">
        404
      </span>
      <h1 className="text-2xl md:text-3xl font-bold -mt-8 mb-3">
        העמוד לא נמצא
      </h1>
      <p className="text-text-secondary mb-10 max-w-sm">
        נראה שהגעת לעמוד שלא קיים. אולי הקישור השתנה?
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-2 px-8 py-4 bg-foreground text-white font-medium rounded-full hover:scale-105 transition-transform"
      >
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        חזרה לדף הבית
      </Link>
    </div>
  );
}
