// Persistencia simulada en memoria
let tasks = [];

const obtenerTodas = () => {
  return tasks;
};

const crearTarea = (data) => {
  const nuevaTarea = {
    id: Date.now().toString(), // Generamos un ID simple
    ...data
  };
  tasks.push(nuevaTarea);
  return nuevaTarea;
};

const eliminarTarea = (id) => {
  const indice = tasks.findIndex(t => t.id === id);
  
  if (indice === -1) {
    throw new Error('NOT_FOUND');
  }
  
  tasks.splice(indice, 1);
  return true;
};

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};
