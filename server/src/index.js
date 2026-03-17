// Agregamos '../' para salir de src y buscar la carpeta config en la raíz
const { PORT } = require('../config/env');
const express = require('express');

// Como ya estamos dentro de src, entramos directo a ./routes
const taskRoutes = require('./routes/task.routes');

const app = express();

// Middleware para procesar JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola! El servidor está funcionando perfectamente 🚀');
});

// Rutas de la API
app.use('/api/v1/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`API de tareas lista en: http://localhost:${PORT}/api/v1/tasks`);
});
