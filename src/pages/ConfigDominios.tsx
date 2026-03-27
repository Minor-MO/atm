import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/api/client'
import { Table } from '@/components/Table'

interface Domain {
  id: number
  nombre: string
  url: string
  activo: boolean
}

export function ConfigDominios() {
  const { user } = useAuthStore()
  const [dominios, setDominios] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ nombre: '', url: '', activo: true })

  const fetchDominios = async () => {
    try {
      setLoading(true)
      const response = await api.dominios.getList()
      setDominios(response.data.dominios || response.data || [])
    } catch (err: any) {
      setError('Error al cargar dominios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDominios()
  }, [])

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.url.trim()) {
      setError('Todos los campos son requeridos')
      return
    }

    try {
      setLoading(true)
      if (editingId) {
        await api.dominios.update(editingId, form)
      } else {
        await api.dominios.create(form)
      }
      setShowModal(false)
      setEditingId(null)
      setForm({ nombre: '', url: '', activo: true })
      await fetchDominios()
    } catch (err: any) {
      setError('Error al guardar dominio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-atom-dark mb-2">Configuración - Dominios</h1>
        <p className="text-gray-600">Gestiona los dominios del sistema</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-atom-dark">Dominios</h2>
          <button
            onClick={() => {
              setEditingId(null)
              setForm({ nombre: '', url: '', activo: true })
              setShowModal(true)
            }}
            className="px-4 py-2 bg-atom-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Nuevo Dominio
          </button>
        </div>

        <Table
          columns={[
            { key: 'nombre', label: 'Nombre' },
            { key: 'url', label: 'URL' },
            {
              key: 'activo',
              label: 'Estado',
              render: (value) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {value ? 'Activo' : 'Inactivo'}
                </span>
              ),
            },
          ]}
          data={dominios}
          loading={loading}
          actions={(row) => (
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setEditingId(row.id)
                  setForm({ nombre: row.nombre, url: row.url, activo: row.activo })
                  setShowModal(true)
                }}
                className="text-atom-blue hover:underline text-xs font-medium"
              >
                Editar
              </button>
            </div>
          )}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-atom-dark mb-4">
              {editingId ? 'Editar Dominio' : 'Nuevo Dominio'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Mi Sitio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://ejemplo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-atom-blue focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="activo" className="text-sm font-semibold text-gray-700">
                  Activo
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
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
