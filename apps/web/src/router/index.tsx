import { Routes, Route, Navigate } from 'react-router-dom'

import RequireAuth from '../auth/RequireAuth'

import LandingPage from '../modules/landing/LandingPage'
import Login from '../modules/auth/Login'

import AdminShell from '../modules/admin/AdminShell'
import AdminDashboard from '../modules/admin/AdminDashboard'
import TracksPage from '../modules/admin/TracksPage'
import PeoplePage from '../modules/admin/PeoplePage'
import PersonDetailPage from '../modules/admin/PersonDetailPage'
import AuditPage from '../modules/admin/AuditPage'
import EvaluationsPage from '../modules/admin/EvaluationsPage'

import CollaboratorDashboard from '../modules/collaborator/CollaboratorDashboard'
import AssessmentPage from '../modules/collaborator/AssessmentPage'
import TimelinePage from '../modules/collaborator/TimelinePage'

export default function Router() {
  return (
    <Routes>
      {/* 🌐 Público */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* 👤 Colaborador */}
      <Route element={<RequireAuth role="COLLABORATOR" />}>
        <Route
          path="/collaborator"
          element={<CollaboratorDashboard />}
        />
        <Route
          path="/collaborator/assessment/:assignmentId"
          element={<AssessmentPage />}
        />
        <Route
          path="/collaborator/timeline"
          element={<TimelinePage />}
        />
      </Route>

      {/* 👑 Admin */}
      <Route element={<RequireAuth role="ADMIN" />}>
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminDashboard />} />
          <Route path="trilhas" element={<TracksPage />} />
          <Route path="pessoas" element={<PeoplePage />} />
          <Route
            path="pessoas/:id"
            element={<PersonDetailPage />}
          />
          <Route path="auditoria" element={<AuditPage />} />
          <Route
            path="avaliacoes"
            element={<EvaluationsPage />}
          />
        </Route>
      </Route>

      {/* 🧹 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
