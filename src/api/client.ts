import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = 'https://n8n.atomware.tech/webhook/ui'

const createClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return client
}

export const apiClient = createClient()

export const api = {
  auth: {
    googleSignIn: (token: string) => apiClient.post('/auth/google', { token }),
    getMe: () => apiClient.get('/auth/me'),
  },
  dominios: {
    getList: () => apiClient.get('/dominios'),
    create: (data: any) => apiClient.post('/dominios', data),
    update: (id: number, data: any) => apiClient.put(`/dominios/${id}`, data),
  },
  reportes: {
    monitoreo: {
      get: (params: any) => apiClient.get('/monitoreo/reporte', { params }),
      regenerar: (data: any) => apiClient.post('/monitoreo/reporte/regenerar', data),
      enviar: (data: any) => apiClient.post('/monitoreo/reporte/enviar', data),
    },
    cwv: {
      get: (params: any) => apiClient.get('/cwv/reporte', { params }),
      regenerar: (data: any) => apiClient.post('/cwv/reporte/regenerar', data),
      enviar: (data: any) => apiClient.post('/cwv/reporte/enviar', data),
    },
    seo: {
      get: (params: any) => apiClient.get('/seo/reporte', { params }),
      regenerar: (data: any) => apiClient.post('/seo/reporte/regenerar', data),
      enviar: (data: any) => apiClient.post('/seo/reporte/enviar', data),
    },
  },
  incidentes: {
    getList: (params: any) => apiClient.get('/incidentes', { params }),
    create: (data: any) => apiClient.post('/incidentes', { accion: 'crear', ...data }),
    update: (id: number, data: any) => apiClient.post('/incidentes', { accion: 'editar', id, ...data }),
    delete: (id: number) => apiClient.post('/incidentes', { accion: 'eliminar', id }),
  },
  api: {
    historial: {
      logs: (params: any) => apiClient.get('/historial/logs', { params }),
      alertasSeo: (params: any) => apiClient.get('/historial/alertas-seo', { params }),
      alertasCwv: (params: any) => apiClient.get('/historial/alertas-cwv', { params }),
      auditoriasS: (params: any) => apiClient.get('/historial/auditorias-seo', { params }),
    },
  },
}
