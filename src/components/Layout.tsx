import { ReactNode, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, branding, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.rol === 'admin'

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '⊞'
    },
    {
      label: 'Reportes',
      path: '/reportes/monitoreo',
      icon: '📊'
    },
    ...(isAdmin ? [{
      label: 'Configuración',
      path: '/configuracion/global/dominios',
      icon: '⚙️'
    }] : []),
    ...(isAdmin ? [{
      label: 'Historial',
      path: '/historial/logs',
      icon: '📋'
    }] : []),
  ]

  const isActive = (path: string) =>
    location.pathname.startsWith('/' + path.split('/')[1])

  // Iniciales del usuario para el avatar
  const initials = user?.nombre
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <aside
        className="w-60 flex flex-col shadow-xl"
        style={{ backgroundColor: branding.color_primario }}
      >

        {/* Logo / Header */}
        <div className="px-5 py-5 border-b border-white/10">
          {branding.logo_url ? (
            <img
              src={branding.logo_url}
              alt={branding.nombre_comercial}
              className="h-8 object-contain"
            />
          ) : (
            <span
              className="text-lg font-bold"
              style={{ color: branding.color_terciario }}
            >
              {branding.nombre_comercial}
            </span>
          )}
          <p className="text-xs mt-1 opacity-50" style={{ color: branding.color_terciario }}>
            Panel de Control
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-3"
              style={
                isActive(item.path)
                  ? {
                      backgroundColor: branding.color_secundario,
                      color: branding.color_terciario,
                    }
                  : {
                      color: branding.color_terciario,
                      opacity: 0.7,
                    }
              }
              onMouseEnter={e => {
                if (!isActive(item.path)) {
                  (e.currentTarget as HTMLElement).style.opacity = '1'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive(item.path)) {
                  (e.currentTarget as HTMLElement).style.opacity = '0.7'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                }
              }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-white/10"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor: branding.color_secundario,
                color: branding.color_terciario,
              }}
            >
              {initials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: branding.color_terciario }}
              >
                {user?.nombre}
              </p>
              <p
                className="text-xs capitalize opacity-60"
                style={{ color: branding.color_terciario }}
              >
                {user?.rol}
              </p>
            </div>
            <span
              className="text-xs opacity-50"
              style={{ color: branding.color_terciario }}
            >
              {showUserMenu ? '▲' : '▼'}
            </span>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="mt-2 rounded-lg overflow-hidden bg-white/10">
              <div className="px-4 py-2 border-b border-white/10">
                <p
                  className="text-xs truncate opacity-60"
                  style={{ color: branding.color_terciario }}
                >
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs font-medium transition-all hover:bg-red-500/20"
                style={{ color: '#ff6b6b' }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}