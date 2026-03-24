const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join(__dirname, '../../data/tasks.json');

// Variable en memoria para compatibilidad
let tasks = [];

// Cargar tareas desde archivo al iniciar
const loadTasksFromFile = async () => {
    try {
        const data = await fs.readFile(TASKS_FILE, 'utf8');
        tasks = JSON.parse(data);
        console.log("📋 Tareas cargadas desde archivo:", tasks.length);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Si el archivo no existe, crearlo con array vacío
            await fs.writeFile(TASKS_FILE, JSON.stringify([], null, 2));
            tasks = [];
            console.log("📋 Archivo de tareas creado, array vacío");
        } else {
            console.error("Error cargando tareas:", error);
            tasks = [];
        }
    }
};

// Guardar tareas a archivo
const saveTasksToFile = async () => {
    try {
        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
        console.log("💾 Tareas guardadas en archivo:", tasks.length);
    } catch (error) {
        console.error("Error guardando tareas:", error);
    }
};

// Sincronizar tareas con un nuevo array (usado cuando el frontend envía array completo)
const syncTasks = async (newTasks) => {
    tasks = newTasks;
    await saveTasksToFile();
    console.log("🔄 Tareas sincronizadas desde frontend:", tasks.length);
};

// Cargar tareas al iniciar
loadTasksFromFile();

const obtenerTodas = () => {
  return tasks;
};

const crearTarea = (data) => {
  const nuevaTarea = {
    id: Date.now().toString(),
    ...data
  };
  tasks.push(nuevaTarea);
  
  // Guardar en archivo de forma asíncrona (no bloquear)
  saveTasksToFile().catch(console.error);
  
  return nuevaTarea;
};

const eliminarTarea = (id) => {
  const indice = tasks.findIndex(t => t.id === id);
  if (indice === -1) {
    throw new Error('NOT_FOUND');
  }
  tasks.splice(indice, 1);
  
  // Guardar en archivo de forma asíncrona (no bloquear)
  saveTasksToFile().catch(console.error);
  
  return true;
};

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  syncTasks
};
