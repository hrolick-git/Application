import { Link, useLocation } from 'react-router-dom';
import { CalendarIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface NavLinksProps {
  isAuthenticated: boolean;
}

export const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
  const location = useLocation();

  const getLinkClass = (path: string) => `
    flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
    ${location.pathname === path 
      ? 'bg-indigo-50 text-indigo-700 font-bold' 
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
  `;

  return (
    <div className="hidden md:flex items-center space-x-1">
      <Link to="/events" className={getLinkClass('/events')}>
        <span>Events</span>
      </Link>
      
      {isAuthenticated && (
        <>
          <Link to="/my-events" className={getLinkClass('/my-events')}>
            <CalendarIcon className="w-5 h-5" />
            <span>My Schedule</span>
          </Link>
          <Link to="/events/new" className={getLinkClass('/events/new')}>
            <PlusCircleIcon className="w-5 h-5" />
            <span>Create</span>
          </Link>
        </>
      )}
    </div>
  );
};