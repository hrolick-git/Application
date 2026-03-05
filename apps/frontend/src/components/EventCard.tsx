import { Link, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, MapPinIcon, CalendarDaysIcon, UsersIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { JoinButton } from './JoinButton'; // Імпортуємо нашу нову кнопку

interface EventCardProps {
  event: any;
  isOrganizer: boolean;
  onRefresh: () => void; // Змінюємо onToggleJoin на onRefresh
}

export function EventCard({ event: e, isOrganizer, onRefresh }: EventCardProps) {
  const navigate = useNavigate();
  const isPrivate = e.visibility === 'PRIVATE';

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
            <button
              onClick={() => navigate(`/events/${e.id}/edit`)}
              className={`p-2.5 rounded-2xl transition-all shrink-0 hover:rotate-12 ${
                isPrivate ? 'text-purple-500 hover:bg-purple-100/50' : 'text-amber-500 hover:bg-amber-50'
              }`}
            >
              <PencilSquareIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {isPrivate && (
          <div className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-200">
            <LockClosedIcon className="w-3 h-3 mr-1.5" />
            <span className="text-[10px] uppercase tracking-widest font-black">Private Access</span>
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

      {/* Використовуємо універсальну кнопку */}
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