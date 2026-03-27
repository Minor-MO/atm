import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useDomainStore } from '@/store/domainStore'
import { api } from '@/api/client'
import { Incidente, ReporteMonitoreo } from '@/types'

export function ReportesMonitoreo() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { selectedDomain } = useDomainStore()

  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [incidentes, setIncidentes] = useState<Incidente[]>([])
  const [reporte, setReporte] = useState<ReporteMonitoreo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModalIncidente, setShowModalIncidente] = useState(false)
  const [formIncidente, setFormIncidente] = useState({
    fecha_incidente: new Date().toISOString().split('T')[0],
    titulo: '',
    descripcion: '',
  })
  const [editingId, setEditingId] = useState<number | null>(null)

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

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [incidentesRes, reporteRes] = await Promise.all([
        api.incidentes.getList({ dominio_id: selectedDomain.id, mes, anio }),
        api.reportes.monitoreo.get({ dominio_id: selectedDomain.id, mes, anio }),
      ])

      setIncidentes(incidentesRes.data.incidentes || [])
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
  }, [selectedDomain.id, mes, anio])

  const handleAddIncidente = async () => {
    if (!formIncidente.titulo.trim()) {
      setError('El título es requerido')
      return
    }

    try {
      setLoading(true)
      if (editingId) {
        await api.incidentes.update(editingId, {
          fecha_incidente: formIncidente.fecha_incidente,
          titulo: formIncidente.titulo,
          descripcion: formIncidente.descripcion,
        })
      } else {
        await api.incidentes.create({
          dominio_id: selectedDomain.id,
          fecha_incidente: formIncidente.fecha_incidente,
          titulo: formIncidente.titulo,
          descripcion: formIncidente.descripcion,
          registrado_por: user?.email,
        })
      }

      setFormIncidente({
        fecha_incidente: new Date().toISOString().split('T')[0],
        titulo: '',
        descripcion: '',
      })
      setEditingId(null)
      setShowModalIncidente(false)
      await fetchData()
    } catch (err: any) {
      setError('Error al guardar el incidente')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteIncidente = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este incidente?')) return

    try {
      setLoading(true)
      await api.incidentes.delete(id)
      await fetchData()
    } catch (err: any) {
      setError('Error al eliminar el incidente')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerar = async () => {
    try {
      setLoading(true)
      await api.reportes.monitoreo.regenerar({
        dominio_id: selectedDomain.id,
        mes,
        anio,
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
      await api.reportes.monitoreo.enviar({
        dominio_id: selectedDomain.id,
        mes,
        anio,
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
            <h1 className="text-4xl font-bold text-atom-dark">Reportes - Monitoreo</h1>
            <p className="text-gray-600 mt-2">Dominio: {selectedDomain.nombre}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-atom-blue hover:underline text-sm font-medium"
          >
            Cambiar dominio
          </button>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mes</label>
            <select
              value={mes}
              onChange={(e) => setMes(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleString('es-ES', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Año</label>
            <select
              value={anio}
              onChange={(e) => setAnio(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
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

      {!loading && (
        <>
          {user?.rol === 'admin' && reporte && (
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-atom-dark">Incidentes</h2>
              <button
                onClick={() => {
                  setShowModalIncidente(true)
                  setEditingId(null)
                  setFormIncidente({
                    fecha_incidente: new Date().toISOString().split('T')[0],
                    titulo: '',
                    descripcion: '',
                  })
                }}
                className="px-4 py-2 bg-atom-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                + Agregar Incidente
              </button>
            </div>

            {incidentes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay incidentes registrados para este período</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidentes.map((incidente) => (
                      <tr key={incidente.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{new Date(incidente.fecha_incidente).toLocaleDateString('es-ES')}</td>
                        <td className="py-3 px-4 font-semibold text-gray-800">{incidente.titulo}</td>
                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{incidente.descripcion}</td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(incidente.id)
                              setFormIncidente({
                                fecha_incidente: incidente.fecha_incidente,
                                titulo: incidente.titulo,
                                descripcion: incidente.descripcion,
                              })
                              setShowModalIncidente(true)
                            }}
                            className="text-atom-blue hover:underline text-xs font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteIncidente(incidente.id)}
                            className="text-red-600 hover:underline text-xs font-medium"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {showModalIncidente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-atom-dark mb-4">
              {editingId ? 'Editar Incidente' : 'Nuevo Incidente'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={formIncidente.fecha_incidente}
                  onChange={(e) => setFormIncidente({ ...formIncidente, fecha_incidente: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formIncidente.titulo}
                  onChange={(e) => setFormIncidente({ ...formIncidente, titulo: e.target.value })}
                  placeholder="Ej: Servidor caído"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formIncidente.descripcion}
                  onChange={(e) => setFormIncidente({ ...formIncidente, descripcion: e.target.value })}
                  placeholder="Describe el incidente con detalle..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModalIncidente(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddIncidente}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-atom-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
