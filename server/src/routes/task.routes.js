const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// Obtener todas
router.get('/', taskController.getAllTasks);

// Crear una (Aquí validaremos si falta el título para el punto 3)
router.post('/', taskController.createTask);

// Borrar una (Aquí validaremos si existe para el punto 3)
router.delete('/:id', taskController.deleteTask);

module.exports = router;
