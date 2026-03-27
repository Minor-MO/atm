import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useDomainStore } from '@/store/domainStore'
import { api } from '@/api/client'
import { ReporteMonitoreo } from '@/types'

export function ReportesSEO() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { selectedDomain } = useDomainStore()

  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [reporte, setReporte] = useState<ReporteMonitoreo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (!selectedDomain) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
        <p className="text-yellow-700">Por favor, selecciona un dominio primero</p>
        <button onClick={() => navigate('/dashboard')} className="text-atom-blue hover:underline mt-2">
          Volver al Dashboard
        </button>
      </div>
    )
  }

  if (user?.rol !== 'admin') {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <p className="text-red-700">No tienes permisos para acceder a esta sección</p>
        <button onClick={() => navigate('/dashboard')} className="text-atom-blue hover:underline mt-2">
          Volver al Dashboard
        </button>
      </div>
    )
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const reporteRes = await api.reportes.seo.get({
        dominio_id: selectedDomain.id,
      })

      setReporte(reporteRes.data || null)
    } catch (err: any) {
      console.error('Error cargando datos:', err)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedDomain.id])

  const handleRegenerar = async () => {
    try {
      setLoading(true)
      await api.reportes.seo.regenerar({
        dominio_id: selectedDomain.id,
      })
      await fetchData()
    } catch (err: any) {
      setError('Error al regenerar el reporte')
    } finally {
      setLoading(false)
    }
  }

  const handleEnviar = async () => {
    try {
      setLoading(true)
      await api.reportes.seo.enviar({
        dominio_id: selectedDomain.id,
        aprobado_por: user?.email,
      })
      await fetchData()
    } catch (err: any) {
      setError('Error al enviar el reporte')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en_revision':
        return 'bg-blue-100 text-blue-800'
      case 'enviado':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoEmoji = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return '🟡'
      case 'en_revision':
        return '🔵'
      case 'enviado':
        return '🟢'
      default:
        return '⚪'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-atom-dark">Reportes - SEO</h1>
            <p className="text-gray-600 mt-2">Dominio: {selectedDomain.nombre}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-atom-blue hover:underline text-sm font-medium"
          >
            Cambiar dominio
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atom-blue"></div>
        </div>
      )}

      {!loading && reporte && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-atom-dark mb-6">Estado del Reporte</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getEstadoBadge(reporte.estado)}`}>
                <span>{getEstadoEmoji(reporte.estado)}</span>
                <span className="font-semibold capitalize">{reporte.estado.replace('_', ' ')}</span>
              </div>
            </div>

            {reporte.generado_en && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Generado en</p>
                <p className="font-semibold text-gray-800">{new Date(reporte.generado_en).toLocaleDateString('es-ES')}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
            {reporte.generado_por && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Generado por</p>
                <p className="font-semibold text-gray-800">{reporte.generado_por}</p>
              </div>
            )}
            {reporte.enviado_a_ti_en && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Enviado a TI</p>
                <p className="font-semibold text-gray-800">{new Date(reporte.enviado_a_ti_en).toLocaleDateString('es-ES')}</p>
              </div>
            )}
            {reporte.enviado_al_cliente_en && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Enviado al cliente</p>
                <p className="font-semibold text-gray-800">{new Date(reporte.enviado_al_cliente_en).toLocaleDateString('es-ES')}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRegenerar}
              disabled={loading}
              className="px-6 py-2 bg-atom-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Regenerar Reporte
            </button>
            {reporte.estado === 'pendiente' || reporte.estado === 'en_revision' ? (
              <button
                onClick={handleEnviar}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Aprobar y Enviar
              </button>
            ) : null}
          </div>
        </div>
      )}

      {!loading && !reporte && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <p className="text-yellow-700">No hay datos de SEO para este período</p>
        </div>
      )}
    </div>
  )
}
