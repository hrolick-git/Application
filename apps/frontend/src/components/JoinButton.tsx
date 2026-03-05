import api from '../api/api';
import { useStore } from '../store/useStore';

interface JoinButtonProps {
  event: any;
  onRefresh: () => void;
  className?: string; // для гнучкості розмірів (наприклад, висота на сторінці деталей)
}

export function JoinButton({ event, onRefresh, className = "" }: JoinButtonProps) {
  const user = useStore((s) => s.user);

  // Логіка визначення статусу
  const isPrivate = event.visibility === 'PRIVATE';
  const isJoined = event.joined || event.participants?.some((p: any) => 
    (typeof p === 'string' ? p === user?.id : p.user?.email === user?.email)
  );
  const isFull = event.capacity ? event.participants?.length >= event.capacity : false;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // щоб не спрацював Link, якщо кнопка всередині картки
    
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to join an event');

    try {
      if (isJoined) {
        await api.post(`/events/${event.id}/leave`);
      } else {
        await api.post(`/events/${event.id}/join`);
      }
      onRefresh(); // викликаємо оновлення даних у батьківському компоненті
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <button
      disabled={isFull && !isJoined}
      onClick={handleToggle}
      className={`w-full py-4 rounded-[1.25rem] font-black text-sm transition-all duration-300 transform active:scale-95 shadow-xl ${
        isJoined 
          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 shadow-none' 
          : isFull 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
            : isPrivate 
              ? 'bg-purple-700 text-white hover:bg-purple-800 shadow-purple-200 hover:-translate-y-1' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-1'
      } ${className}`}
    >
      {isJoined ? 'Leave Event' : isFull ? 'Event Full' : isPrivate ? 'Private Join' : 'Join Event'}
    </button>
  );
}