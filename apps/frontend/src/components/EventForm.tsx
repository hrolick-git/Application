import { useState, useEffect } from 'react';
import api from '../api/api';

interface Tag {
  id: string;
  name: string;
}

interface EventFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void> | void;
  buttonText: string;
  availableTags?: Tag[];
}

export function EventForm({ initialData, onSubmit, buttonText, availableTags: propTags }: EventFormProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map((t: Tag) => t.id) || []
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    startsAt: initialData?.startsAt ? new Date(initialData.startsAt).toISOString().slice(0, 16) : '',
    endsAt: initialData?.endsAt ? new Date(initialData.endsAt).toISOString().slice(0, 16) : '',
    capacity: initialData?.capacity || '',
    visibility: initialData?.visibility || 'PUBLIC',
  });

  useEffect(() => {
    if (propTags) {
      setAvailableTags(propTags);
      return;
    }
    api.get('/events/tags').then(res => setAvailableTags(res.data)).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) return prev.filter(id => id !== tagId);
      if (prev.length >= 5) return prev;
      return [...prev, tagId];
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onSubmit({ ...formData, tagIds: selectedTagIds });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium";
  const labelClasses = "block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wide";

  const TAG_COLORS: Record<string, string> = {
    Tech:     'bg-blue-100 text-blue-700 border-blue-200',
    Art:      'bg-pink-100 text-pink-700 border-pink-200',
    Business: 'bg-amber-100 text-amber-700 border-amber-200',
    Music:    'bg-purple-100 text-purple-700 border-purple-200',
    Sport:    'bg-green-100 text-green-700 border-green-200',
    Food:     'bg-orange-100 text-orange-700 border-orange-200',
    Other:    'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
      {/* Title */}
      <div>
        <label className={labelClasses}>Event Title</label>
        <input
          required
          name="title"
          placeholder="e.g. Secret Rooftop Party"
          value={formData.title}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          name="description"
          placeholder="Tell us more about the vibe..."
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Starts At */}
        <div>
          <label className={labelClasses}>Starts At</label>
          <input
            required
            type="datetime-local"
            name="startsAt"
            value={formData.startsAt}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Ends At */}
        <div>
          <label className={labelClasses}>Ends At (Optional)</label>
          <input
            type="datetime-local"
            name="endsAt"
            value={formData.endsAt}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelClasses}>Location</label>
        <input
          required
          name="location"
          placeholder="City, Street or Online Link"
          value={formData.location}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacity */}
        <div>
          <label className={labelClasses}>Capacity</label>
          <input
            type="number"
            name="capacity"
            placeholder="No limit"
            value={formData.capacity}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Visibility */}
        <div>
          <label className={labelClasses}>Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            <option value="PUBLIC">🌍 Public — Everyone can see</option>
            <option value="PRIVATE">🔒 Private — Only via direct access</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div>
          <label className={labelClasses}>
            Tags
            <span className="ml-2 text-xs font-medium text-slate-400 normal-case tracking-normal">
              {selectedTagIds.length}/5 selected
            </span>
          </label>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            {availableTags.map(tag => {
              const isSelected = selectedTagIds.includes(tag.id);
              const colorClass = TAG_COLORS[tag.name] || TAG_COLORS['Other'];
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    isSelected
                      ? `${colorClass} shadow-sm scale-105`
                      : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <span className="mr-1">✓</span>}
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-4 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </form>
  );
}