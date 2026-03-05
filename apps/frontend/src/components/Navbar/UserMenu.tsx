import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const location = useLocation();
  
  const getLinkClass = (path: string) => `
    flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
    ${location.pathname === path ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}
  `;

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Link to="/login" className="text-slate-600 font-semibold hover:text-indigo-600 transition">
          Sign In
        </Link>
        <Link to="/register" className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 border-l pl-6 border-slate-100">
      <Link to="/profile" className={getLinkClass('/profile')} title="Profile">
        <UserCircleIcon className="w-6 h-6" />
        <span className="hidden sm:inline font-medium uppercase tracking-tight text-sm">
          {user.name || user.email.split('@')[0]}
        </span>
      </Link>
      
      <Link to="/settings" className={getLinkClass('/settings')} title="Settings">
        <Cog6ToothIcon className="w-6 h-6" />
      </Link>

      <button
        onClick={onLogout}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        title="Logout"
      >
        <ArrowRightOnRectangleIcon className="w-6 h-6" />
      </button>
    </div>
  );
};