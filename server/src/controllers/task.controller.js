const taskService = require('../services/task.service');

// Variable global para almacenar tareas cuando se envía un array
let tasks = [];

const getAllTasks = (req, res, next) => {
  try {
    // Siempre usar las tareas del servicio (que ahora están en archivo)
    const allTasks = taskService.obtenerTodas();
    res.json(allTasks);
  } catch (error) {
    next(error); // Cualquier error inesperado va al manejador global (500)
  }
};

const createTask = (req, res, next) => {
  // Si viene un array, sincronizar todas las tareas (usado para eliminaciones)
  if (Array.isArray(req.body)) {
    try {
      // Sincronizar el array completo con el servidor
      taskService.syncTasks(req.body);
      
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
    const task = taskService.crearTarea({ 
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

const deleteTask = (req, res, next) => {
  const { id } = req.params;
  
  try {
    // Intentamos eliminar usando el servicio (que ahora persiste en archivo)
    taskService.eliminarTarea(id);

    // Si no hay error, la eliminación fue exitosa
    res.status(204).send(); 
  } catch (error) {
    // Si el service lanza un error con mensaje 'NOT_FOUND', next(error) lo llevará al 404
    // Si es cualquier otro error, irá al 500.
    if (error.message === 'NOT_FOUND') {
      return next(new Error('NOT_FOUND'));
    }
    next(error);
  }
};

module.exports = { getAllTasks, createTask, deleteTask };