import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { CalendarView } from "../components/CalendarView";
import { Loader } from "../components/Loader";
import { EmptyState } from "../components/EmptyState";
import { CalendarIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useStore } from "../store/useStore";

export function MyEvents() {
  const setGlobalEvents = useStore((s) => s.setEvents);
  const user = useStore((s) => s.user);
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
        setGlobalEvents(res.data);

        const calendarEvents = res.data.map((e: any) => ({
          id: e.id,
          title: e.title,
          start: e.startsAt,
          extendedProps: {
            description: e.description,
            isCreator: e.organizerId === user?.id,
            isAttending: true,
          },
        }));

        setEvents(calendarEvents);

        if (calendarEvents.length > 0) {
          setInitialDate(new Date(calendarEvents[0].start));
        }
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setLoaded(true);
      }
    })();
  }, [user?.id, setGlobalEvents]);

  if (!loaded) return <Loader />;

  // EMPTY STATE
  if (events.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <EmptyState 
          title="Your calendar is empty"
          message="You haven't joined any events yet. Explore our community and find something exciting!"
          icon={<CalendarIcon className="w-12 h-12 text-indigo-500" />}
          action={
            <Link to="/events" className="btn-primary">
              Explore Events
            </Link>
          }
        />
      </div>
    );
  }

  const handleEventClick = (eventInfo: any) => {
    navigate(`/events/${eventInfo.event.id}`);
  };

  return (
    <div className="p-6 md:p-10 bg-slate-50/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                Personal Schedule
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                {events.length} Upcoming {events.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Events</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium flex items-center">
              Manage your personal time and upcoming activities <SparklesIcon className="w-5 h-5 ml-2 text-amber-400" />
            </p>
          </div>

          <Link
            to="/events"
            className="flex items-center text-indigo-600 font-bold hover:text-indigo-700 transition-colors group"
          >
            Find more events
            <div className="ml-2 p-2 bg-white rounded-xl shadow-sm group-hover:translate-x-1 transition-transform">
               <MagnifyingGlassIcon className="w-4 h-4" />
            </div>
          </Link>
        </div>
        
        {/* Calendar Container */}
        <div className="bg-white p-4 md:p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <CalendarView
            events={events}
            initialDate={initialDate}
            eventClick={handleEventClick}
          />
        </div>

        {/* Pro-tip Footer */}
        <p className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">
          Click on any event to see full details or manage participation
        </p>
      </div>
    </div>
  );
}