export interface User {
  id: number | null
  nombre: string
  email: string
  rol: 'admin' | 'atom' | 'cliente'
  dominio_id?: number | null
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export interface SelectedDomain {
  id: number
  nombre: string
  url: string
  logo_url?: string
}

export interface Incidente {
  id: number
  dominio_id: number
  fecha_incidente: string
  titulo: string
  descripcion: string
  registrado_por: string
  created_at: string
}

export interface ReporteMonitoreo {
  id: number
  dominio_id: number
  anio: number
  mes: number
  estado: 'pendiente' | 'en_revision' | 'enviado'
  generado_por?: string
  generado_en?: string
  enviado_a_ti_en?: string
  enviado_al_cliente_en?: string
}

export interface AppContextType {
  auth: AuthState
  selectedDomain: SelectedDomain | null
  setSelectedDomain: (domain: SelectedDomain | null) => void
}
