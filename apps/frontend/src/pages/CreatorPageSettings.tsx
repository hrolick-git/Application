import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import api from '../api/api';
import { useStore } from '../store/useStore';

type CreatorPage = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
};

export function CreatorPageSettings() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [renamingSlug, setRenamingSlug] = useState(false);

  const [creatorPage, setCreatorPage] = useState<CreatorPage | null>(null);

  const [createSlug, setCreateSlug] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const loadMyCreatorPage = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/me/creator-page');
      const page = res.data as CreatorPage | null;
      setCreatorPage(page);

      if (page) {
        setTitle(page.title || '');
        setDescription(page.description || '');
        setNewSlug(page.slug || '');
      }
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        toast.error(err?.response?.data?.message || 'Failed to load creator page');
      }
      setCreatorPage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyCreatorPage();
  }, []);

  const applyVibecoins = (vibecoins?: number) => {
    if (!user || typeof vibecoins !== 'number') return;
    setUser({ ...user, vibecoins });
  };

  const createPage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await api.post('/users/me/creator-page', {
        slug: createSlug,
        title: createTitle,
        description: createDescription,
      });

      setCreatorPage(res.data.creatorPage);
      setTitle(res.data.creatorPage.title || '');
      setDescription(res.data.creatorPage.description || '');
      setNewSlug(res.data.creatorPage.slug || '');
      applyVibecoins(res.data.vibecoins);
      toast.success('Creator page created: -2 vibecoins');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create page');
    } finally {
      setCreating(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.patch('/users/me/creator-page', {
        title,
        description,
      });
      setCreatorPage(res.data);
      toast.success('Title and description updated');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update page');
    } finally {
      setSavingProfile(false);
    }
  };

  const renameSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setRenamingSlug(true);
      const res = await api.patch('/users/me/creator-page/slug', { slug: newSlug });
      setCreatorPage(res.data.creatorPage);
      applyVibecoins(res.data.vibecoins);

      if (res.data.spent > 0) {
        toast.success('Slug updated: -2 vibecoins');
      } else {
        toast.success('Slug unchanged');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update slug');
    } finally {
      setRenamingSlug(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-slate-500">Loading...</div>;
  }

  if (!creatorPage) {
    return (
      <div className="py-4 md:py-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Creator Page</h1>
          <p className="mt-2 text-slate-600">
            Create your personalized organizer page. Initial creation costs 2 vibecoins.
          </p>
          <p className="mt-1 text-xs text-amber-700 font-semibold uppercase tracking-wider">
            Current balance: {user?.vibecoins ?? 0} vibecoins
          </p>

          <form onSubmit={createPage} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Slug (unique)</label>
              <input
                value={createSlug}
                onChange={(e) => setCreateSlug(e.target.value)}
                placeholder="my-community"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Title</label>
              <input
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                placeholder="Hrolick Events"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Description</label>
              <textarea
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Page description..."
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create for 2 vibecoins'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Creator Page</h1>
            <p className="text-slate-500 mt-1">Edit title and description for free.</p>
          </div>
          <Link
            to={`/creators/${creatorPage.slug}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2 font-bold text-indigo-700"
          >
            Open public page
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </div>

        <form onSubmit={saveProfile} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {savingProfile ? 'Saving...' : 'Save for free'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 p-5 md:p-8 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Slug (rename for 2 vibecoins)</h2>
        <p className="text-slate-500 mt-1">Your current slug: <span className="font-bold text-slate-800">{creatorPage.slug}</span></p>
        <p className="mt-1 text-xs text-amber-700 font-semibold uppercase tracking-wider">
          Current balance: {user?.vibecoins ?? 0} vibecoins
        </p>

        <form onSubmit={renameSlug} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400"
            placeholder="new-slug"
            required
          />
          <button
            type="submit"
            disabled={renamingSlug}
            className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {renamingSlug ? 'Updating...' : 'Rename for 2'}
          </button>
        </form>
      </div>
    </div>
  );
}
