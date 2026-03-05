import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { NavLinks } from './NavLinks';
import { UserMenu } from './UserMenu';
import { useStore } from '../../store/useStore';

export function Navbar() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Logo />
          <NavLinks isAuthenticated={!!user} />
        </div>

        <UserMenu user={user} onLogout={handleLogout} />
      </div>
    </nav>
  );
}