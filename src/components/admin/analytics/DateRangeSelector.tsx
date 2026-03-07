"use client";

const ranges = [
  { label: "היום", value: "today" },
  { label: "אתמול", value: "yesterday" },
  { label: "7 ימים", value: "7" },
  { label: "30 ימים", value: "30" },
  { label: "90 ימים", value: "90" },
];

interface DateRangeSelectorProps {
  value: string;
  onChange: (range: string) => void;
}

export default function DateRangeSelector({
  value,
  onChange,
}: DateRangeSelectorProps) {
  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            value === r.value
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
