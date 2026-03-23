#  Documentación completa del proyecto

##  Introducción

En este proyecto he desarrollado una aplicación fullstack basada en una arquitectura cliente-servidor, donde el backend está construido con Node.js y Express, y el frontend consume los datos mediante peticiones HTTP asíncronas. Mi objetivo principal ha sido implementar una API REST robusta, segura y bien estructurada, junto con un cliente capaz de interactuar correctamente con ella manejando estados reales de red.

Este documento funciona como una guía completa para cualquier revisor técnico que quiera entender qué he hecho, cómo lo he hecho y cómo utilizar el proyecto.

---

##  Tecnologías, librerías y herramientas utilizadas

A lo largo del desarrollo he utilizado las siguientes tecnologías:

### Backend

* **Node.js**: entorno de ejecución para JavaScript en el servidor.
* **Express**: framework para crear la API REST.
* **Middleware personalizado**: para manejo global de errores.
* **Sentry**: para monitorización y registro de errores en producción.

### Frontend

* **JavaScript (vanilla)** o framework (según el caso del proyecto base).
* **Axios**: para realizar peticiones HTTP de forma más controlada que con fetch.

### Testing y herramientas

* **Postman**: para pruebas de endpoints y validación de comportamiento.
* **Swagger**: para documentación interactiva de la API.
* **VS Code**: entorno de desarrollo principal.

---

##  Arquitectura del proyecto

He estructurado el proyecto separando claramente responsabilidades:

```
/backend
  /controllers
  /routes
  /middlewares
  /models
  index.js

/frontend
  /services (api/client.js)
  /components
  index.html / main.js

/docs
  backend-api.md
```

### Decisiones clave:

* Separé rutas, controladores y middlewares para mantener el código escalable.
* Centralicé la comunicación HTTP del frontend en un único archivo (`api/client.js`).
* Eliminé cualquier persistencia local (como LocalStorage) para simular condiciones reales de red.

---

##  Manejo global de errores

Uno de los puntos clave del proyecto ha sido la implementación de un middleware global de errores en Express.

### Implementación

He añadido un middleware al final del archivo principal (`index.js`) con la siguiente firma:

```js
(err, req, res, next)
```

### Comportamiento

* Si el error contiene información de cliente (por ejemplo: `"NOT_FOUND"`), devuelvo:

  * `HTTP 404`
* Para cualquier otro error no controlado:

  * Registro el error en consola (`console.error`)
  * Devuelvo `HTTP 500` con mensaje genérico: `"Error interno del servidor"`

Esto evita exponer detalles sensibles al cliente y mejora la seguridad.

---

##  API REST implementada

He construido endpoints básicos para gestionar recursos (por ejemplo, tareas).

### Endpoints principales

#### GET /api/v1/tasks

* Obtiene todas las tareas.
* Probado en Postman con respuesta correcta (200 OK).

#### GET /api/v1/tasks/:id

* Obtiene una tarea específica.
* Si no existe → devuelve 404.

#### POST /api/v1/tasks

* Crea una nueva tarea.
* Validación: si no se envía título → error controlado.

#### DELETE /api/v1/tasks/:id

* Elimina una tarea.
* Si no existe → error 404.

---

##  Pruebas realizadas con Postman

He utilizado Postman de forma sistemática para validar el comportamiento de la API.

### Casos de prueba realizados

#### ✔️ GET correcto

* Endpoint: `/tasks`
* Resultado esperado: lista de tareas
* Estado: `200 OK`

#### ✔️ GET con ID inexistente

* Resultado: error controlado
* Estado: `404 NOT FOUND`

#### ✔️ POST correcto

* Body:

```json
{
  "title": "Nueva tarea"
}
```

* Resultado: tarea creada
* Estado: `201 CREATED`

#### ❌ POST sin título

* Body vacío o incorrecto
* Resultado: error validado
* Estado: `400 BAD REQUEST` o `500` según implementación

#### ❌ DELETE de recurso inexistente

* Resultado: error controlado
* Estado: `404`

### Conclusión de testing

No me limité a comprobar que “funciona”, sino que forcé errores intencionados para validar la robustez del sistema.

---

##  Comunicación frontend-backend

He implementado una capa de red en el cliente.

### Archivo clave

```
/frontend/services/api/client.js
```

### Uso de Axios

He utilizado Axios para simplificar las peticiones HTTP:

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1"
});

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};
```

### Ventajas de usar Axios

* Manejo automático de JSON
* Interceptores
* Mejor control de errores

---

##  Gestión de estados en la UI

He adaptado la interfaz para reflejar condiciones reales:

### Estados implementados

1. **Carga**

   * Indicadores visuales mientras se espera respuesta.

2. **Éxito**

   * Renderizado de datos correctamente.

3. **Error**

   * Mensajes claros cuando el servidor responde con error.

Esto simula latencia real y mejora la experiencia de usuario.

---

##  Monitorización con Sentry

He integrado Sentry para capturar errores en tiempo real.

### Beneficios

* Registro automático de excepciones
* Información contextual del error
* Mejora en debugging en producción

---

##  Documentación con Swagger

He documentado la API utilizando Swagger.

### Incluye:

* Endpoints disponibles
* Métodos HTTP
* Parámetros
* Ejemplos de respuesta

Esto permite a cualquier desarrollador probar la API sin necesidad de conocer el código.

---

##  Documentación adicional

He añadido un archivo en:

```
/docs/backend-api.md
```

Donde explico:

* Qué es Axios
* Qué es Postman
* Qué es Sentry
* Qué es Swagger
* Por qué se utilizan

---

##  ¿Cómo ejecutar el proyecto?

### Backend

```bash
cd backend
npm install
npm run dev
```

Servidor disponible en:

```
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  Conclusión personal

Este proyecto me ha permitido entender que desarrollar una API no consiste solo en que “funcione”, sino en que sea robusta, segura y predecible ante errores. He aprendido a manejar estados reales de red, a estructurar correctamente un backend y a documentar de forma profesional para terceros.

También he comprobado que herramientas como Postman, Axios, Sentry y Swagger no son opcionales en un entorno profesional, sino esenciales para garantizar calidad y mantenibilidad.

Si alguien revisa este proyecto, mi intención es que pueda entender rápidamente qué hace cada parte y cómo interactuar con ella sin necesidad de hacer ingeniería inversa.

Y sí, todo esto para que una API no explote cuando alguien olvida poner un título. La vida del backend, básicamente.
