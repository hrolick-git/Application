import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description?: string;
  startsAt: string;
  location: string;
  capacity?: number;
  participants: any[];
  joined?: boolean;
  full?: boolean;
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const fetch = async () => {
    const res = await api.get('/events');
    setEvents(res.data);
  };
  useEffect(() => {
    fetch();
  }, []);
  const toggle = async (e: Event) => {
    if (e.joined) {
      await api.post(`/events/${e.id}/leave`);
    } else {
      await api.post(`/events/${e.id}/join`);
    }
    fetch();
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Публічні події</h1>
      <ul className="space-y-4">
        {events.map((e) => (
          <li key={e.id} className="border p-4 rounded">
            <Link to={`/events/${e.id}`}>
              <h2 className="text-xl">{e.title}</h2>
            </Link>
            <p>{e.description}</p>
            <p>{new Date(e.startsAt).toLocaleString()}</p>
            <p>{e.location}</p>
            <p>
              {e.capacity ?? 'без обмеження'} місць, {e.participants.length}{' '}
              учасників
            </p>
            <button
              disabled={e.full && !e.joined}
              onClick={() => toggle(e)}
              className={`mt-2 px-3 py-1 rounded ${
                e.joined ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
            >
              {e.joined ? 'Вийти' : e.full ? 'Повне' : 'Приєднатись'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
