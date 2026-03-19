 Esta colección contiene las pruebas de integración para la Fase C de la API de Tareas. Se enfoca en la robustez del servidor, validando el manejo global de errores (404 para recursos no encontrados y 500 para errores internos/validación).


 ## Fase C: Robustez y Manejo de Errores

En esta fase, se ha implementado un **middleware global de errores** en `index.js` para centralizar las excepciones y mejorar la seguridad de la API, ocultando detalles técnicos al cliente.

### 1. Mapeo Semántico de Errores
Se han configurado respuestas personalizadas según el tipo de error capturado:
*   **Error 404 (NOT_FOUND):** Se dispara cuando se intenta acceder o borrar un recurso que no existe.
*   **Error 500 (INTERNAL_SERVER_ERROR):** Se utiliza para fallos de validación o errores no controlados.

---

### 2. Pruebas de Integración (Postman)

#### **A. Prueba de Error 404: Recurso no encontrado**
Se realiza una petición `DELETE` a una ID inexistente (`999999`) para verificar que el servidor identifica la falta del recurso y responde con el código de estado correcto.

**Petición:** `DELETE http://localhost:3000/api/v1/tasks/999999`

![Captura Error 404](./docs/ai/images/Error%20404.png)

C:\Users\cevim\Downloads\error-404.json

> **Resultado:** El servidor devuelve un `404 Not Found` con un JSON explicativo.

#### **B. Prueba de Error 500: Error de Validación**
Se realiza una petición `POST` enviando un cuerpo (body) sin el campo obligatorio `title`. El controlador detecta la ausencia y lanza un error que es capturado por el middleware global.

**Petición:** `POST http://localhost:3000/api/v1/tasks`

![Captura Error 500](./docs/ai/images/Error%20500.png)

C:\Users\cevim\Downloads\error-500.json

> **Resultado:** El servidor responde con un `500 Internal Server Error`, protegiendo la integridad de la base de datos y la información del sistema.
