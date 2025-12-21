import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../modules/auth/Login'
import { RequireAuth } from '../auth/RequireAuth'

import AdminLayout from '../modules/admin/AdminLayout'
import AdminDashboard from '../modules/admin/AdminDashboard'
import PersonDetail from '../modules/admin/PersonDetail'
import Tracks from '../modules/admin/Tracks'
import Reports from '../modules/admin/Reports'

import CollaboratorLayout from '../modules/collaborator/CollaboratorLayout'
import CollaboratorDashboard from '../modules/collaborator/CollaboratorDashboard'

export default function Router() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="ADMIN">
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="people/:id" element={<PersonDetail />} />
        <Route path="tracks" element={<Tracks />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Collaborator */}
      <Route
        path="/collaborator"
        element={
          <RequireAuth role="COLLABORATOR">
            <CollaboratorLayout />
          </RequireAuth>
        }
      >
        <Route index element={<CollaboratorDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

