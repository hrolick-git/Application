import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface Props {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: Props) {
  const user = useStore((s) => s.user);

  if (!user) return <Navigate to="/auth" replace />;

  return children;
}