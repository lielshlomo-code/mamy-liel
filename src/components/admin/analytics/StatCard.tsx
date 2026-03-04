"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-3 sm:p-5">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
        <span className="text-xl sm:text-3xl font-bold">
          {value.toLocaleString("he-IL")}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-text-secondary">{label}</p>
    </div>
  );
}
