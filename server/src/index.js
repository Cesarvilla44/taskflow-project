const express = require('express');
const app = express();
const taskRoutes = require('./routes/task.routes');

const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// --- RUTAS ---

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor está funcionando perfectamente 🚀');
});

// Montaje de la API de tareas (todas tus rutas de tareas)
app.use('/api/v1/tasks', taskRoutes);


// --- MANEJO DE ERRORES (Fase C: Robustez) ---

// 1 y 2. Middleware global de manejo de errores (siempre al final de las rutas)
app.use((err, req, res, next) => {
    
    // Mapeo semántico: Si el error es 'NOT_FOUND', devolvemos un 404
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({
            error: "Recurso no encontrado",
            message: "La tarea que buscas no existe en nuestra base de datos."
        });
    }

    // Para cualquier otro fallo no controlado (Error 500)
    // Registramos la traza (el error detallado) solo en consola para el desarrollador
    console.error("[ERROR INTERNO]:", err.stack); 
    
    // Al cliente le enviamos un mensaje genérico por seguridad
    res.status(500).json({
        message: "Error interno del servidor",
        description: "Lo sentimos, algo salió mal de nuestro lado."
    });
});

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`\n✅ SERVIDOR ACTIVO`);
    console.log(`🔗 URL BASE: http://localhost:${PORT}/api/v1/tasks`);
});
