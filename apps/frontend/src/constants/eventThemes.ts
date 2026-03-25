export const EVENT_THEME_IDS = [
  'violet',
  'mint',
  'sky',
  'sunset',
  'blossom',
  'crimson',
  'ember',
  'forest',
  'golden',
  'cosmic',
] as const;

export type EventThemeId = (typeof EVENT_THEME_IDS)[number];

export type EventThemeMeta = {
  label: string;
  cardSurface: string;
  detailsSurface: string;
  badge: string;
  preview: string;
  title: string;
  mutedText: string;
  icon: string;
  infoRow: string;
  infoIcon: string;
};

export const EVENT_THEME_META: Record<EventThemeId, EventThemeMeta> = {
  violet: {
    label: 'Violet Dream',
    cardSurface:
      'bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border-purple-100 hover:shadow-purple-200/40',
    detailsSurface: 'bg-gradient-to-br from-white to-purple-50/50 border-purple-100',
    badge: 'bg-purple-600',
    preview: 'from-indigo-300 to-purple-300',
    title: 'text-purple-900',
    mutedText: 'text-purple-700/70',
    icon: 'bg-purple-100 text-purple-600',
    infoRow: 'text-purple-700 bg-purple-100/40',
    infoIcon: 'text-purple-500',
  },
  mint: {
    label: 'Mint Breeze',
    cardSurface:
      'bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border-emerald-100 hover:shadow-emerald-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-emerald-50/60 border-emerald-100',
    badge: 'bg-emerald-600',
    preview: 'from-emerald-300 to-teal-300',
    title: 'text-emerald-900',
    mutedText: 'text-emerald-700/70',
    icon: 'bg-emerald-100 text-emerald-600',
    infoRow: 'text-emerald-800 bg-emerald-100/40',
    infoIcon: 'text-emerald-600',
  },
  sky: {
    label: 'Sky Chill',
    cardSurface:
      'bg-gradient-to-br from-cyan-50/70 to-sky-50/70 border-sky-100 hover:shadow-sky-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-sky-50/60 border-sky-100',
    badge: 'bg-sky-600',
    preview: 'from-cyan-300 to-sky-300',
    title: 'text-sky-900',
    mutedText: 'text-sky-700/70',
    icon: 'bg-sky-100 text-sky-600',
    infoRow: 'text-sky-800 bg-sky-100/40',
    infoIcon: 'text-sky-600',
  },
  sunset: {
    label: 'Sunset Pop',
    cardSurface:
      'bg-gradient-to-br from-amber-50/70 to-orange-50/70 border-orange-100 hover:shadow-orange-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-orange-50/60 border-orange-100',
    badge: 'bg-orange-500',
    preview: 'from-amber-300 to-orange-300',
    title: 'text-orange-900',
    mutedText: 'text-orange-700/70',
    icon: 'bg-orange-100 text-orange-600',
    infoRow: 'text-orange-800 bg-orange-100/40',
    infoIcon: 'text-orange-600',
  },
  blossom: {
    label: 'Blossom Candy',
    cardSurface:
      'bg-gradient-to-br from-rose-50/70 to-fuchsia-50/70 border-pink-100 hover:shadow-pink-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-pink-50/60 border-pink-100',
    badge: 'bg-pink-500',
    preview: 'from-rose-300 to-fuchsia-300',
    title: 'text-pink-900',
    mutedText: 'text-pink-700/70',
    icon: 'bg-pink-100 text-pink-600',
    infoRow: 'text-pink-800 bg-pink-100/40',
    infoIcon: 'text-pink-500',
  },
  crimson: {
    label: 'Crimson Rush',
    cardSurface:
      'bg-gradient-to-br from-red-50/70 to-rose-50/70 border-red-100 hover:shadow-red-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-rose-50/60 border-red-100',
    badge: 'bg-red-600',
    preview: 'from-red-400 to-rose-400',
    title: 'text-red-900',
    mutedText: 'text-red-700/70',
    icon: 'bg-red-100 text-red-600',
    infoRow: 'text-red-800 bg-red-100/40',
    infoIcon: 'text-red-500',
  },
  ember: {
    label: 'Ember Glow',
    cardSurface:
      'bg-gradient-to-br from-orange-50/70 to-red-50/60 border-orange-100 hover:shadow-orange-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-orange-50/60 border-orange-100',
    badge: 'bg-orange-600',
    preview: 'from-orange-400 to-red-400',
    title: 'text-orange-900',
    mutedText: 'text-orange-700/70',
    icon: 'bg-orange-100 text-orange-600',
    infoRow: 'text-orange-800 bg-orange-100/40',
    infoIcon: 'text-orange-500',
  },
  forest: {
    label: 'Forest Calm',
    cardSurface:
      'bg-gradient-to-br from-green-50/70 to-lime-50/60 border-green-100 hover:shadow-green-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-green-50/60 border-green-100',
    badge: 'bg-green-700',
    preview: 'from-green-400 to-lime-400',
    title: 'text-green-900',
    mutedText: 'text-green-700/70',
    icon: 'bg-green-100 text-green-700',
    infoRow: 'text-green-800 bg-green-100/40',
    infoIcon: 'text-green-600',
  },
  golden: {
    label: 'Golden Hour',
    cardSurface:
      'bg-gradient-to-br from-yellow-50/70 to-amber-50/70 border-yellow-100 hover:shadow-yellow-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-yellow-50/60 border-yellow-100',
    badge: 'bg-yellow-500',
    preview: 'from-yellow-300 to-amber-400',
    title: 'text-yellow-900',
    mutedText: 'text-yellow-700/70',
    icon: 'bg-yellow-100 text-yellow-600',
    infoRow: 'text-yellow-800 bg-yellow-100/40',
    infoIcon: 'text-yellow-600',
  },
  cosmic: {
    label: 'Cosmic Night',
    cardSurface:
      'bg-gradient-to-br from-violet-50/70 to-fuchsia-50/70 border-violet-100 hover:shadow-violet-200/50',
    detailsSurface: 'bg-gradient-to-br from-white to-violet-50/60 border-violet-100',
    badge: 'bg-violet-700',
    preview: 'from-violet-400 to-fuchsia-400',
    title: 'text-violet-900',
    mutedText: 'text-violet-700/70',
    icon: 'bg-violet-100 text-violet-600',
    infoRow: 'text-violet-800 bg-violet-100/40',
    infoIcon: 'text-violet-500',
  },
};

export function getEventTheme(theme?: string | null): EventThemeId | null {
  if (!theme) return null;
  const normalized = theme.toLowerCase() as EventThemeId;
  return EVENT_THEME_IDS.includes(normalized) ? normalized : null;
}
