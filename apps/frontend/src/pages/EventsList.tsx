import { useEffect, useState } from "react";
import api from "../api/api";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router-dom";

type Event = {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  description?: string;
  location?: string;
};

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Event[]>("/events"); // просто всі події
        const allEvents = res.data.sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );
        setEvents(allEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  if (events.length === 0)
    return <p className="text-center text-gray-500">Подій поки немає</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="border rounded p-4 hover:shadow cursor-pointer transition"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-sm text-gray-500">
            {new Date(event.startsAt).toLocaleString()}{" "}
            {event.endsAt && `— ${new Date(event.endsAt).toLocaleString()}`}
          </p>
          {event.location && (
            <p className="text-sm text-gray-400 mt-1">{event.location}</p>
          )}
          {event.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}