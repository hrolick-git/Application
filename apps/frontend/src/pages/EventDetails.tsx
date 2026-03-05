import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useStore } from '../store/useStore';
import { Loader } from '../components/Loader';
import { JoinButton } from '../components/JoinButton';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  UsersIcon, 
  ArrowLeftIcon,
  TrashIcon,
  PencilSquareIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useStore((s) => s.user);

  const fetch = async () => {
    try {
      let res;
      const token = localStorage.getItem('token');
      if (token) {
        res = await api.get(`/events/${id}`);
      } else {
        res = await api.get(`/events/public/${id}`);
      }
      setEvent(res.data);
    } catch (err: any) {
      console.error(err);
      navigate('/events');
    } finally {
      setLoading(false);
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
      alert(err.response?.data?.message || 'Error joining/leaving');
    }
  };

  const del = async () => {
    if (!event) return;
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        navigate('/events');
      } catch (err: any) {
        alert(err.response?.data?.message || 'Error deleting event');
      }
    }
  };

  if (loading) return <Loader />;
  if (!event) return null;

  const isOrganizer = event.organizerId === user?.id;
  const isPrivate = event.visibility === 'PRIVATE';
  const full = event.capacity ? event.participants.length >= event.capacity : false;
  const joined = event.joined || event.participants.some(p => p.user.email === user?.email);

  return (
    <div className="bg-slate-50/30 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Кнопка Back */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm group"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to events
        </button>

        <div className={`rounded-[2.5rem] shadow-xl overflow-hidden border ${
          isPrivate ? 'bg-gradient-to-br from-white to-purple-50/50 border-purple-100' : 'bg-white border-slate-100'
        }`}>
          {/* Header Section */}
          <div className="p-8 md:p-12 border-b border-slate-50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                {isPrivate && (
                  <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-200">
                    <LockClosedIcon className="w-3 h-3 mr-1.5" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Private Event</span>
                  </div>
                )}
                <h1 className={`text-4xl md:text-5xl font-black leading-tight mb-4 ${
                  isPrivate ? 'text-purple-900' : 'text-slate-900'
                }`}>
                  {event.title}
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed italic">
                  "{event.description || 'No description provided.'}"
                </p>
              </div>

              {/* Organizer Actions */}
              {isOrganizer && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/events/${id}/edit`)}
                    className="p-3 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition-colors"
                    title="Edit"
                  >
                    <PencilSquareIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={del}
                    className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8 md:p-12 grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Event Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className={`p-3 rounded-xl mr-4 ${isPrivate ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    <CalendarDaysIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Date & Time</p>
                    <p className="font-bold text-slate-700">
                      {new Date(event.startsAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className={`p-3 rounded-xl mr-4 ${isPrivate ? 'bg-rose-100 text-rose-600' : 'bg-rose-100 text-rose-600'}`}>
                    <MapPinIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Location</p>
                    <p className="font-bold text-slate-700">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <div className={`p-3 rounded-xl mr-4 ${isPrivate ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <UsersIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Capacity</p>
                    <p className="font-bold text-slate-700">
                      {event.participants.length} / {event.capacity ?? '∞'} participants
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants List */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Who's Coming</h3>
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
                {event.participants.length > 0 ? (
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {event.participants.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {p.user.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-600 truncate font-medium">{p.user.email}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No participants yet. Be the first!</p>
                )}
              </div>

              {/* Join Button */}
              <div className="mt-8">
                <JoinButton 
                  event={event} 
                  onRefresh={fetch} 
                  className="py-5 text-lg" // робимо кнопку більшою для сторінки деталей
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}