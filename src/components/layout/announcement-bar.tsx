import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { StoreSettings } from "@/types/database";

interface AnnouncementBarProps {
  settings: StoreSettings;
}

export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date()
  );
  const todayHours = settings.opening_hours.find(
    (entry) => entry.day.toLowerCase() === todayName.toLowerCase()
  );

  const statusText = todayHours
    ? todayHours.closed
      ? `Closed today (${todayName})`
      : `Open today ${todayHours.open}–${todayHours.close}`
    : "Freshly steamed daily";

  return (
    <div className="bg-[#173F35] text-[#FCFAF6]">
      <div className="container flex flex-wrap items-center justify-between gap-2 py-2 text-xs">
        <p className="flex items-center gap-2 tracking-wide">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#C96A35]" />
          <span>
            Freshly layered Briyani cooked to order —{" "}
            <Link
              href="/menu"
              className="font-medium underline decoration-[#C96A35] underline-offset-4 hover:text-[#F7F1E5]"
            >
              Order online & confirm via WhatsApp
            </Link>
          </span>
        </p>
        <span className="hidden items-center gap-1.5 text-[#F7F1E5]/85 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C96A35]" />
          {statusText}
        </span>
      </div>
    </div>
  );
}
