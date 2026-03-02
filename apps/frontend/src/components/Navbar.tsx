import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function Navbar() {
  const user = useStore((s) => s.user);
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="space-x-4">
        <Link to="/events">Події</Link>
        {user && <Link to="/my-events">Мої події</Link>}
        {user && <Link to="/events/new">Створити</Link>}
      </div>
      <div>
        {user ? (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              useStore.getState().setUser(null);
            }}
          >
            Вийти
          </button>
        ) : (
          <Link to="/auth">Увійти</Link>
        )}
      </div>
    </nav>
  );
}
