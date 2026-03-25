// CalendarView.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import { useEffect, useState } from "react";

type Props = {
  events: any[];
  initialDate: Date;
  eventClick?: (eventInfo: any) => void;
};

const TAG_CALENDAR_COLORS: Record<string, string> = {
  Tech: "#dbeafe", // blue-100
  Art: "#fce7f3", // pink-100
  Business: "#fef3c7", // amber-100
  Music: "#ede9fe", // violet-100
  Sport: "#dcfce7", // green-100
  Food: "#ffedd5", // orange-100
  Other: "#f1f5f9", // slate-100
};

const TAG_TEXT_COLORS: Record<string, string> = {
  Tech: "#1d4ed8", // blue-700
  Art: "#be185d", // pink-700
  Business: "#b45309", // amber-700
  Music: "#6d28d9", // violet-700
  Sport: "#15803d", // green-700
  Food: "#c2410c", // orange-700
  Other: "#475569", // slate-600
};

export function CalendarView({ events, initialDate, eventClick }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      initialView={isMobile ? "listMonth" : "dayGridMonth"}
      headerToolbar={
        isMobile
          ? {
              left: "prev,next",
              center: "title",
              right: "today",
            }
          : {
              left: "prev,today,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }
      }
      initialDate={initialDate}
      events={events}
      height="auto"
      locale="en"
      eventClick={eventClick}
      // Show tooltip on event hover using tippy.js
      eventDidMount={(info) => {
        const tags = info.event.extendedProps.tags as
          | { name: string }[]
          | undefined;
        const firstTag = tags?.[0]?.name;

        // Apply soft colors
        const bg = TAG_CALENDAR_COLORS[firstTag || ""] || "#e0e7ff";
        const color = TAG_TEXT_COLORS[firstTag || ""] || "#4338ca";

        info.el.style.backgroundColor = bg;
        info.el.style.color = color;
        info.el.style.setProperty("--fc-event-text-color", color);
        info.el.style.borderRadius = "12px";
        info.el.style.border = "none";
        info.el.style.fontWeight = "700";

        // tooltip
        const title = info.el.querySelector(".fc-event-title");
        const time = info.el.querySelector(".fc-event-time");
        if (title) (title as HTMLElement).style.color = color;
        if (time) (time as HTMLElement).style.color = color;
        const description = info.event.extendedProps.description;
        const tagsText = tags?.length
          ? `<div style="margin-top:4px;font-size:11px;opacity:0.8">🏷 ${tags.map((t) => t.name).join(", ")}</div>`
          : "";
        tippy(info.el, {
          content: `${description || ""}${tagsText}`,
          placement: "top",
          animation: "shift-away",
          theme: "light-border",
          allowHTML: true,
        });
      }}
      eventContent={(eventInfo) => {
        return (
          <div className="flex items-center space-x-1.5 px-2 h-full overflow-hidden">
            <span className="text-[10px] font-medium opacity-85 shrink-0">
              {eventInfo.timeText}
            </span>
            <span className="truncate text-[11px] font-bold uppercase tracking-tight">
              {eventInfo.event.title}
            </span>
          </div>
        );
      }}
      eventClassNames={() => {
        return [
          "cursor-pointer",
          "transition-all",
          "rounded-md",
          "border-none",
          "py-0.5",
          "shadow-sm",
          "hover:brightness-90",
        ];
      }}
    />
  );
}
