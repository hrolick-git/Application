import { useEffect, useState } from 'react';
import api from '../api/api';
import { Loader } from '../components/Loader';
import { SearchBar } from '../components/SearchBar';
import { useStore } from '../store/useStore';
import { EventCard } from '../components/EventCard';
import { EmptyState } from '../components/EmptyState';
import { motion, Variants } from 'framer-motion';

// 1. Variants for the container that holds all event cards
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between the appearance of each card
    },
  },
};

// 2. Variants для окремої картки
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" as const } 
  },
};

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
  organizerId: string;
}

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useStore((s) => s.user);

  const filteredEvents = events.filter((e) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(searchLower) ||
      e.description?.toLowerCase().includes(searchLower) ||
      e.location?.toLowerCase().includes(searchLower)
    );
  });

  const fetch = async () => {
    try {
      const token = localStorage.getItem('token');
      let res;
      if (token) {
        res = await api.get<Event[]>('/events');
      } else {
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

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-slate-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Animated header */}
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Explore Events</h1>
            <p className="text-slate-500 mt-2 text-lg">Find exciting activities happening around you</p>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </motion.header>

        {filteredEvents.length > 0 ? (
          /* Container for event cards with stagger effect */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start"
          >
            {filteredEvents.map(e => (
              <motion.div key={e.id} variants={cardVariants}>
                <EventCard 
                  event={e} 
                  isOrganizer={user?.id === e.organizerId} 
                  onRefresh={fetch} 
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState 
              title="Nothing Found"
              message={`We couldn't find any events matching "${searchQuery}". Try a different keyword.`}
              action={
                <button onClick={() => setSearchQuery('')} className="btn-secondary">
                  Clear Search
                </button>
              }
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}