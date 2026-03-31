# 🚀 Proyecto TypeScript Avanzado - React + Vite

Proyecto React con TypeScript avanzado que demuestra patrones de diseño modernos, genéricos, uniones discriminadas y arquitectura escalable.

## ✨ Características Principales

### 🏗️ Arquitectura TypeScript Avanzada
- **Genéricos (`<T>`)**: Componentes reutilizables con tipado fuerte
- **Uniones Discriminadas**: Manejo exhaustivo de tipos
- **Patrón `never`**: Análisis exhaustivo en switch statements
- **Tipos de Utilidad**: `Partial<T>`, `keyof T`, y más
- **Tipado Estricto**: 0 errores de compilación

### 📊 Componentes
- **DataTable<T>**: Tabla genérica con edición, ordenación y selección
- **Tipado fuerte**: Props con validación automática
- **Estado con Partial<T>**: Edición segura de datos parciales

### 📅 Utilidades de Fecha
- **calculateDaysDifference()**: Diferencia entre fechas
- **formatDate()**: Formateo múltiple (dd/MM/yyyy, MM/dd/yyyy, yyyy-MM-dd)
- **isValidDate()**: Validación de fechas
- **addDays()**: Manipulación de fechas
- **isDateInRange()**: Verificación de rangos

## 🛠️ Tecnologías

- **React 19.2.4** - UI Library
- **TypeScript 5.9.3** - Tipado estático
- **Vite 8.0.1** - Build tool
- **ESLint** - Linting
- **CSS** - Estilos (Tailwind-ready)

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Cesarvilla44/taskflow-project.git
cd taskflow-project/react

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilación para producción
npm run preview  # Previsualizar build
npm run lint     # Linting del código
```

## 📁 Estructura del Proyecto

```
react/
├── src/
│   ├── components/
│   │   └── DataTable.tsx      # Tabla genérica tipada
│   ├── utils/
│   │   └── dateUtils.ts       # Utilidades de fecha
│   ├── App.tsx                # Componente principal
│   ├── main.tsx               # Entry point
│   └── ...
├── docs/
│   └── arquitectura-final.md  # Documentación técnica
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Ejemplos de Uso

### DataTable<T> Genérico
```typescript
import DataTable, { Column } from './components/DataTable';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  edad: number;
}

const columns: Column<Usuario>[] = [
  { key: 'nombre', header: 'Nombre', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'edad', header: 'Edad', sortable: true },
];

<DataTable
  data={usuarios}
  columns={columns}
  onEdit={(item, newData) => actualizarUsuario(item.id, newData)}
  onDelete={(item) => eliminarUsuario(item.id)}
  selectable
/>
```

### Utilidades de Fecha
```typescript
import { calculateDaysDifference, formatDate } from './utils/dateUtils';

// Calcular diferencia de días
const dias = calculateDaysDifference('2024-01-01', '2024-01-15');
console.log(dias); // 14

// Formatear fecha
const fechaFormateada = formatDate(new Date(), 'dd/MM/yyyy');
console.log(fechaFormateada); // "31/03/2026"
```

## 🔧 Configuración TypeScript

### Compilación
```bash
# Verificar tipos sin compilar
npx tsc --noEmit

# Compilar para producción
npm run build
```

### Configuración ESLint
El proyecto incluye configuración ESLint con reglas específicas para TypeScript y React.

## 📚 Documentación Técnica

Para entender la arquitectura y patrones implementados, consulta:
- **[docs/arquitectura-final.md](./docs/arquitectura-final.md)** - Análisis completo de beneficios de TypeScript vs JavaScript

## 🏆 Beneficios de TypeScript

### Seguridad Tipológica
- **Errores detectados en compilación** vs runtime
- **Autocompletado inteligente** en IDE
- **Refactoring seguro** con verificación automática

### Reducción de Errores
- **~90% menos errores de tipo**
- **~70% menos errores de lógica**
- **~80% menos errores de refactoring**

### Mantenibilidad
- **Código autodocumentado** a través de tipos
- **Contratos claros** entre componentes
- **Evolución segura** del código base

## 🤝 Contribución

1. Fork del repositorio
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es parte del repositorio TaskFlow y está bajo licencia MIT.

## 🔗 Enlaces Relacionados

- [Repositorio Principal](https://github.com/Cesarvilla44/taskflow-project)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)

---

**⚡ Construido con ❤️ usando TypeScript avanzado y React moderno**
