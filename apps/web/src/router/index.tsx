import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../modules/Home'
import PeopleRiskDashboard from '../modules/people/PeopleRiskDashboard'
import AppLayout from '../layouts/AppLayout'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/admin/people-risk"
        element={
          <AppLayout>
            <PeopleRiskDashboard />
          </AppLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
