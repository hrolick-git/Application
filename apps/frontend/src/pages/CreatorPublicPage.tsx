import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { EventCard } from '../components/EventCard';
import { useStore } from '../store/useStore';
import api from '../api/api';

type CreatorPagePayload = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  organizerId: string;
  organizer: {
    id: string;
    email: string;
    name?: string | null;
  };
  events: any[];
};

export function CreatorPublicPage() {
  const { slug } = useParams();
  const user = useStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<CreatorPagePayload | null>(null);

  const loadPage = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const res = await api.get(`/users/creator-pages/${slug}`);
      setPageData(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to open creator page');
      setPageData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [slug]);

  if (loading) {
    return <div className="py-8 text-slate-500">Loading...</div>;
  }

  if (!pageData) {
    return <div className="py-8 text-slate-500">Creator page not found.</div>;
  }

  const organizerName = pageData.organizer.name?.trim() || pageData.organizer.email;
  const isOrganizer = user?.id === pageData.organizer.id;

  return (
    <div className="py-4 md:py-8">
      <div className="rounded-3xl border border-slate-100 bg-white p-5 md:p-8 shadow-sm mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] font-black text-indigo-500">Creator Page</p>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">{pageData.title}</h1>
        {pageData.description && (
          <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">{pageData.description}</p>
        )}
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Organizer: <span className="text-slate-800">{organizerName}</span>
        </p>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-black text-slate-900">Organizer events</h2>
        <span className="text-sm text-slate-500">Total: {pageData.events.length}</span>
      </div>

      {pageData.events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-slate-500">
          This organizer does not have active public events yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {pageData.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isOrganizer={isOrganizer}
              onRefresh={loadPage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
