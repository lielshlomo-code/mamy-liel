"use client";

interface TopListItem {
  label: string;
  value: number;
  sublabel?: string;
}

interface TopListProps {
  items: TopListItem[];
  valueLabel?: string;
}

export default function TopList({ items, valueLabel = "לחיצות" }: TopListProps) {
  const maxValue = Math.max(...items.map((i) => i.value), 1);

  if (items.length === 0) {
    return (
      <p className="text-sm text-text-secondary py-4 text-center">
        אין נתונים עדיין
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-text-secondary w-5 text-center shrink-0">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium truncate">{item.label}</span>
              <span className="text-xs text-text-secondary shrink-0 ms-2">
                {item.value} {valueLabel}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            {item.sublabel && (
              <span className="text-xs text-text-light mt-0.5 block" dir="ltr">
                {item.sublabel}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
