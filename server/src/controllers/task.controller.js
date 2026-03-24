const taskService = require('../services/task.service');

// Variable global para almacenar tareas cuando se envía un array
let tasks = [];

const getAllTasks = (req, res, next) => {
  try {
    const serviceTasks = taskService.obtenerTodas();
    // Si tenemos tareas en memoria (guardadas por POST array), las usamos
    // Si no, usamos las del servicio
    const allTasks = tasks.length > 0 ? tasks : serviceTasks;
    res.json(allTasks);
  } catch (error) {
    next(error); // Cualquier error inesperado va al manejador global (500)
  }
};

const createTask = (req, res, next) => {
  // Si viene un array, guardamos todas las tareas
  if (Array.isArray(req.body)) {
    try {
      // Guardar cada tarea individualmente para persistencia
      const savedTasks = [];
      req.body.forEach(taskData => {
        const task = taskService.crearTarea({
          ...taskData,
          createdAt: taskData.createdAt || Date.now()
        });
        savedTasks.push(task);
      });
      
      // También actualizar la variable en memoria para compatibilidad
      tasks = savedTasks;
      
      res.json(savedTasks);
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
    // Intentamos eliminar
    const tareaEliminada = taskService.eliminarTarea(id);

    // Si el servicio no encontró la tarea (suponiendo que devuelve null o false)
    if (!tareaEliminada) {
       // PUNTO 2: Mapeo semántico. Enviamos 'NOT_FOUND' 
       // para que el index.js devuelva un HTTP 404.
       return next(new Error('NOT_FOUND'));
    }

    res.status(204).send(); 
  } catch (error) {
    // Si el service ya lanza un error con mensaje 'NOT_FOUND', next(error) lo llevará al 404
    // Si es cualquier otro error, irá al 500.
    next(error);
  }
};

module.exports = { getAllTasks, createTask, deleteTask };