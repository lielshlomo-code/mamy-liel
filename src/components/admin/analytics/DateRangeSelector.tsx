"use client";

const ranges = [
  { label: "7 ימים", days: 7 },
  { label: "30 ימים", days: 30 },
  { label: "90 ימים", days: 90 },
];

interface DateRangeSelectorProps {
  value: number;
  onChange: (days: number) => void;
}

export default function DateRangeSelector({
  value,
  onChange,
}: DateRangeSelectorProps) {
  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {ranges.map((r) => (
        <button
          key={r.days}
          onClick={() => onChange(r.days)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            value === r.days
              ? "bg-white text-foreground shadow-sm"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
