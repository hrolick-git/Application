import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function Navbar() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // видаляємо токен та скидаємо user
    navigate('/auth'); // редірект на сторінку логіну
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="space-x-4">
        <Link to="/events">Події</Link>
        {user && <Link to="/my-events">Мої події</Link>}
        {user && <Link to="/events/new">Створити</Link>}
        {user && <Link to="/profile">Профіль</Link>}
        {user && <Link to="/settings">Налаштування</Link>}
      </div>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Вийти
          </button>
        ) : (
          <Link to="/auth" className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 transition">
            Увійти
          </Link>
        )}
      </div>
    </nav>
  );
}