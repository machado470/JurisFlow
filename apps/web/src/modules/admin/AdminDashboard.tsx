import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

type DashboardData = {
  users: number;
  students: number;
  admins: number;
  categories: number;
  lessons: number;
  questions: number;
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    axios
      .get('http://localhost:3001/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [token]);

  if (!data) {
    return <div>Carregando dashboard...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard Admin</h1>

      <ul>
        <li>Usuários: {data.users}</li>
        <li>Alunos: {data.students}</li>
        <li>Admins: {data.admins}</li>
        <li>Categorias: {data.categories}</li>
        <li>Lições: {data.lessons}</li>
        <li>Questões: {data.questions}</li>
      </ul>
    </div>
  );
}
