import { Link, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, MapPinIcon, CalendarDaysIcon, UsersIcon, LockClosedIcon, LinkIcon } from '@heroicons/react/24/outline';
import { JoinButton } from './JoinButton';
import { toast } from 'react-hot-toast';
import api from '../api/api';

interface Tag {
  id: string;
  name: string;
}

interface EventCardProps {
  event: any;
  isOrganizer: boolean;
  onRefresh: () => void;
}

const TAG_COLORS: Record<string, string> = {
  Tech:     'bg-blue-100 text-blue-700',
  Art:      'bg-pink-100 text-pink-700',
  Business: 'bg-amber-100 text-amber-700',
  Music:    'bg-purple-100 text-purple-700',
  Sport:    'bg-green-100 text-green-700',
  Food:     'bg-orange-100 text-orange-700',
  Other:    'bg-slate-100 text-slate-600',
};

export function EventCard({ event: e, isOrganizer, onRefresh }: EventCardProps) {
  const navigate = useNavigate();
  const isPrivate = e.visibility === 'PRIVATE';
  const tags: Tag[] = e.tags || [];

  const copyShareLink = async () => {
    if (typeof window === 'undefined') return;

    try {
      let token = e.shareToken;
      if (!token) {
        const res = await api.post(`/events/${e.id}/share-link`);
        token = res.data?.shareToken;
      }
      if (!token) throw new Error('No share token returned');

      await navigator.clipboard.writeText(`${window.location.origin}/events/shared/${token}`);
      toast.success('Shared link copied');
    } catch {
      toast.error('Failed to copy shared link');
    }
  };

  return (
    <div className={`group relative rounded-[2.5rem] p-7 shadow-sm hover:shadow-2xl transition-all duration-500 border flex flex-col h-full min-h-[340px] ${
      isPrivate 
        ? 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-purple-100 hover:shadow-purple-200/40' 
        : 'bg-white border-slate-100 hover:shadow-indigo-200/40'
    }`}>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <Link to={`/events/${e.id}`} className="hover:text-indigo-600 transition-colors flex-1 mr-2">
            <h2 className={`text-2xl font-bold leading-tight transition-colors ${
              isPrivate ? 'text-purple-900 group-hover:text-purple-700' : 'text-slate-800 group-hover:text-indigo-600'
            }`}>
              {e.title}
            </h2>
          </Link>
          
          {isOrganizer && (
            <div className="flex items-center gap-2 shrink-0">
              {isPrivate && (
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="p-2.5 rounded-2xl transition-all text-indigo-500 hover:bg-indigo-50"
                  title="Copy shared link"
                >
                  <LinkIcon className="w-6 h-6" />
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate(`/events/${e.id}/edit`)}
                className={`p-2.5 rounded-2xl transition-all hover:rotate-12 ${
                  isPrivate ? 'text-purple-500 hover:bg-purple-100/50' : 'text-amber-500 hover:bg-amber-50'
                }`}
              >
                <PencilSquareIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {isPrivate && (
          <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-200">
            <LockClosedIcon className="w-3 h-3 mr-1.5" />
            <span className="text-[10px] uppercase tracking-widest font-black">Private Access</span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map(tag => (
              <span
                key={tag.id}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${TAG_COLORS[tag.name] || TAG_COLORS['Other']}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {e.description && (
          <p className={`line-clamp-3 mb-6 italic leading-relaxed text-sm ${
            isPrivate ? 'text-purple-600/70' : 'text-slate-500'
          }`}>
            "{e.description}"
          </p>
        )}

        <div className="space-y-3 mb-8">
          <InfoRow 
            isPrivate={isPrivate}
            icon={<CalendarDaysIcon className={isPrivate ? 'text-purple-500' : 'text-indigo-500'} />} 
            text={new Date(e.startsAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} 
          />
          {e.location && (
            <InfoRow 
              isPrivate={isPrivate}
              icon={<MapPinIcon className={isPrivate ? 'text-purple-400' : 'text-rose-500'} />} 
              text={e.location} 
            />
          )}
          <InfoRow 
            isPrivate={isPrivate}
            icon={<UsersIcon className={isPrivate ? 'text-purple-400' : 'text-emerald-500'} />} 
            text={`${e.participants.length} / ${e.capacity ?? '∞'} participants`} 
          />
        </div>
      </div>
      <JoinButton event={e} onRefresh={onRefresh} />
    </div>
  );
}

function InfoRow({ icon, text, isPrivate }: { icon: any; text: string; isPrivate?: boolean }) {
  return (
    <div className={`flex items-center text-sm font-medium p-2 rounded-xl ${
      isPrivate ? 'text-purple-700 bg-purple-100/40' : 'text-slate-600 bg-slate-50'
    }`}>
      <div className="w-5 h-5 mr-3 shrink-0">{icon}</div>
      <span className="truncate">{text}</span>
    </div>
  );
}