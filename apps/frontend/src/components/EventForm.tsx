import { useState } from 'react';

interface EventFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  buttonText: string;
}

export function EventForm({ initialData, onSubmit, buttonText }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    startsAt: initialData?.startsAt ? new Date(initialData.startsAt).toISOString().slice(0, 16) : '',
    endsAt: initialData?.endsAt ? new Date(initialData.endsAt).toISOString().slice(0, 16) : '',
    capacity: initialData?.capacity || '',
    visibility: initialData?.visibility || 'PUBLIC',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium";
  const labelClasses = "block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <button
        type="submit"
        className="w-full mt-4 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
      >
        {buttonText}
      </button>
    </form>
  );
}