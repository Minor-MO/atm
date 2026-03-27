import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/api/client'
import { Table } from '@/components/Table'

interface Log {
  id: number
  fecha: string
  workflow: string
  dominio: string
  nivel: 'INFO' | 'WARN' | 'ERROR'
  mensaje: string
}

export function HistorialLogs() {
  const { user } = useAuthStore()
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState({
    dominio: '',
    workflow: '',
    nivel: '',
    fecha_desde: '',
    fecha_hasta: '',
  })

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await api.api.historial.logs(filtros)
      setLogs(response.data.logs || [])
    } catch (err: any) {
      console.error('Error cargando logs:', err)
      setError('Error al cargar los logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case 'INFO':
        return 'bg-blue-100 text-blue-700'
      case 'WARN':
        return 'bg-yellow-100 text-yellow-700'
      case 'ERROR':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-atom-dark mb-2">Historial - Logs del Sistema</h1>
        <p className="text-gray-600">Visualiza los logs de ejecución de workflows</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-bold text-atom-dark mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dominio</label>
            <input
              type="text"
              value={filtros.dominio}
              onChange={(e) => setFiltros({ ...filtros, dominio: e.target.value })}
              placeholder="Filtrar por dominio..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Workflow</label>
            <input
              type="text"
              value={filtros.workflow}
              onChange={(e) => setFiltros({ ...filtros, workflow: e.target.value })}
              placeholder="Filtrar por workflow..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nivel</label>
            <select
              value={filtros.nivel}
              onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent text-sm"
            >
              <option value="">Todos</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Desde</label>
            <input
              type="date"
              value={filtros.fecha_desde}
              onChange={(e) => setFiltros({ ...filtros, fecha_desde: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hasta</label>
            <input
              type="date"
              value={filtros.fecha_hasta}
              onChange={(e) => setFiltros({ ...filtros, fecha_hasta: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent text-sm"
            />
          </div>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-atom-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium text-sm"
        >
          Aplicar Filtros
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Table
          columns={[
            { key: 'fecha', label: 'Fecha' },
            { key: 'workflow', label: 'Workflow' },
            { key: 'dominio', label: 'Dominio' },
            {
              key: 'nivel',
              label: 'Nivel',
              render: (value) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(value)}`}>
                  {value}
                </span>
              ),
            },
            { key: 'mensaje', label: 'Mensaje' },
          ]}
          data={logs}
          loading={loading}
        />
      </div>
    </div>
  )
}
