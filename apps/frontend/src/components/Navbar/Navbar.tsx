import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, CircleStackIcon } from '@heroicons/react/24/outline';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { useStore } from '../../store/useStore';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Logo />
          <NavLinks isAuthenticated={!!user} />
        </div>

        <div className="flex items-center">
          {user && (
            <div className="mr-3 inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-700">
              <CircleStackIcon className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-wide">
                {user.vibecoins ?? 0} VC
              </span>
            </div>
          )}

          {/* Desktop Menu (only for wide screens) */}
          <div className="hidden md:block">
            <UserMenu user={user} onLogout={handleLogout} />
          </div>

          {/* Burger Button - NOW VISIBLE ALL THE TIME ON MOBILE DEVICES */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
      {isMenuOpen && (
        <>
          {/* Semi-transparent overlay that blurs the background */}
          <div 
            className="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <MobileMenu 
            user={user} 
            onLogout={handleLogout} 
            onClose={() => setIsMenuOpen(false)} 
          />
        </>
      )}
    </>
  );
}