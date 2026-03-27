import { ReactNode } from 'react'

interface Column {
  key: string
  label: string
  render?: (value: any) => ReactNode
}

interface TableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  actions?: (row: any) => ReactNode
}

export function Table({ columns, data, loading, actions }: TableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atom-blue"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 font-semibold text-gray-700">
                {col.label}
              </th>
            ))}
            {actions && <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-gray-800">
                  {col.render ? col.render(row[col.key]) : row[col.key]}
                </td>
              ))}
              {actions && <td className="py-3 px-4 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
