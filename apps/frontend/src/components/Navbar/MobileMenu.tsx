import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  PlusCircleIcon, 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  TicketIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface MobileMenuProps {
  user: any;
  onLogout: () => void;
  onClose: () => void;
}

export const MobileMenu = ({ user, onLogout, onClose }: MobileMenuProps) => {
  return (
    <div 
      style={{ backgroundColor: '#ffffff', opacity: 1 }}
      className="fixed top-0 right-0 h-full w-[80%] max-w-[320px] z-[100] shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300 border-l border-slate-100"
    >
      <div className="flex justify-between items-center mb-8">
        <span className="text-xl font-black text-slate-800">NodeEvents</span>
        <button 
          onClick={onClose} 
          className="p-2 bg-slate-100 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-500 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col space-y-2 md:space-y-4 overflow-y-auto">
        {/* Web Content will now be on 100% white background */}
        <Link to="/events" onClick={onClose} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
          <TicketIcon className="w-6 h-6 text-indigo-600" />
          <span className="font-bold">Explore</span>
        </Link>

        {user ? (
            <>
            {/* Link for authenticated users */}
            <Link to="/my-events" onClick={onClose} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">
                <CalendarIcon className="w-6 h-6 text-indigo-600" />
                <span>My Schedule</span>
            </Link>
            
            <Link to="/events/new" onClick={onClose} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">
                <PlusCircleIcon className="w-6 h-6 text-indigo-600" />
                <span>Create Event</span>
            </Link>

            <Link to="/creator-page" onClick={onClose} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
                <span>Creator Page</span>
            </Link>

            {/* Section for profile and settings */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
              <Link to="/profile" onClick={onClose} className="flex items-center space-x-3 p-4 text-slate-600 hover:bg-slate-50 rounded-xl">
                <UserCircleIcon className="w-6 h-6 text-slate-400" />
                <span className="font-medium">Account Profile</span>
                </Link>
                
                <Link to="/settings" onClick={onClose} className="flex items-center space-x-3 p-4 text-slate-600 hover:bg-slate-50 rounded-xl">
                <Cog6ToothIcon className="w-6 h-6 text-slate-400" />
                <span className="font-medium">Settings</span>
                </Link>
                
                <button 
                onClick={() => { onLogout(); onClose(); }} 
                className="flex items-center space-x-3 w-full p-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                <span>Sign Out</span>
                </button>
            </div>
            </>
        ) : (
            /* Button for unauthenticated users */
            <div className="mt-6 space-y-3">
            <Link to="/login" onClick={onClose} className="block w-full py-4 bg-indigo-600 text-white text-center font-bold rounded-2xl shadow-lg shadow-indigo-100">
                Sign In
            </Link>
            </div>
        )}
      </div>
    </div>
  );
};