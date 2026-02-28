"use client";

import { Link2, Package, Mail } from "lucide-react";
import type { ActivityItem, ContactSummary } from "@/lib/types";

interface ActivityFeedProps {
  clickEvents: ActivityItem[];
  recentContacts: ContactSummary[];
}

interface FeedItem {
  id: string;
  icon: typeof Link2;
  label: string;
  detail: string;
  time: string;
  sortDate: Date;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "עכשיו";
  if (seconds < 3600) return `לפני ${Math.floor(seconds / 60)} דקות`;
  if (seconds < 86400) return `לפני ${Math.floor(seconds / 3600)} שעות`;
  return `לפני ${Math.floor(seconds / 86400)} ימים`;
}

export default function ActivityFeed({
  clickEvents,
  recentContacts,
}: ActivityFeedProps) {
  const items: FeedItem[] = [
    ...clickEvents.map((e) => ({
      id: e.id,
      icon: e.type === "short_link" ? Link2 : Package,
      label: e.type === "short_link" ? "לחיצה על לינק מקוצר" : "לחיצה על מוצר",
      detail: e.targetId,
      time: timeAgo(e.createdAt),
      sortDate: new Date(e.createdAt),
    })),
    ...recentContacts.map((c) => ({
      id: c.id,
      icon: Mail,
      label: "פנייה חדשה",
      detail: `${c.brandName} — ${c.contactName}`,
      time: timeAgo(c.createdAt),
      sortDate: new Date(c.createdAt),
    })),
  ];

  items.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  const display = items.slice(0, 15);

  if (display.length === 0) {
    return (
      <p className="text-sm text-text-secondary py-6 text-center">
        אין פעילות אחרונה
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {display.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-text-secondary truncate">
                {item.detail}
              </p>
            </div>
            <span className="text-xs text-text-light shrink-0">{item.time}</span>
          </div>
        );
      })}
    </div>
  );
}
