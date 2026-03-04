import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Loader } from '../components/Loader';

interface Event {
  id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  capacity?: number;
  participants: any[];
  joined?: boolean;
  full?: boolean;
  visibility?: 'PUBLIC' | 'PRIVATE';
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const token = localStorage.getItem('token');
      let res;
      if (token) {
        // користувач залогінений — свої + публічні
        res = await api.get<Event[]>('/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // користувач не залогінений — тільки публічні
        res = await api.get<Event[]>('/events/public');
      }
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const toggle = async (e: Event) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Ви повинні увійти, щоб приєднатися до події');
    try {
      if (e.joined) {
        await api.post(`/events/${e.id}/leave`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(`/events/${e.id}/join`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  if (events.length === 0)
    return <p className="text-center text-gray-500">Подій поки немає</p>;

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <div
          key={e.id}
          className={`border rounded p-4 hover:shadow transition ${
            e.visibility === 'PRIVATE' ? 'bg-purple-50' : 'bg-green-50'
          }`}
        >
          <Link to={`/events/${e.id}`}>
            <div className="flex items-center gap-2 cursor-pointer">
              <h2 className="text-xl font-semibold">{e.title}</h2>
              {e.visibility === 'PRIVATE' && (
                <span className="text-xs px-2 py-0.5 rounded bg-purple-600 text-white">
                  Тільки для вас
                </span>
              )}
            </div>
          </Link>

          {e.description && <p className="text-sm text-gray-600 mt-1">{e.description}</p>}

          <p className="text-sm text-gray-500 mt-1">
            {new Date(e.startsAt).toLocaleString()}
            {e.endsAt && ` — ${new Date(e.endsAt).toLocaleString()}`}
          </p>

          {e.location && <p className="text-sm text-gray-400 mt-1">{e.location}</p>}

          <p className="text-sm mt-1">
            {e.capacity ?? 'без обмеження'} місць, {e.participants.length} учасників
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
        </div>
      ))}
    </div>
  );
}   