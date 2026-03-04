// MyEvents.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { CalendarView } from "../components/CalendarView";

export function MyEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState<Date>(new Date());
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/me/events", {
          withCredentials: true,
        });

        const backendEvents = res.data.map((e: any) => ({
          id: e.id,
          title: e.title,
          start: e.startsAt,
          end: e.endsAt ?? undefined,
          extendedProps: {
            description: e.description,
            location: e.location,
          },
        }));

        setEvents(backendEvents);

        if (backendEvents.length > 0) {
          setInitialDate(new Date(backendEvents[0].start));
        }

        setLoaded(true);
      } catch (err) {
        console.error(err);
        setLoaded(true);
      }
    })();
  }, []);

  if (!loaded) return <div>Завантаження подій...</div>;

  // обробник кліку по події
  const handleEventClick = (eventInfo: any) => {
    navigate(`/events/${eventInfo.event.id}`);
  };

  return (
    <CalendarView
      events={events}
      initialDate={initialDate}
      eventClick={handleEventClick} // передаємо в CalendarView
    />
  );
}