import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useDomainStore } from '@/store/domainStore'
import { api } from '@/api/client'

interface Domain {
  id: number
  nombre: string
  url: string
  logo_url?: string
  activo: boolean
}

export function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setSelectedDomain } = useDomainStore()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true)
        const response = await api.dominios.getList()

        let filteredDomains = response.data.dominios || response.data || []

        if (user?.rol === 'atom') {
          filteredDomains = filteredDomains.filter((d: any) => d.activo === true)
        }

        setDomains(filteredDomains)
      } catch (err: any) {
        console.error('Error cargando dominios:', err)
        setError(err.response?.data?.message || 'Error al cargar dominios')
      } finally {
        setLoading(false)
      }
    }

    fetchDomains()
  }, [user?.rol])

  const handleSelectDomain = (domain: Domain) => {
    setSelectedDomain({
      id: domain.id,
      nombre: domain.nombre,
      url: domain.url,
      logo_url: domain.logo_url,
    })
    navigate('/reportes/monitoreo')
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-atom-dark mb-2">Dashboard</h1>
        <p className="text-gray-600">Selecciona un dominio para gestionar sus reportes</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atom-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando dominios...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
          <p className="text-red-700 font-semibold">Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && domains.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <p className="text-yellow-700 font-semibold">Sin dominios disponibles</p>
          <p className="text-yellow-600 text-sm mt-1">
            {user?.rol === 'atom' ? 'No hay dominios activos para tu rol.' : 'No hay dominios configurados.'}
          </p>
        </div>
      )}

      {!loading && !error && domains.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => handleSelectDomain(domain)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-left group border border-gray-100 hover:border-atom-blue"
            >
              <div className="flex items-start justify-between mb-4">
                {domain.logo_url && (
                  <img
                    src={domain.logo_url}
                    alt={domain.nombre}
                    className="h-12 object-contain group-hover:scale-105 transition-transform"
                  />
                )}
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${domain.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {domain.activo ? 'Activo' : 'Inactivo'}
                </div>
              </div>
              <h3 className="text-lg font-bold text-atom-dark mb-2 group-hover:text-atom-blue transition-colors">
                {domain.nombre}
              </h3>
              <p className="text-gray-600 text-sm break-all hover:text-atom-blue transition-colors">
                {domain.url}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
