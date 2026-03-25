const taskService = require('../services/task.service.kv.js');

// Variable global para almacenar tareas cuando se envía un array
let tasks = [];

const getAllTasks = async (req, res, next) => {
  try {
    // Usar KV para persistencia real
    const allTasks = await taskService.obtenerTodas();
    res.json(allTasks);
  } catch (error) {
    next(error); // Cualquier error inesperado va al manejador global (500)
  }
};

const createTask = async (req, res, next) => {
  // Si viene un array, sincronizar todas las tareas (usado para eliminaciones)
  if (Array.isArray(req.body)) {
    try {
      // Sincronizar el array completo con KV
      await taskService.syncTasks(req.body);
      
      // También actualizar la variable en memoria para compatibilidad
      tasks = req.body;
      
      res.json(req.body);
      return;
    } catch (error) {
      return next(error);
    }
  }

  // Si viene una sola tarea (comportamiento original)
  const { text, category, priority } = req.body;

  // Verificar que hay texto para la tarea
  if (!text || text.trim() === '') {
    return next(new Error('El texto de la tarea es obligatorio'));
  }

  try {
    const task = await taskService.crearTarea({ 
      text: text.trim(), 
      category: category || 'General', 
      priority: priority || 'Media',
      completed: false,
      createdAt: Date.now()
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    // Eliminar usando KV
    await taskService.eliminarTarea(id);
    res.status(204).send(); 
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return next(new Error('NOT_FOUND'));
    }
    next(error);
  }
};

module.exports = { getAllTasks, createTask, deleteTask };