import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string;
}

export function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'month' | 'week'>('month');

  useEffect(() => {
    (async () => {
      const res = await api.get('/users/me/events');
      setEvents(res.data);
    })();
  }, []);

  if (events.length === 0)
    return (
      <p className="p-4">
        Ви ще не берете участі в жодній події. Перегляньте публічні події та
        приєднайтесь.
      </p>
    );

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => setView('month')}
          className={`mr-2 ${view === 'month' ? 'font-bold' : ''}`}
        >
          Місяць
        </button>
        <button
          onClick={() => setView('week')}
          className={`${view === 'week' ? 'font-bold' : ''}`}
        >
          Тиждень
        </button>
      </div>
      {/* very basic calendar display */}
      <ul>
        {events.map((e) => (
          <li key={e.id}>
            <Link to={`/events/${e.id}`}>
              {e.title} – {new Date(e.startsAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
