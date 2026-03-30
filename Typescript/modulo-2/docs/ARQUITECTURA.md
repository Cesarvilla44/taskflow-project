# Documentación de Arquitectura: Sistema de Gestión Universitaria

Este documento describe las decisiones de diseño, la estructura de datos y los patrones de implementación utilizados en el desarrollo del **Laboratorio Práctico 2**.

---

## 1. Modelado del Dominio (`src/domain/types/`)

El dominio se ha diseñado bajo el principio de **tipado fuerte**, asegurando que las entidades principales del sistema sean coherentes y protegidas contra mutaciones accidentales.

### 1.1 Entidades: Estudiante y Asignatura
Se han definido mediante `interfaces` para representar los objetos core del sistema. 
- **Uso de `readonly`:** Se ha aplicado el modificador `readonly` a las propiedades `id`. Esto garantiza la **integridad referencial**, impidiendo que el identificador único de una entidad sea modificado una vez creado el objeto, algo crítico en sistemas que sincronizan con bases de datos.

### 1.2 Unión Discriminada: `EstadoMatricula`
Para gestionar el ciclo de vida de la matrícula, se ha implementado una **Unión Discriminada Estricta**. Esta estructura se compone de tres estados mutuamente excluyentes:
- `MatriculaActiva`: Incluye una lista de asignaturas.
- `MatriculaSuspendida`: Requiere obligatoriamente un motivo de suspensión.
- `MatriculaFinalizada`: Registra la nota media final.

**Ventaja Técnica:** Al usar una propiedad común (`tipo`), TypeScript realiza un **Type Narrowing** (estrechamiento de tipo) automático. Esto permite que, dentro de un bloque condicional o `switch`, el compilador sepa exactamente qué propiedades están disponibles, eliminando errores de "propiedad no encontrada" en tiempo de ejecución.

---

## 2. Servicio de Datos Genérico (`src/services/api-client.ts`)

La capa de servicios abstrae la complejidad de las llamadas asíncronas y la comunicación con el "backend" (simulado).

### 2.1 Abstracción con Genéricos (`<T>`)
El método `obtenerRecurso<T>` es el corazón del cliente de API. El uso de **Genéricos** permite:
1. **Reutilización de Código:** No es necesario escribir un método para "obtenerEstudiante" y otro para "obtenerAsignatura". Un solo método gestiona cualquier entidad.
2. **Desacoplamiento:** El servicio no necesita conocer los detalles del modelo de datos; simplemente actúa como un túnel tipado que transporta la información.
3. **Contratos Estrictos:** Al invocar el método, el desarrollador define el tipo esperado, y la interfaz `RespuestaAPI<T>` asegura que la estructura de la respuesta sea predecible y contenga siempre los campos `data`, `status` y `message`.

---

## 3. Justificación de Decisiones Técnicas

### 3.1 Interface frente a Type
Se han seguido las mejores prácticas de la comunidad de TypeScript:
- **Interfaces:** Utilizadas para `Estudiante`, `Asignatura` y `RespuestaAPI`. Son la opción preferida para definir la estructura de objetos por su capacidad de extensión (herencia) y su mejor rendimiento en el chequeo de tipos del IDE.
- **Types:** Utilizado para la unión discriminada `EstadoMatricula`. Los `types` son obligatorios cuando se necesita definir uniones (`|`) o intersecciones, permitiendo modelar estados lógicos complejos que una interfaz no puede representar por sí sola.

### 3.2 Lógica de Red y Asincronía
La implementación mediante `Promise` y `setTimeout` simula el comportamiento real de una red (latencia y asincronía). Esto obliga a la aplicación a manejar los estados de espera y asegura que el sistema sea capaz de escalar a una API real mediante `fetch` o `axios` simplemente modificando la implementación interna del método genérico, sin romper el contrato con los componentes que lo consumen.

---

## 4. Implementación de Reportes
La función `generarReporte` demuestra el poder de la unión discriminada mediante un bloque `switch`. Al evaluar el `tipo`, se garantiza que el reporte generado sea específico y contenga la información relevante de cada estado (ej. mostrar el motivo solo si está suspendida), manteniendo el código limpio y libre de validaciones `if/else` redundantes.
