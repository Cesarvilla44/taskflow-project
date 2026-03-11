const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksContainer = document.getElementById('tasks-container');
const searchInput = document.getElementById('search-input');

// Tema (claro/oscuro)
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

let tasks = [];

/**
 * Aplica el tema claro/oscuro al documento y persiste la preferencia en localStorage.
 *
 * @param {boolean} isDark - Indica si debe activarse el modo oscuro (`true`) o el modo claro (`false`).
 * @returns {void}
 */
function applyTheme(isDark) {
    // Aplica la clase de tema al <html>
    html.classList.toggle('dark', isDark);

    // Actualiza icono y texto del botón si existen y es posible
    if (themeIcon && themeLabel) {
        if (isDark) {
            themeIcon.textContent = '☀️';
            themeIcon.classList.remove('text-white');
            themeLabel.textContent = 'Claro';
        } else {
            themeIcon.textContent = '🌙';
            themeIcon.classList.add('text-white');
            themeLabel.textContent = 'Oscuro';
        }
    }

    // Persiste la preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/**
 * Inicializa la aplicación cuando el DOM está listo.
 * - Carga tareas desde localStorage.
 * - Restaura el tema guardado (claro/oscuro).
 * - Conecta el botón de cambio de tema.
 *
 * @returns {void}
 */
window.addEventListener('DOMContentLoaded', () => {
    // Tareas guardadas
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        renderTasks();
    }

    // Tema guardado
    const storedTheme = localStorage.getItem('theme');
    const initialIsDark =
        storedTheme === 'dark'
            ? true
            : storedTheme === 'light'
                ? false
                : html.classList.contains('dark');

    // Aplica el tema inicial (guardado o el ya presente en el DOM)
    applyTheme(initialIsDark);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const nextIsDark = !html.classList.contains('dark');
            applyTheme(nextIsDark);
        });
    }
});


/**
 * Pinta en el DOM la lista de tareas, opcionalmente filtradas por texto.
 *
 * @param {string} [filter=""] - Texto a buscar dentro de `task.text` (no sensible a mayúsculas).
 * @returns {void}
 */
function renderTasks(filter = '') {
    tasksContainer.innerHTML = '';

    const normalizedFilter = filter.toLowerCase();

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(normalizedFilter)
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


    // Solo buscamos botones de borrado dentro del contenedor de tareas
    const deleteButtons = tasksContainer.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.onclick = (e) => {
            const idx = e.target.getAttribute('data-index');
            deleteTask(idx);
        };
    });
}


/**
 * Guarda el array de tareas actual en localStorage.
 *
 * @returns {void}
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


/**
 * Elimina una tarea por índice, actualiza el almacenamiento
 * y vuelve a renderizar la lista usando el filtro actual.
 *
 * @param {number|string} index - Índice de la tarea en el array `tasks`.
 * @returns {void}
 */
function deleteTask(index) {
    const numericIndex = Number(index);

    // Si el índice no es un número válido, no hacemos nada
    if (Number.isNaN(numericIndex)) return;

    tasks.splice(numericIndex, 1);
    saveTasks();
    renderTasks(searchInput.value);
}


/**
 * Maneja el envío del formulario de tareas.
 * Crea una nueva tarea a partir del texto introducido,
 * la guarda y actualiza la lista mostrada.
 *
 * @param {SubmitEvent} e - Evento de envío del formulario.
 * @returns {void}
 */
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


/**
 * Maneja el evento de entrada en el buscador de tareas
 * y vuelve a renderizar la lista aplicando el filtro.
 *
 * @param {InputEvent} e - Evento de entrada del campo de búsqueda.
 * @returns {void}
 */
searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value);
});
