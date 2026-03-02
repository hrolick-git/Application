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
  visibility: string;
  participants: { user: { email: string } }[];
  organizerId: string;
  joined?: boolean;
  full?: boolean;
}

export function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const fetch = async () => {
    const res = await api.get(`/events/${id}`);
    setEvent(res.data);
  };
  useEffect(() => {
    fetch();
  }, [id]);
  const toggle = async () => {
    if (!event) return;
    if (event.joined) {
      await api.post(`/events/${id}/leave`);
    } else {
      await api.post(`/events/${id}/join`);
    }
    fetch();
  };
  const del = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цю подію?')) {
      await api.delete(`/events/${id}`);
      navigate('/events');
    }
  };
  if (!event) return <div>Loading...</div>;
  const isOrganizer = event.organizerId === useStore.getState().user?.id;
  return (
    <div className="p-4">
      <h1 className="text-2xl">{event.title}</h1>
      <p>{event.description}</p>
      <p>
        {new Date(event.startsAt).toLocaleString()}{' '}
        {event.endsAt && `– ${new Date(event.endsAt).toLocaleString()}`}
      </p>
      <p>{event.location}</p>
      <p>{event.capacity ?? '∞'}</p>
      <ul className="mt-2">
        {event.participants.map((p, idx) => (
          <li key={idx}>{p.user.email}</li>
        ))}
      </ul>
      <button
        disabled={event.full && !event.joined}
        onClick={toggle}
        className={`mt-2 px-3 py-1 rounded ${
          event.joined ? 'bg-red-500' : 'bg-green-500'
        } text-white`}
      >
        {event.joined ? 'Вийти' : event.full ? 'Повне' : 'Приєднатись'}
      </button>
      {isOrganizer && (
        <div className="mt-4 space-x-2">
          <button
            onClick={() => navigate(`/events/${id}/edit`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Редагувати
          </button>
          <button
            onClick={del}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Видалити
          </button>
        </div>
      )}
    </div>
  );
}
