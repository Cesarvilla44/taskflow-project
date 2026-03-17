const express = require('express');
const app = express();
const taskRoutes = require('./routes/task.routes');

const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor está funcionando perfectamente 🚀');
});

// Montaje de la API de tareas
app.use('/api/v1/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`\n✅ SERVIDOR ACTIVO`);
    console.log(`🔗 URL: http://localhost:${PORT}/api/v1/tasks`);
});
