import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-atom-dark mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-atom-blue text-white rounded hover:bg-blue-700 transition-colors"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  )
}
