const { kv } = require('@vercel/kv');

class TaskService {
    constructor() {
        this.kv = kv;
    }

    // Obtener todas las tareas
    async obtenerTodas() {
        try {
            const tasks = await this.kv.get('tasks');
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error obteniendo tareas:', error);
            return [];
        }
    }

    // Crear nueva tarea
    async crearTarea(data) {
        try {
            const tasks = await this.obtenerTodas();
            const nuevaTarea = {
                id: Date.now().toString(),
                ...data,
                createdAt: new Date().toISOString(),
                completed: false
            };
            tasks.push(nuevaTarea);
            await this.kv.set('tasks', JSON.stringify(tasks));
            return nuevaTarea;
        } catch (error) {
            console.error('Error creando tarea:', error);
            throw error;
        }
    }

    // Sincronizar todas las tareas
    async syncTasks(newTasks) {
        try {
            await this.kv.set('tasks', JSON.stringify(newTasks));
            console.log('Tareas sincronizadas en KV:', newTasks.length);
        } catch (error) {
            console.error('Error sincronizando tareas:', error);
            throw error;
        }
    }

    // Eliminar tarea
    async eliminarTarea(taskId) {
        try {
            const tasks = await this.obtenerTodas();
            const filteredTasks = tasks.filter(t => t.id !== taskId);
            await this.kv.set('tasks', JSON.stringify(filteredTasks));
            return true;
        } catch (error) {
            console.error('Error eliminando tarea:', error);
            throw error;
        }
    }
}

module.exports = new TaskService();
