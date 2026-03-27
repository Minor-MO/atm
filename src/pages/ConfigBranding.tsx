import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDomainStore } from '@/store/domainStore'

export function ConfigBranding() {
  const navigate = useNavigate()
  const { selectedDomain } = useDomainStore()

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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-atom-dark mb-2">Configuración - Branding</h1>
        <p className="text-gray-600">Dominio: {selectedDomain.nombre}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500">Contenido próximamente...</p>
      </div>
    </div>
  )
} 
