"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-text-secondary" />
        <span className="text-3xl font-bold">
          {value.toLocaleString("he-IL")}
        </span>
      </div>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}
