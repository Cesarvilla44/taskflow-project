const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksContainer = document.getElementById('tasks-container');
const searchInput = document.getElementById('search-input');

let tasks = [];

// 1. Cargar tareas al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        renderTasks();
    }
});

// 2. Función para renderizar tareas
function renderTasks(filter = '') {
    tasksContainer.innerHTML = '';

    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(filter.toLowerCase())
    );

    filteredTasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        // Usamos template literals para una estructura más limpia
        taskDiv.className = `task-card ${task.priority || 'medium'}`;
        
        taskDiv.innerHTML = `
            <div class="task-content">
                <span class="task-title"><strong>${task.text}</strong></span>
                <div class="task-details">
                    <span class="category-tag">${task.category || 'General'}</span>
                    <span class="priority-tag">${task.priority || 'Media'}</span>
                </div>
            </div>
            <button class="delete-btn" data-index="${index}">Borrar</button>
        `;
        
        tasksContainer.appendChild(taskDiv);
    });

    // IMPORTANTE: Escuchar clics en los botones de borrar después de renderizar
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.onclick = (e) => {
            const idx = e.target.getAttribute('data-index');
            deleteTask(idx);
        };
    });
}

// 3. Función para guardar en LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 4. Función para borrar tarea
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(searchInput.value);
}

// 5. Evento para añadir tarea
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    
    if (taskText === '') return;

    tasks.push({
        text: taskText,
        category: 'General',
        priority: 'Media'
    });

    saveTasks();
    renderTasks();
    taskInput.value = ''; // Limpiar el input
});

// 6. Evento para buscar tareas
searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value);
});
