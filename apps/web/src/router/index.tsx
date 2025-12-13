import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../modules/admin/AdminDashboard';
import { RequireAdmin } from './RequireAdmin';
import AppLayout from '../layouts/AppLayout';

export default function Router() {
  return (
    <Routes>
      {/* inicial */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* pública */}
      <Route path="/login" element={<Login />} />

      {/* aluno */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        }
      />

      {/* admin */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </RequireAdmin>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
