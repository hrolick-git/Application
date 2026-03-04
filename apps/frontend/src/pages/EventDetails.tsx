import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useStore } from '../store/useStore';

interface Event {
  id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  capacity?: number;
  visibility: 'PUBLIC' | 'PRIVATE';
  participants: { user: { email: string } }[];
  organizerId: string;
  joined?: boolean;
  full?: boolean;
}

export function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const user = useStore((s) => s.user);

  // Fetch event
  const fetch = async () => {
    try {
      let res;
      const token = localStorage.getItem('token');
      if (token) {
        // користувач залогінений — запит на приватні і публічні події
        res = await api.get(`/events/${id}`);
      } else {
        // користувач не залогінений — тільки публічні
        res = await api.get(`/events/public/${id}`);
      }
      setEvent(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Помилка завантаження події');
      navigate('/events');
    }
  };

  useEffect(() => {
    fetch();
  }, [id]);

  const toggle = async () => {
    if (!event) return;
    try {
      if (event.joined) {
        await api.post(`/events/${id}/leave`);
      } else {
        await api.post(`/events/${id}/join`);
      }
      fetch();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Помилка приєднання/виходу');
    }
  };

  const del = async () => {
    if (!event) return;
    if (window.confirm('Ви впевнені, що хочете видалити цю подію?')) {
      try {
        await api.delete(`/events/${id}`);
        navigate('/events');
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || 'Помилка видалення події');
      }
    }
  };

  if (!event) return <div>Loading...</div>;

  const isOrganizer = event.organizerId === user?.id;
  const joined = event.joined;
  const full = event.capacity ? event.participants.length >= event.capacity : false;

  return (
    <div className="p-4 max-w-xl mx-auto border rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      {event.visibility === 'PRIVATE' && (
        <span className="px-2 py-0.5 text-xs rounded bg-purple-600 text-white">
          Тільки для вас
        </span>
      )}
      <p className="mb-2 text-gray-700">{event.description}</p>
      <p className="text-sm text-gray-500 mb-1">
        {new Date(event.startsAt).toLocaleString()}
        {event.endsAt && ` – ${new Date(event.endsAt).toLocaleString()}`}
      </p>
      <p className="text-sm text-gray-500 mb-1">Location: {event.location}</p>
      <p className="text-sm text-gray-500 mb-2">
        Capacity: {event.participants.length}/{event.capacity ?? '∞'}
      </p>

      <h3 className="font-semibold mt-4 mb-1">Participants:</h3>
      <ul className="list-disc list-inside mb-4">
        {event.participants.map((p, idx) => (
          <li key={idx}>{p.user.email}</li>
        ))}
      </ul>

      {/* Join / Leave / Full */}
      {event.visibility === 'PUBLIC' || user ? (
        <button
          disabled={full && !joined}
          onClick={toggle}
          className={`px-4 py-2 rounded text-white font-medium ${
            joined ? 'bg-red-500 hover:bg-red-600' : full ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {joined ? 'Вийти' : full ? 'Повне' : 'Приєднатись'}
        </button>
      ) : null}

      {/* Edit / Delete для організатора */}
      {isOrganizer && (
        <div className="mt-4 space-x-2">
          <button
            onClick={() => navigate(`/events/${id}/edit`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Редагувати
          </button>
          <button
            onClick={del}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Видалити
          </button>
        </div>
      )}
    </div>
  );
}