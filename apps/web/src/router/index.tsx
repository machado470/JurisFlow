import { Routes, Route, Navigate } from 'react-router-dom'

import EntryGate from '../auth/EntryGate'
import RequireAuth from '../auth/RequireAuth'

import LandingPage from '../modules/landing/LandingPage'
import Login from '../modules/auth/Login'
import ActivateAccount from '../modules/auth/ActivateAccount'

import AdminLayout from '../modules/admin/AdminLayout'
import AdminDashboard from '../modules/admin/AdminDashboard'
import People from '../modules/admin/People'
import PersonDetail from '../modules/admin/PersonDetail'
import Reports from '../modules/admin/Reports'
import Tracks from '../modules/admin/Tracks'
import TrackDetail from '../modules/admin/TrackDetail'
import Pending from '../modules/admin/Pending'
import Audit from '../modules/admin/Audit'
import Settings from '../modules/admin/Settings'

import CollaboratorLayout from '../modules/collaborator/CollaboratorLayout'
import CollaboratorDashboard from '../modules/collaborator/CollaboratorDashboard'
import AssignmentExecution from '../modules/collaborator/AssignmentExecution'

export default function Router() {
  return (
    <Routes>
      {/* Entrada inteligente */}
      <Route path="/" element={<EntryGate />} />

      {/* Públicas */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/activate" element={<ActivateAccount />} />

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
        <Route path="people" element={<People />} />
        <Route path="people/:id" element={<PersonDetail />} />
        <Route path="tracks" element={<Tracks />} />
        <Route path="tracks/:id" element={<TrackDetail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="pending" element={<Pending />} />
        <Route path="audit" element={<Audit />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Colaborador */}
      <Route
        path="/collaborator"
        element={
          <RequireAuth role="COLLABORATOR">
            <CollaboratorLayout />
          </RequireAuth>
        }
      >
        <Route index element={<CollaboratorDashboard />} />
        <Route
          path="assignment/:id"
          element={<AssignmentExecution />}
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

