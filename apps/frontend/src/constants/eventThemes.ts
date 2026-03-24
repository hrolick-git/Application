export const EVENT_THEME_IDS = [
  'violet',
  'mint',
  'sky',
  'sunset',
  'blossom',
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
};

export function getEventTheme(theme?: string | null): EventThemeId | null {
  if (!theme) return null;
  const normalized = theme.toLowerCase() as EventThemeId;
  return EVENT_THEME_IDS.includes(normalized) ? normalized : null;
}
