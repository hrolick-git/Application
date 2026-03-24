export const ICON_PATTERN_IDS = [
  'tech',
  'art',
  'business',
  'music',
  'sport',
  'food',
  'game',
  'other',
] as const;

export type IconPatternId = (typeof ICON_PATTERN_IDS)[number];

export type IconPatternMeta = {
  label: string;
  iconKey: string;
  tagHint: string;
};

export const ICON_PATTERN_META: Record<IconPatternId, IconPatternMeta> = {
  tech:     { label: 'Tech Vibes',    iconKey: 'tech', tagHint: 'Tech' },
  art:      { label: 'Creative Art',  iconKey: 'art', tagHint: 'Art' },
  business: { label: 'Business',      iconKey: 'business', tagHint: 'Business' },
  music:    { label: 'Music Beat',    iconKey: 'music', tagHint: 'Music' },
  sport:    { label: 'Sport Energy',  iconKey: 'sport', tagHint: 'Sport' },
  food:     { label: 'Food & Drinks', iconKey: 'food', tagHint: 'Food' },
  game:     { label: 'Game Time',     iconKey: 'game', tagHint: 'Game' },
  other:    { label: 'Sparkles',      iconKey: 'other', tagHint: 'Other' },
};

export function getIconPattern(raw?: string | null): IconPatternId | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim() as IconPatternId;
  return (ICON_PATTERN_IDS as readonly string[]).includes(lower) ? lower : null;
}
