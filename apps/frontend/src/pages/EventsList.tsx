import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { Loader } from "../components/Loader";
import { SearchBar } from "../components/SearchBar";
import { useStore } from "../store/useStore";
import { EventCard } from "../components/EventCard";
import { EmptyState } from "../components/EmptyState";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const TAG_COLORS: Record<string, string> = {
  Tech: "bg-blue-100 text-blue-700 border-blue-200",
  Art: "bg-pink-100 text-pink-700 border-pink-200",
  Business: "bg-amber-100 text-amber-700 border-amber-200",
  Music: "bg-purple-100 text-purple-700 border-purple-200",
  Sport: "bg-green-100 text-green-700 border-green-200",
  Food: "bg-orange-100 text-orange-700 border-orange-200",
  Other: "bg-slate-100 text-slate-600 border-slate-200",
};

interface Tag {
  id: string;
  name: string;
}

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
  visibility?: "PUBLIC" | "PRIVATE";
  organizerId: string;
  tags?: Tag[];
}

const EVENTS_PER_PAGE = 6;

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [archivedView, setArchivedView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const loaderRef = useRef<HTMLDivElement>(null);

  const tags = useStore((s) => s.tags);
  const selectedTags = useStore((s) => s.selectedTags);
  const setSelectedTags = useStore((s) => s.setSelectedTags);
  const fetchTags = useStore((s) => s.fetchTags);
  const user = useStore((s) => s.user);

  const filteredEvents = events.filter((e) => {
    const searchLower = searchQuery.toLowerCase();

    const isArchivedFromApi = (e as any).isArchived ?? (e as any).archived;

    const eventDate = new Date(e.startsAt);
    const now = new Date();
    const calculatedIsArchived = e.endsAt
      ? new Date(e.endsAt) < now
      : eventDate < now;

    const finalIsArchived = isArchivedFromApi ?? calculatedIsArchived;

    const matchesArchive = finalIsArchived === archivedView;

    const matchesSearch =
      e.title.toLowerCase().includes(searchLower) ||
      e.description?.toLowerCase().includes(searchLower) ||
      e.location?.toLowerCase().includes(searchLower);

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tagId) => e.tags?.some((t) => t.id === tagId));

    return matchesArchive && matchesSearch && matchesTags;
  });

  const visibleEvents = filteredEvents.slice(0, visibleCount);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + EVENTS_PER_PAGE);
        }
      },
      { threshold: 0.1 },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  // Reset visible count on filter change
  useEffect(() => {
    setVisibleCount(EVENTS_PER_PAGE);
  }, [searchQuery, selectedTags, archivedView]);

  const fetchEvents = async () => {
    setLoading(true);
    setEvents([]);
    try {
      const token = localStorage.getItem("token");
      const res = token
        ? await api.get<Event[]>("/events", {
            params: { archived: archivedView },
          })
        : await api.get<Event[]>("/events/public", {
            params: { archived: archivedView },
          });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [archivedView]);

  const toggleTag = (tagId: string) => {
    const next = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(next);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Explore Events
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Find exciting activities happening around you
            </p>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </motion.header>

        {/* Active / Archive toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setArchivedView(false)}
            className={`px-4 py-2 rounded-2xl text-sm font-black border transition-all ${
              !archivedView
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setArchivedView(true)}
            className={`px-4 py-2 rounded-2xl text-sm font-black border transition-all ${
              archivedView
                ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            Archive
          </button>
        </div>

        {/* Tag Filter */}
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              const colorClass = TAG_COLORS[tag.name] || TAG_COLORS["Other"];
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    isSelected
                      ? `${colorClass} shadow-sm scale-105`
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {isSelected && <span className="mr-1">✓</span>}
                  {tag.name}
                </button>
              );
            })}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-4 py-1.5 rounded-full text-sm font-semibold border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}

        {visibleEvents.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start"
            >
              {visibleEvents.map((e) => (
                <motion.div key={e.id} variants={cardVariants}>
                  <EventCard
                    event={e}
                    isOrganizer={user?.id === e.organizerId}
                    onRefresh={fetchEvents}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Infinite scroll trigger */}
            {visibleCount < filteredEvents.length && (
              <div ref={loaderRef} className="flex justify-center py-8">
                <Loader />
              </div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState
              title={archivedView ? "No archived events" : "No events found"}
              message={
                selectedTags.length > 0
                  ? "No events match the selected tags."
                  : archivedView
                    ? "No past events yet."
                    : `We couldn't find any events matching "${searchQuery}".`
              }
              action={
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                  }}
                  className="btn-secondary"
                >
                  Clear filters
                </button>
              }
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
