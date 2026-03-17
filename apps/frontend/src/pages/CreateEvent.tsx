import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../components/EventForm';
import { PlusIcon, ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export function CreateEvent() {
  const navigate = useNavigate();

  const handleCreate = async (formData: any) => {
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description || "",
        location: formData.location,
        visibility: formData.visibility || 'PUBLIC',
        startsAt: new Date(formData.startsAt).toISOString(),
        tagIds: formData.tagIds || [],  // ← додай це
      };

      if (formData.endsAt) {
        payload.endsAt = new Date(formData.endsAt).toISOString();
      }

      if (formData.capacity !== "" && formData.capacity !== null) {
        payload.capacity = Number(formData.capacity);
      }

      const res = await api.post('/events', payload);
      navigate(`/events/${res.data.id}`);
    } catch (err: any) {
      console.error("❌ Backend Error:", err.response?.data);
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Creation failed');
    }
  };

  return (
    <div className="bg-slate-50/30 px-3 py-4 md:p-6">
      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/events')}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-semibold group text-sm"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-12">
            {/* Section Header */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-indigo-600 p-3 md:p-4 rounded-[1.25rem] shadow-lg shadow-indigo-200 shrink-0">
                <PlusIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Create Event</h2>
                <p className="text-slate-500 mt-1 flex items-center font-medium">
                  Fill in the details for your next big thing <SparklesIcon className="w-4 h-4 ml-1.5 text-amber-400" />
                </p>
              </div>
            </div>

            {/* Event Form */}
            <div className="relative">
               <EventForm 
                onSubmit={handleCreate} 
                buttonText="Publish Event" 
              />
            </div>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="text-center mt-10">
          <p className="text-slate-400 text-[10px] px-10 leading-relaxed uppercase tracking-[0.2em] font-black opacity-60">
            By creating an event, you agree to our community guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}