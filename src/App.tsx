import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { ReportesMonitoreo } from '@/pages/ReportesMonitoreo'
import { ReportesCWV } from '@/pages/ReportesCWV'
import { ReportesSEO } from '@/pages/ReportesSEO'
import { ConfigDominios } from '@/pages/ConfigDominios'
import { ConfigEquipo } from '@/pages/ConfigEquipo'
import { ConfigUsuarios } from '@/pages/ConfigUsuarios'
import { ConfigBranding } from '@/pages/ConfigBranding'
import { HistorialLogs } from '@/pages/HistorialLogs'
import { NotFound } from '@/pages/NotFound'

function App() {
  const { user } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes/monitoreo"
          element={
            <ProtectedRoute>
              <Layout>
                <ReportesMonitoreo />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes/cwv"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ReportesCWV />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes/seo"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ReportesSEO />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/global/dominios"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ConfigDominios />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/global/equipo"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ConfigEquipo />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/global/usuarios"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ConfigUsuarios />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/dominio/branding"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <ConfigBranding />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/historial/logs"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <HistorialLogs />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
