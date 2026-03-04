import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const navigate = useNavigate();

  const submit = async () => {
    const data: any = { title, description, startsAt, location, visibility };
    if (endsAt) data.endsAt = endsAt;
    if (capacity) data.capacity = capacity;

    try {
      const res = await api.post('/events', data);
      navigate(`/events/${res.data.id}`);
    } catch (e) {
      alert('Помилка створення');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-2">
      <h2 className="text-xl">Нова подія</h2>
      <input
        className="border p-2 w-full"
        placeholder="Назва"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Опис"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border p-2 w-full"
        value={startsAt}
        onChange={(e) => setStartsAt(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border p-2 w-full"
        value={endsAt}
        onChange={(e) => setEndsAt(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Локація"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Кількість місць"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
      />
      <select
        className="border p-2 w-full"
        value={visibility}
        onChange={(e) =>
          setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE')
        }
      >
        <option value="PUBLIC">Публічна</option>
        <option value="PRIVATE">Приватна</option>
      </select>
      <button className="bg-blue-500 text-white px-4 py-2" onClick={submit}>
        Створити
      </button>
    </div>
  );
}