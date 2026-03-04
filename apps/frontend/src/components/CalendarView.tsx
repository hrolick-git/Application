// CalendarView.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type Props = {
  events: any[];
  initialDate: Date;
  eventClick?: (eventInfo: any) => void; // додали проп для кліку
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
      locale="uk"
      eventClick={eventClick} // передаємо в FullCalendar
      eventClassNames={(arg) => {
        const visibility = arg.event.extendedProps.visibility;
        const classes = ["cursor-pointer"];

        if (visibility === "PRIVATE") return ["event-private", ...classes];
        return ["event-public", ...classes];
      }}
    />
  );
}