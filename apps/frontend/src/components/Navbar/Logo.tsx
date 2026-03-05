import { Link } from 'react-router-dom';
import { TicketIcon } from '@heroicons/react/24/outline';

export const Logo = () => (
  <Link to="/events" className="flex items-center space-x-2 group">
    <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
      <TicketIcon className="w-6 h-6 text-white" />
    </div>
    <span className="text-xl font-black tracking-tight text-slate-800">
      Event<span className="text-indigo-600">Hub</span>
    </span>
  </Link>
);