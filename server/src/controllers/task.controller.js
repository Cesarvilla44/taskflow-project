const taskService = require('../services/task.service');

const getAllTasks = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
};

const createTask = (req, res) => {
  const { title, description } = req.body;

  // Validación defensiva con IF
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const task = taskService.crearTarea({ title, description });
  res.status(201).json(task);
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  try {
    taskService.eliminarTarea(id);
    res.status(204).send(); // 204 No Content para borrado exitoso
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask
};
