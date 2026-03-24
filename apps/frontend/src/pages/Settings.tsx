import { useState } from 'react';
import { useStore } from '../store/useStore';
import api from '../api/api';
import { 
  UserIcon, 
  BellIcon, 
  ExclamationTriangleIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export function Settings() {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const res = await api.patch('/users/me/display-name', { name });
      setUser(res.data);
      setName(res.data.name || '');
      toast.success('Display name updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update display name');
    } finally {
      setIsSaving(false);
    }
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center space-x-2 mb-6">
      <Icon className="w-5 h-5 text-indigo-600" />
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Settings</h1>
      <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-3 text-amber-800">
        <div className="p-2 bg-amber-100 rounded-lg">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium">
          <strong>Work in Progress:</strong> This page is currently a visual-only preview. Backend integration and settings persistence are coming soon.
        </p>
      </div>
      <div className="space-y-8">
        {/* Profile Settings */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-indigo-50/50">
          <SectionTitle icon={UserIcon} title="Public Profile" />
          
          <div className="space-y-2 md:space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should we call you?"
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <input 
                type="text" 
                disabled 
                value={user?.email} 
                className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-indigo-50/50">
          <SectionTitle icon={BellIcon} title="Notifications" />
          
          <div className="space-y-2 md:space-y-4">
            {[
              { label: 'Email Notifications', desc: 'Get updates about new events' },
              { label: 'Marketing Emails', desc: 'Special offers and platform news' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-bold text-slate-800">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <button className="w-12 h-6 bg-indigo-600 rounded-full relative transition-colors">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </button>
              </div>
            ))}
          </div>
        </section>
        
        {/* Danger Zone */}
        <section className="bg-red-50/50 rounded-[2.5rem] p-8 border border-red-100 shadow-xl shadow-red-50/30 mt-12">
        <div className="flex items-center space-x-2 mb-6">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-3xl border border-red-100 gap-4">
            <div>
            <p className="font-bold text-slate-800">Delete Account</p>
            <p className="text-sm text-slate-500">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            </div>
            <button 
            onClick={() => {
                if(confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                  toast.error('Account scheduled for deletion (simulation)');
                }
            }}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-red-600 font-bold rounded-2xl border-2 border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-95"
            >
            <TrashIcon className="w-5 h-5" />
            <span>Delete My Account</span>
            </button>
        </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button className="px-8 py-3 text-slate-500 font-bold hover:text-slate-800 transition">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}