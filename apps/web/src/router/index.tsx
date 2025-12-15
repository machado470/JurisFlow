import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from '../modules/admin/AdminDashboard'
import ExecutiveDashboard from '../modules/admin/ExecutiveDashboard'
import RiskReport from '../modules/admin/RiskReport'
import PersonDetail from '../modules/admin/PersonDetail'

export default function Router() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Navigate to="executive" />} />
        <Route path="executive" element={<ExecutiveDashboard />} />
        <Route path="risk" element={<RiskReport />} />
        <Route path="people/:personId" element={<PersonDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  )
}
