import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AppLayout({ children }: { children: JSX.Element }) {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div>
      <header
        style={{
          padding: 16,
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #ddd',
        }}
      >
        <strong>AutoEscola Sim</strong>

        <div>
          <span style={{ marginRight: 12 }}>
            {user?.role === 'ADMIN' ? 'Admin' : 'Aluno'}
          </span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
