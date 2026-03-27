import { useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/api/client'

export function Login() {
  const navigate = useNavigate()
  const { setUser, setLoading, setError, error, user } = useAuthStore()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleGoogleSuccess = async (credentialResponse: any) => {
  try {
    setLoading(true)
    setError(null)

    // Decodificar JWT de Google para obtener email y nombre
    const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
    const email: string = payload.email
    const nombre: string = payload.name

    // Validar dominio antes de llamar al backend
    if (!email.endsWith('@atomsoluciones.com')) {
      setError('Solo se permiten cuentas @atomsoluciones.com')
      return
    }

    // Llamar al workflow — obtiene rol y branding
    const response = await fetch('https://n8n.atomware.tech/webhook/ui/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nombre }),
    })

    if (!response.ok) {
      const err = await response.json()
      setError(err.message || 'Acceso denegado')
      return
    }

    const data = await response.json()
    console.log('Respuesta n8n auth:', data)

    setUser(
      {
        id:         data.id,
        nombre:     data.nombre,
        email:      data.email,
        rol:        data.rol,
        dominio_id: data.dominio_id,
      },
      credentialResponse.credential,
      data.branding   // ← aquí se guarda el branding en el store
    )

    navigate('/dashboard', { replace: true })

  } catch (err) {
    setError('Error al iniciar sesión. Intente de nuevo.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-atom-dark via-gray-900 to-atom-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-atom-dark mb-2">Atom Intelligence</h1>
            <p className="text-gray-600">Panel de Control de Monitoreo</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-atom-blue p-4 rounded mb-6">
            <p className="text-sm text-gray-700">
              Inicia sesión con tu cuenta <span className="font-semibold">@atomsoluciones.com</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Error al iniciar sesión con Google')}
            />
          </div>

          <div className="border-t pt-6">
            <p className="text-xs text-gray-500 text-center">
              Solo personal de Atom Soluciones puede acceder a este panel
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
