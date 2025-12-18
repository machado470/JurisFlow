import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import AdminDashboard from '../modules/admin/AdminDashboard'
import CollaboratorDashboard from '../modules/collaborator/Dashboard'
import CollaboratorAssessment from '../modules/collaborator/Assessment'
import { RequireAuth } from '../auth/RequireAuth'

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin/*"
        element={
          <RequireAuth role="ADMIN">
            <AdminDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/collaborator"
        element={
          <RequireAuth role="COLLABORATOR">
            <CollaboratorDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/collaborator/assessment/:assignmentId"
        element={
          <RequireAuth role="COLLABORATOR">
            <CollaboratorAssessment />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
