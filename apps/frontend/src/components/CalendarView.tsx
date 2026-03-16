// CalendarView.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

type Props = {
  events: any[];
  initialDate: Date;
  eventClick?: (eventInfo: any) => void;
};

// Tag color map — matches TAG_COLORS in other components
const TAG_CALENDAR_COLORS: Record<string, { bg: string; hover: string }> = {
  Tech:     { bg: 'bg-blue-500',   hover: 'hover:bg-blue-600' },
  Art:      { bg: 'bg-pink-500',   hover: 'hover:bg-pink-600' },
  Business: { bg: 'bg-amber-500',  hover: 'hover:bg-amber-600' },
  Music:    { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
  Sport:    { bg: 'bg-green-500',  hover: 'hover:bg-green-600' },
  Food:     { bg: 'bg-orange-500', hover: 'hover:bg-orange-600' },
  Other:    { bg: 'bg-slate-500',  hover: 'hover:bg-slate-600' },
};

export function CalendarView({ events, initialDate, eventClick }: Props) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      initialDate={initialDate}
      headerToolbar={{
        left: "prev,today,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      events={events}
      height="auto"
      locale="en"
      eventClick={eventClick}

      // Show tooltip on event hover using tippy.js
      eventDidMount={(info) => {
        const description = info.event.extendedProps.description;
        const tags = info.event.extendedProps.tags as { name: string }[] | undefined;
        const tagsText = tags?.length ? `<div style="margin-top:4px;font-size:11px;opacity:0.8">🏷 ${tags.map(t => t.name).join(', ')}</div>` : '';

        tippy(info.el, {
          content: `${description || ''}${tagsText}`,
          placement: 'top',
          animation: 'shift-away',
          theme: 'light-border',
          allowHTML: true,
        });
      }}

      eventContent={(eventInfo) => {
        return (
          <div className="flex items-center space-x-1.5 px-2 h-full overflow-hidden text-white">
            <span className="text-[10px] font-medium opacity-85 shrink-0">
              {eventInfo.timeText}
            </span>
            <span className="truncate text-[11px] font-bold uppercase tracking-tight">
              {eventInfo.event.title}
            </span>
          </div>
        );
      }}

      eventClassNames={(arg) => {
        const { isCreator, tags } = arg.event.extendedProps;
        const classes = ["cursor-pointer", "transition-all", "rounded-md", "border-none", "py-0.5", "shadow-sm"];

        // If event has tags — color by first tag
        const firstTag = tags?.[0]?.name;
        if (firstTag && TAG_CALENDAR_COLORS[firstTag]) {
          const { bg, hover } = TAG_CALENDAR_COLORS[firstTag];
          classes.push(bg, hover);
        } else if (isCreator) {
          // Fallback: purple for events you created
          classes.push("bg-violet-600", "hover:bg-violet-700");
        } else {
          // Fallback: green for events you attend
          classes.push("bg-emerald-500", "hover:bg-emerald-600");
        }

        return classes;
      }}
    />
  );
}