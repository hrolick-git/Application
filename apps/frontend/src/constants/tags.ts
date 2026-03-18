export const TAG_COLOR_CLASSES: Record<string, string> = {
  Tech: 'bg-blue-100 text-blue-700 border-blue-200',
  Art: 'bg-pink-100 text-pink-700 border-pink-200',
  Business: 'bg-amber-100 text-amber-700 border-amber-200',
  Music: 'bg-purple-100 text-purple-700 border-purple-200',
  Sport: 'bg-green-100 text-green-700 border-green-200',
  Food: 'bg-orange-100 text-orange-700 border-orange-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function getTagColorClasses(tagName: string) {
  return TAG_COLOR_CLASSES[tagName] || TAG_COLOR_CLASSES.Other;
}

