import React, { useState, useMemo } from 'react';

// Definición de tipos para las columnas
export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// Props del componente DataTable
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T, updatedData: Partial<T>) => void;
  onDelete?: (item: T) => void;
  selectable?: boolean;
  className?: string;
}

// Estado para edición usando Partial<T>
interface EditingState<T> {
  editingId: string | null;
  editingData: Partial<T>;
}

// Componente DataTable genérico
function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  selectable = false,
  className = '',
}: DataTableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingState, setEditingState] = useState<EditingState<T>>({
    editingId: null,
    editingData: {},
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Manejar selección de filas
  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Manejar selección de todas las filas
  const handleSelectAll = () => {
    if (selectedItems.size === data.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.map(item => item.id)));
    }
  };

  // Comenzar edición
  const handleEdit = (item: T) => {
    setEditingState({
      editingId: item.id,
      editingData: { ...item },
    });
  };

  // Guardar edición
  const handleSaveEdit = () => {
    if (editingState.editingId && onEdit) {
      const item = data.find(d => d.id === editingState.editingId);
      if (item) {
        onEdit(item, editingState.editingData);
        setEditingState({ editingId: null, editingData: {} });
      }
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingState({ editingId: null, editingData: {} });
  };

  // Actualizar datos de edición
  const handleEditChange = (key: keyof T, value: any) => {
    setEditingState(prev => ({
      ...prev,
      editingData: {
        ...prev.editingData,
        [key]: value,
      },
    }));
  };

  // Ordenar datos
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Datos ordenados - usando useMemo en lugar de React.useMemo
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      // Comparación segura para strings y numbers
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      // Para otros tipos, convertir a string y comparar
      const aString = String(aValue);
      const bString = String(bValue);
      const comparison = aString.localeCompare(bString);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  return (
    <div className={`data-table ${className}`}>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {selectable && (
              <th className="border border-gray-300 p-2">
                <input
                  type="checkbox"
                  checked={selectedItems.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`border border-gray-300 p-2 text-left font-semibold ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-200' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.header}
                {sortConfig?.key === column.key && (
                  <span className="ml-1">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="border border-gray-300 p-2 text-center">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-50 ${
                selectedItems.has(item.id) ? 'bg-blue-50' : ''
              }`}
            >
              {selectable && (
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelect(item.id)}
                    className="rounded"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={String(column.key)} className="border border-gray-300 p-2">
                  {editingState.editingId === item.id ? (
                    <input
                      type="text"
                      value={String(editingState.editingData[column.key] || '')}
                      onChange={(e) => handleEditChange(column.key, e.target.value)}
                      className="w-full px-1 py-0.5 border rounded"
                    />
                  ) : (
                    column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      String(item[column.key] || '')
                    )
                  )}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="border border-gray-300 p-2 text-center">
                  {editingState.editingId === item.id ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleSaveEdit}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      {onEdit && (
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No hay datos disponibles
        </div>
      )}
    </div>
  );
}

export default DataTable;
