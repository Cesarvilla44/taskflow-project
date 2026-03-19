const taskService = require('../services/task.service');

const getAllTasks = (req, res, next) => {
  try {
    const tasks = taskService.obtenerTodas();
    res.json(tasks);
  } catch (error) {
    next(error); // Cualquier error inesperado va al manejador global (500)
  }
};

const createTask = (req, res, next) => {
  const { title, description } = req.body;

  // PUNTO 3: Forzando error intencionado si no hay título
  if (!title || title.trim() === '') {
    // Al lanzar un error que NO es 'NOT_FOUND', 
    // el index.js responderá con un HTTP 500 y registrará el error en consola.
    return next(new Error('El título es obligatorio para crear la tarea'));
  }

  try {
    const task = taskService.crearTarea({ title, description });
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