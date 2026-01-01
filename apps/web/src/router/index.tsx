import { Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from '../auth/RequireAuth'

// PUBLIC
import LandingPage from '../modules/landing/LandingPage'
import Login from '../modules/auth/Login'

// ADMIN
import AdminLayout from '../modules/admin/AdminLayout'
import AdminDashboard from '../modules/admin/AdminDashboard'

// EXECUÇÃO (REAPROVEITADA)
import CollaboratorDashboard from '../modules/collaborator/CollaboratorDashboard'
import AssignmentExecution from '../modules/collaborator/AssignmentExecution'

export default function Router() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="ADMIN">
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* EXECUÇÃO (ADMIN PODE EXECUTAR) */}
      <Route
        path="/execucao"
        element={
          <RequireAuth role="ADMIN">
            <CollaboratorDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/execucao/assignment/:assignmentId"
        element={
          <RequireAuth role="ADMIN">
            <AssignmentExecution />
          </RequireAuth>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
