import { Routes, Route, Navigate } from 'react-router-dom'

// 🔓 PÚBLICO
import LandingPage from '../modules/landing/LandingPage'
import Login from '../modules/auth/Login'

// 🧭 ONBOARDING
import Onboarding from '../modules/onboarding/Onboarding'

// 🔐 GUARDS
import EntryGate from './EntryGate'
import RequireAuth from '../auth/RequireAuth'
import RequireOnboarding from '../auth/RequireOnboarding'

// 👑 ADMIN
import AdminLayout from '../modules/admin/AdminLayout'
import AdminDashboard from '../modules/admin/AdminDashboard'
import People from '../modules/admin/People'
import PersonDetail from '../modules/admin/PersonDetail'
import Tracks from '../modules/admin/Tracks'
import TrackDetail from '../modules/admin/TrackDetail'
import Reports from '../modules/admin/Reports'
import Audit from '../modules/admin/Audit'
import Settings from '../modules/admin/Settings'

// ▶️ COLABORADOR
import CollaboratorDashboard from '../modules/collaborator/CollaboratorDashboard'
import AssignmentExecution from '../modules/collaborator/AssignmentExecution'

export default function Router() {
  return (
    <Routes>
      {/* PÚBLICO */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* ONBOARDING */}
      <Route
        path="/onboarding"
        element={
          <EntryGate>
            <Onboarding />
          </EntryGate>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <EntryGate>
            <RequireAuth role="ADMIN">
              <RequireOnboarding>
                <AdminLayout />
              </RequireOnboarding>
            </RequireAuth>
          </EntryGate>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="people" element={<People />} />
        <Route path="people/:personId" element={<PersonDetail />} />
        <Route path="tracks" element={<Tracks />} />
        <Route path="tracks/:trackId" element={<TrackDetail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit" element={<Audit />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* COLABORADOR */}
      <Route
        path="/execucao"
        element={
          <EntryGate>
            <RequireAuth role="COLLABORATOR">
              <RequireOnboarding>
                <CollaboratorDashboard />
              </RequireOnboarding>
            </RequireAuth>
          </EntryGate>
        }
      />

      <Route
        path="/execucao/assignment/:assignmentId"
        element={
          <EntryGate>
            <RequireAuth role="COLLABORATOR">
              <RequireOnboarding>
                <AssignmentExecution />
              </RequireOnboarding>
            </RequireAuth>
          </EntryGate>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
