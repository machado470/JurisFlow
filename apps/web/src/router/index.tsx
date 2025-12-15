import { Routes, Route } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import ExecutiveDashboard from '../modules/admin/ExecutiveDashboard'

function Home() {
  return <div className="text-white">Home pública</div>
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/admin"
        element={
          <AppLayout>
            <ExecutiveDashboard />
          </AppLayout>
        }
      />
    </Routes>
  )
}
