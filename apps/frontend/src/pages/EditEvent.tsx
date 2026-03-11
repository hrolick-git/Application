import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { EventForm } from '../components/EventForm';
import { PencilSquareIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data;

        setInitialData({
          ...event,
          startsAt: event.startsAt ? event.startsAt.substring(0, 16) : '',
          endsAt: event.endsAt ? event.endsAt.substring(0, 16) : '',
          capacity: event.capacity ?? '',
        });
      } catch (err) {
        setError('Failed to load event data');
      }
    };
    fetchEvent();
  }, [id]);

  const handleUpdate = async (formData: any) => {
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description || null,
        location: formData.location,
        visibility: formData.visibility,
        startsAt: new Date(formData.startsAt).toISOString(),
      };

      if (formData.endsAt) {
        payload.endsAt = new Date(formData.endsAt).toISOString();
      } else {
        payload.endsAt = null; 
      }

      payload.capacity = (formData.capacity === "" || formData.capacity === null) 
        ? null 
        : Number(formData.capacity);

      await api.patch(`/events/${id}`, payload);
      navigate(`/events/${id}`);
    } catch (err: any) {
      console.error("Error updating event:", err.response?.data);
      alert(err.response?.data?.message || "Error updating event");
    }
  };

  if (error) return (
    <div className="text-center mt-20">
      <p className="text-red-500 font-medium">{error}</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">Back to Event Details</button>
    </div>
  );

  if (!initialData) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="bg-slate-50/30 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Event Details
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-amber-50 p-3 rounded-2xl">
                <PencilSquareIcon className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">Edit Event</h2>
                <p className="text-slate-500 text-sm">Make changes to your event</p>
              </div>
            </div>

            {/* Event Form */}
            <EventForm 
              initialData={initialData} 
              onSubmit={handleUpdate} 
              buttonText="Save Changes" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}