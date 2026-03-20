import client from './client';

export const fetchTasks = () => client.get('/tasks');
export const createTask = (task) => client.post('/tasks', task);
// Haz lo mismo para eliminar o editar...
