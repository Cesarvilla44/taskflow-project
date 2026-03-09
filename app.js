
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

  tasks
    .filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, index) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = `task-card ${task.priority || 'medium'}`;

      taskDiv.innerHTML = `
        <span class="task-title">${task.text}</span>
        <span class="category">${task.category || 'General'}</span>
        <span class="priority">${task.priority || 'Media'}</span>
        <button class="delete-btn" data-index="${index}">Borrar</button>
      `;

      tasksContainer.appendChild(taskDiv);
    });


  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      tasks.splice(idx, 1);
      saveTasks();
      renderTasks(searchInput.value);
    });
  });
}


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
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