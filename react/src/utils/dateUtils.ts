// Tipos estrictos para fechas
export type DateInput = string | Date;

/**
 * Calcula la diferencia en días entre dos fechas
 * @param startDate - Fecha de inicio (string ISO o Date)
 * @param endDate - Fecha de fin (string ISO o Date)
 * @returns número de días de diferencia (positivo si endDate > startDate)
 * @throws Error si las fechas no son válidas
 */
export function calculateDaysDifference(
  startDate: DateInput,
  endDate: DateInput
): number {
  try {
    // Convertir a objetos Date si son strings
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    // Validar que las fechas sean válidas
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Una o ambas fechas no son válidas');
    }

    // Calcular diferencia en días (implementación manual)
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffTime = end.getTime() - start.getTime();
    return Math.floor(diffTime / msPerDay);
  } catch (error) {
    throw new Error(`Error al calcular diferencia de fechas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Formatea una fecha en un formato específico
 * @param date - Fecha a formatear (string ISO o Date)
 * @param formatString - Formato de salida (por defecto 'dd/MM/yyyy')
 * @returns string con la fecha formateada
 */
export function formatDate(
  date: DateInput,
  formatString: string = 'dd/MM/yyyy'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      throw new Error('La fecha proporcionada no es válida');
    }

    // Implementación simple de formateo
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    switch (formatString) {
      case 'dd/MM/yyyy':
        return `${day}/${month}/${year}`;
      case 'MM/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'yyyy-MM-dd':
        return `${year}-${month}-${day}`;
      default:
        // Formato personalizado simple
        return formatString
          .replace('dd', day)
          .replace('MM', month)
          .replace('yyyy', year.toString());
    }
  } catch (error) {
    throw new Error(`Error al formatear fecha: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Verifica si una fecha es válida
 * @param date - Fecha a validar (string ISO o Date)
 * @returns true si la fecha es válida, false en caso contrario
 */
export function isValidDate(date: DateInput): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
}

// Tipos para rango de fechas
export interface DateRange {
  start: DateInput;
  end: DateInput;
}

/**
 * Calcula la duración de un rango de fechas
 * @param range - Objeto con fechas de inicio y fin
 * @returns objeto con información del rango
 */
export function calculateDateRange(range: DateRange): {
  days: number;
  isValid: boolean;
  errorMessage?: string;
} {
  try {
    if (!isValidDate(range.start) || !isValidDate(range.end)) {
      return {
        days: 0,
        isValid: false,
        errorMessage: 'Una o ambas fechas del rango no son válidas'
      };
    }

    const days = calculateDaysDifference(range.start, range.end);
    
    return {
      days: Math.abs(days),
      isValid: true
    };
  } catch (error) {
    return {
      days: 0,
      isValid: false,
      errorMessage: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Agrega días a una fecha
 * @param date - Fecha base (string ISO o Date)
 * @param days - Número de días a agregar (puede ser negativo)
 * @returns nueva Date con los días agregados
 */
export function addDays(date: DateInput, days: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Verifica si una fecha está entre otras dos fechas (inclusive)
 * @param date - Fecha a verificar
 * @param startDate - Fecha de inicio del rango
 * @param endDate - Fecha de fin del rango
 * @returns true si la fecha está en el rango
 */
export function isDateInRange(
  date: DateInput,
  startDate: DateInput,
  endDate: DateInput
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (!isValidDate(dateObj) || !isValidDate(startObj) || !isValidDate(endObj)) {
    return false;
  }

  return dateObj >= startObj && dateObj <= endObj;
}
