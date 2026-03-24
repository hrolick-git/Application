import { Link, useNavigate } from 'react-router-dom';
import {
  PencilSquareIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  LockClosedIcon,
  LinkIcon,
  CpuChipIcon,
  PaintBrushIcon,
  BriefcaseIcon,
  MusicalNoteIcon,
  TrophyIcon,
  CakeIcon,
  PuzzlePieceIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { JoinButton } from './JoinButton';
import { toast } from 'react-hot-toast';
import api from '../api/api';
import { EVENT_THEME_META, getEventTheme } from '../constants/eventThemes';
import { getIconPattern, type IconPatternId } from '../constants/iconPatterns';

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
  Game:     'bg-red-100 text-red-700',
  Other:    'bg-slate-100 text-slate-600',
};

const PATTERN_ICON_MAP: Record<IconPatternId, any> = {
  tech: CpuChipIcon,
  art: PaintBrushIcon,
  business: BriefcaseIcon,
  music: MusicalNoteIcon,
  sport: TrophyIcon,
  food: CakeIcon,
  game: PuzzlePieceIcon,
  other: SparklesIcon,
};

export function EventCard({ event: e, isOrganizer, onRefresh }: EventCardProps) {
  const navigate = useNavigate();
  const isPrivate = e.visibility === 'PRIVATE';
  const theme = getEventTheme(e.colorTheme);
  const hasTheme = !!theme;
  const themeMeta = theme ? EVENT_THEME_META[theme] : null;
  const iconPattern = getIconPattern(e.iconPattern);
  const patternIconTone = themeMeta ? themeMeta.infoIcon : 'text-slate-400';
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
    <div className={`group relative overflow-hidden rounded-[2.5rem] p-7 shadow-sm hover:shadow-2xl transition-all duration-500 border flex flex-col h-full min-h-[340px] ${
      hasTheme && themeMeta
        ? themeMeta.cardSurface
        : 'bg-white border-slate-100 hover:shadow-indigo-200/40'
    }`}>
      {iconPattern && (
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent 22%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.2) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 22%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.2) 100%)',
          }}
        >
          <div className="absolute right-0 -top-2 -bottom-8 w-[58%] grid grid-cols-9 gap-x-3 p-3">
            {Array.from({ length: 9 }).map((_, colIdx) => {
              const PatternIcon = PATTERN_ICON_MAP[iconPattern];
              const isShiftedColumn = colIdx % 2 === 1;
              const rightColNumber = 9 - colIdx;
              return (
                <div
                  key={colIdx}
                  className={`flex flex-col gap-y-3 ${isShiftedColumn ? 'translate-y-2' : ''}`}
                >
                  {Array.from({ length: 16 }).map((__, rowIdx) => {
                    const rowNumber = rowIdx + 1;
                    const isPriorityIcon =
                      (rightColNumber === 1 && [2, 4, 6].includes(rowNumber)) ||
                      (rightColNumber === 2 && [1, 3, 5].includes(rowNumber)) ||
                      (rightColNumber === 3 && [2, 4].includes(rowNumber));
                    const isBigSpecialIcon = rightColNumber === 2 && rowNumber === 3;
                    const isFirstColumnSecondIcon = rightColNumber === 1 && rowNumber === 2;
                    const isThirdColumnFourthIcon = rightColNumber === 3 && rowNumber === 4;
                    const iconSize = isBigSpecialIcon
                      ? '1.65rem'
                      : isFirstColumnSecondIcon
                        ? '1.1rem'
                        : isThirdColumnFourthIcon
                          ? '1rem'
                          : '1.25rem';

                    return (
                      <PatternIcon
                        key={`${colIdx}-${rowIdx}`}
                        className={`${patternIconTone}`}
                        style={{
                          opacity: isPriorityIcon ? 1 : 0.35,
                          width: iconSize,
                          height: iconSize,
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1">
        <div className="flex justify-between items-start mb-4">
          <Link to={`/events/${e.id}`} className="hover:text-indigo-600 transition-colors flex-1 mr-2">
            <h2 className={`text-2xl font-bold leading-tight transition-colors ${
              hasTheme && themeMeta ? `${themeMeta.title} group-hover:opacity-85` : 'text-slate-800 group-hover:text-indigo-600'
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
                className="p-2.5 rounded-2xl transition-all hover:rotate-12 text-amber-500 hover:bg-amber-50"
              >
                <PencilSquareIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {isPrivate && (
          <div className={`inline-flex items-center mb-4 px-3 py-1 rounded-full text-white shadow-lg ${themeMeta ? themeMeta.badge : 'bg-slate-700'}`}>
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
            hasTheme && themeMeta ? themeMeta.mutedText : 'text-slate-500'
          }`}>
            "{e.description}"
          </p>
        )}

        <div className="space-y-3 mb-8">
          <InfoRow 
            isThemed={hasTheme}
            privateTheme={themeMeta || undefined}
            icon={<CalendarDaysIcon className={hasTheme && themeMeta ? themeMeta.infoIcon : 'text-indigo-500'} />} 
            text={new Date(e.startsAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} 
          />
          {e.location && (
            <InfoRow 
              isThemed={hasTheme}
              privateTheme={themeMeta || undefined}
              icon={<MapPinIcon className={hasTheme && themeMeta ? themeMeta.infoIcon : 'text-rose-500'} />} 
              text={e.location} 
            />
          )}
          <InfoRow 
            isThemed={hasTheme}
            privateTheme={themeMeta || undefined}
            icon={<UsersIcon className={hasTheme && themeMeta ? themeMeta.infoIcon : 'text-emerald-500'} />} 
            text={`${e.participants.length} / ${e.capacity ?? '∞'} participants`} 
          />
        </div>
      </div>
      <div className="relative z-10">
        <JoinButton event={e} onRefresh={onRefresh} />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  text,
  isThemed,
  privateTheme,
}: {
  icon: any;
  text: string;
  isThemed?: boolean;
  privateTheme?: { infoRow: string };
}) {
  return (
    <div className={`flex items-center text-sm font-medium p-2 rounded-xl ${
      isThemed ? (privateTheme?.infoRow || 'text-purple-700 bg-purple-100/40') : 'text-slate-600 bg-slate-50'
    }`}>
      <div className="w-5 h-5 mr-3 shrink-0">{icon}</div>
      <span className="truncate">{text}</span>
    </div>
  );
}