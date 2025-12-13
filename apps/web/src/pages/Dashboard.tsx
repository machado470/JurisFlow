import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard do Aluno</h1>
      <p>Bem-vindo, {user?.name}</p>
    </div>
  );
}
