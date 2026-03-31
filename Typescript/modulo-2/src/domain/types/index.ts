// 1. Definición de entidades con readonly para IDs
export interface Asignatura {
  readonly id: string;
  nombre: string;
  creditos: number;
}

export interface Estudiante {
  readonly id: string;
  nombre: string;
  email: string;
}

// 2. Interfaces para la Unión Discriminada
interface MatriculaActiva {
  tipo: "ACTIVA"; // Propiedad discriminadora
  asignaturas: Asignatura[];
}

interface MatriculaSuspendida {
  tipo: "SUSPENDIDA";
  motivo: string;
}

interface MatriculaFinalizada {
  tipo: "FINALIZADA";
  notaMedia: number;
}

// 3. Unión Discriminada estricta
export type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

// 4. Función con switch para generar reporte - Patrón de Análisis Exhaustivo
export function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case "ACTIVA":
      return `El estudiante tiene una matrícula ACTIVA con ${estado.asignaturas.length} asignaturas.`;
    case "SUSPENDIDA":
      return `La matrícula está SUSPENDIDA. Motivo: ${estado.motivo}.`;
    case "FINALIZADA":
      return `Matrícula FINALIZADA. La nota media final es: ${estado.notaMedia}.`;
    default:
      // Patrón de Análisis Exhaustivo con never
      // Si se añade un nuevo tipo a EstadoMatricula, TypeScript detectará el error aquí
      const _exhaustiveCheck: never = estado;
      return _exhaustiveCheck; // Esto nunca se ejecutará si todos los casos están cubiertos
  }
}
