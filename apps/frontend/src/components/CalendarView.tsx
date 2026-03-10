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
        if (description) {
          tippy(info.el, {
            content: description,
            placement: 'top',
            animation: 'shift-away',
            theme: 'light-border',
            allowHTML: true,
          });
        }
      }}

      // Previous code for customizing event content
      eventContent={(eventInfo) => {
        return (
          <div className="flex items-center space-x-1.5 px-2 h-full overflow-hidden text-white">
            {/* Start time */}
            <span className="text-[10px] font-medium opacity-85 shrink-0">
              {eventInfo.timeText}
            </span>
            {/* Event name */}
            <span className="truncate text-[11px] font-bold uppercase tracking-tight">
              {eventInfo.event.title}
            </span>
          </div>
        );
      }}

      eventClassNames={(arg) => {
        const { isCreator } = arg.event.extendedProps;
        
        const classes = ["cursor-pointer", "transition-all", "rounded-md", "border-none", "py-0.5", "shadow-sm"];
        
        if (isCreator) {
          // Purple for events you created
          classes.push("bg-violet-600 hover:bg-violet-700");
        } else {
          // Green for events you are attending but did not create
          classes.push("bg-emerald-500 hover:bg-emerald-600");
        }
        
        return classes;
      }}
    />
  );
}