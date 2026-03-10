const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksContainer = document.getElementById('tasks-container');
const searchInput = document.getElementById('search-input');

let tasks = [];


window.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        renderTasks();
    }
});


function renderTasks(filter = '') {
    tasksContainer.innerHTML = '';

    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(filter.toLowerCase())
    );

   filteredTasks.forEach((task, index) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-card ${task.priority || 'medium'}`;
    
    
    taskDiv.innerHTML = `
        <div class="task-content">
            <span class="task-title"><strong>${task.text}</strong></span>
        </div>
        <button class="delete-btn" data-index="${index}">Borrar</button>
    `;
    
    tasksContainer.appendChild(taskDiv);
});


   
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.onclick = (e) => {
            const idx = e.target.getAttribute('data-index');
            deleteTask(idx);
        };
    });
}


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(searchInput.value);
}


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
    taskInput.value = '';
});


searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value);
});
