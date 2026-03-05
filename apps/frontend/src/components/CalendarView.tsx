// CalendarView.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { UserIcon, CheckIcon } from "@heroicons/react/24/solid";
import tippy from 'tippy.js'; // Імпортуємо саму бібліотеку
import 'tippy.js/dist/tippy.css'; // Імпортуємо стандартні стилі
import 'tippy.js/animations/shift-away.css'; // Додамо приємну анімацію

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
      
      // Налаштування Тултіпа
      eventDidMount={(info) => {
        const description = info.event.extendedProps.description;
        if (description) {
          tippy(info.el, {
            content: description,
            placement: 'top',
            animation: 'shift-away',
            theme: 'light-border', // Можна налаштувати свій стиль у CSS
            allowHTML: true,
          });
        }
      }}

      // Твій попередній код кастомізації контенту
      eventContent={(eventInfo) => {
        return (
          <div className="flex items-center space-x-1.5 px-2 h-full overflow-hidden text-white">
            {/* Час початку */}
            <span className="text-[10px] font-medium opacity-85 shrink-0">
              {eventInfo.timeText}
            </span>
            {/* Назва івенту */}
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
          // Фіолетовий для твоїх івентів (насичений, але чистий)
          classes.push("bg-violet-600 hover:bg-violet-700");
        } else {
          // Зелений для тих, куди ти йдеш
          classes.push("bg-emerald-500 hover:bg-emerald-600");
        }
        
        return classes;
      }}
    />
  );
}