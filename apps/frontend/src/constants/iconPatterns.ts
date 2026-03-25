import {
  faWineGlass,
  faStar,
  faGear,
  faMusic,
  faBriefcase,
  faPersonRunning,
  faCarrot,
  faPizzaSlice,
  faMugHot,
  faGamepad,
  faCampground,
  faFrog,
  faPersonHiking,
  faPaw,
  faBug,
  faBugs,
  faCat,
  faCrow,
  faGift,
  faSun,
  faCode,
  faFire,
} from '@fortawesome/free-solid-svg-icons';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const ICON_PATTERN_IDS = [
  'wine',
  'star',
  'gear',
  'music',
  'tiktok',
  'business',
  'sport',
  'carrot',
  'pizza',
  'coffee',
  'game',
  'camp',
  'frog',
  'hiking',
  'paw',
  'bugs',
  'cat',
  'bird',
  'gift',
  'sun',
  'code',
  'fire',
] as const;

export type IconPatternId = (typeof ICON_PATTERN_IDS)[number];

export type IconPatternMeta = {
  label: string;
  icon: IconDefinition;
  tagHint: string;
};

export const ICON_PATTERN_META: Record<IconPatternId, IconPatternMeta> = {
  wine:     { label: 'Wine Night',   icon: faWineGlass,     tagHint: 'Food' },
  star:     { label: 'Star Power',   icon: faStar,          tagHint: 'Other' },
  gear:     { label: 'Tech Gear',    icon: faGear,          tagHint: 'Tech' },
  music:    { label: 'Music Beat',   icon: faMusic,         tagHint: 'Music' },
  tiktok:   { label: 'TikTok Vibe', icon: faTiktok,        tagHint: 'Other' },
  business: { label: 'Business',     icon: faBriefcase,     tagHint: 'Business' },
  sport:    { label: 'Sport Energy', icon: faPersonRunning, tagHint: 'Sport' },
  carrot:   { label: 'Veggie Vibes', icon: faCarrot,        tagHint: 'Food' },
  pizza:    { label: 'Pizza Party',  icon: faPizzaSlice,    tagHint: 'Food' },
  coffee:   { label: 'Coffee Time',  icon: faMugHot,        tagHint: 'Food' },
  game:     { label: 'Game Time',    icon: faGamepad,       tagHint: 'Game' },
  camp:     { label: 'Campout',      icon: faCampground,    tagHint: 'Other' },
  frog:     { label: 'Frog Mode',    icon: faFrog,          tagHint: 'Other' },
  hiking:   { label: 'Hiking Trek',  icon: faPersonHiking,  tagHint: 'Other' },
  paw:      { label: 'Pet Lovers',   icon: faPaw,           tagHint: 'Other' },
  bugs:     { label: 'Bug Hunt',     icon: faBugs,          tagHint: 'Tech' },
  cat:      { label: 'Cat Cult',     icon: faCat,           tagHint: 'Other' },
  bird:     { label: 'Free Bird',    icon: faCrow,          tagHint: 'Other' },
  gift:     { label: 'Gift Vibes',   icon: faGift,          tagHint: 'Other' },
  sun:      { label: 'Sunny Day',    icon: faSun,           tagHint: 'Other' },
  code:     { label: 'Dev Mode',     icon: faCode,          tagHint: 'Tech' },
  fire:     { label: 'On Fire',      icon: faFire,          tagHint: 'Other' },
};

export function getIconPattern(raw?: string | null): IconPatternId | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim() as IconPatternId;
  return (ICON_PATTERN_IDS as readonly string[]).includes(lower) ? lower : null;
}
