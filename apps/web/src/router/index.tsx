import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../modules/auth/Login'
import { RequireAuth } from '../auth/RequireAuth'

import AdminLayout from '../modules/admin/AdminLayout'
import AdminDashboard from '../modules/admin/AdminDashboard'
import People from '../modules/admin/People'
import PersonDetail from '../modules/admin/PersonDetail'
import Tracks from '../modules/admin/Tracks'
import RiskReport from '../modules/admin/RiskReport'
import Reports from '../modules/admin/Reports'

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <RequireAuth role="ADMIN">
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="people" element={<People />} />
        <Route path="people/:id" element={<PersonDetail />} />
        <Route path="tracks" element={<Tracks />} />
        <Route path="risk" element={<RiskReport />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
