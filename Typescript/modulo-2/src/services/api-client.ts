// Interfaz para la estructura de respuesta de la API
export interface RespuestaAPI<T> {
  data: T;
  status: number;
  message: string;
}

export class ApiClient {
  /**
   * Método genérico para simular llamadas a base de datos
   * @param endpoint Ruta simulada (ej: '/estudiantes')
   */
  async obtenerRecurso<T>(endpoint: string): Promise<RespuestaAPI<T>> {
    console.log(`Buscando datos en: ${endpoint}...`);

    return new Promise((resolve) => {
      // Simulamos un retraso de red de 1 segundo
      setTimeout(() => {
        const resultado: RespuestaAPI<T> = {
          data: {} as T, // En un caso real, aquí vendrían los datos reales del JSON
          status: 200,
          message: "Operación completada con éxito"
        };
        resolve(resultado);
      }, 1000);
    });
  }
}
