import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  CalendarIcon, 
  PlusCircleIcon, 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

export function Navbar() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation(); // Для підсвічування активного пункту

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Допоміжна функція для стилізації активних лінків
  const linkClass = (path: string) => `
    flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
    ${location.pathname === path 
      ? 'bg-indigo-50 text-indigo-700 font-bold' 
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Логотип або Назва */}
        <div className="flex items-center space-x-8">
          <Link to="/events" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <TicketIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">Event<span className="text-indigo-600">Hub</span></span>
          </Link>

          {/* Навігація */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/events" className={linkClass('/events')}>
              <span>Події</span>
            </Link>
            
            {user && (
              <>
                <Link to="/my-events" className={linkClass('/my-events')}>
                  <CalendarIcon className="w-5 h-5" />
                  <span>Мої події</span>
                </Link>
                <Link to="/events/new" className={linkClass('/events/new')}>
                  <PlusCircleIcon className="w-5 h-5" />
                  <span>Створити</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Профіль та Вихід */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2 border-l pl-6 border-slate-100">
              <Link to="/profile" className={linkClass('/profile')} title="Профіль">
                <UserCircleIcon className="w-6 h-6" />
                <span className="hidden sm:inline font-medium">{user.email.split('@')[0]}</span>
              </Link>
              
              <Link to="/settings" className={linkClass('/settings')} title="Налаштування">
                <Cog6ToothIcon className="w-6 h-6" />
              </Link>

              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Вийти"
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}