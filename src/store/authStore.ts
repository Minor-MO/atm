import { create } from 'zustand'

interface Branding {
  nombre_comercial: string
  logo_url: string
  color_primario: string
  color_secundario: string
  color_terciario: string
}

interface User {
  id: number | null
  nombre: string
  email: string
  rol: 'admin' | 'atom' | 'cliente'
  dominio_id: number | null
}

interface AuthStore {
  user: User | null
  token: string | null
  branding: Branding
  isLoading: boolean
  error: string | null
  setUser: (user: User | null, token: string | null, branding?: Branding) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

const defaultBranding: Branding = {
  nombre_comercial: 'Atom Intelligence',
  logo_url: '',
  color_primario: '#1a2233',
  color_secundario: '#378ADD',
  color_terciario: '#ffffff',
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  branding: localStorage.getItem('branding') ? JSON.parse(localStorage.getItem('branding')!) : defaultBranding,
  isLoading: false,
  error: null,

  setUser: (user, token, branding = defaultBranding) => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      localStorage.setItem('branding', JSON.stringify(branding))
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('branding')
    }
    set({ user, token, branding: branding ?? defaultBranding, error: null })
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('branding')
    localStorage.removeItem('selectedDomain')
    set({ user: null, token: null, branding: defaultBranding, error: null })
  },
}))