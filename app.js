const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksContainer = document.getElementById('tasks-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const priorityFilter = document.getElementById('priority-filter');
const taskSelectorLabel = document.getElementById('task-selector-label');
const taskPrioritySelector = document.getElementById('task-priority-selector');
const sortSelect = document.getElementById('sort-select');
const completeAllBtn = document.getElementById('complete-all-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');
const notesOpenBtn = document.getElementById('notes-open-btn');
const notesModal = document.getElementById('notes-modal');
const notesTaskSelect = document.getElementById('notes-task-select');
const notesTextarea = document.getElementById('notes-textarea');
const notesCharCount = document.getElementById('notes-char-count');
const notesAcceptBtn = document.getElementById('notes-accept-btn');
const notesCancelBtn = document.getElementById('notes-cancel-btn');
const notesCloseIcon = document.getElementById('notes-close-icon');
const notesWarning = document.getElementById('notes-warning');

// Tema (claro/oscuro)
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

let tasks = [];
let editingTaskId = null;

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} text
 * @property {string} category
 * @property {string} priority
 * @property {number} createdAt
 * @property {boolean} completed
 * @property {string[]} notes
 */

/**
 * Obtiene la clase CSS para la prioridad de una tarea.
 *
 * @param {string} priority - Prioridad de la tarea ('Alta', 'Media', 'Baja')
 * @returns {string} Clase CSS correspondiente
 */
function getPriorityClass(priority) {
    if (!priority) return '';
    
    switch (priority) {
        case 'Alta':
            return 'priority-alta';
        case 'Media':
            return 'priority-media';
        case 'Baja':
            return 'priority-baja';
        default:
            return '';
    }
}

/**
 * Genera el HTML para la insignia de prioridad.
 *
 * @param {string} priority - Prioridad de la tarea
 * @returns {string} HTML de la insignia de prioridad
 */
function getPriorityBadge(priority) {
    const priorityClass = getPriorityClass(priority);
    return `<span class="task-priority-badge ${priorityClass}">${priority}</span>`;
}

/**
 * Actualiza el selector de tareas con la lista actual de tareas.
 *
 * @returns {void}
 */
function updateTaskSelector() {
    if (!taskPrioritySelector) return;
    
    taskPrioritySelector.innerHTML = '<option value="">Selecciona una tarea...</option>';
    
    if (tasks.length === 0) {
        taskPrioritySelector.innerHTML = '<option value="">No hay tareas disponibles</option>';
        return;
    }
    
    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        const priorityText = task.priority || 'Sin prioridad';
        option.textContent = `${task.text} (Actual: ${priorityText})`;
        taskPrioritySelector.appendChild(option);
    });
}

/**
 * Muestra u oculta el selector de tareas según la prioridad seleccionada.
 *
 * @param {string} selectedPriority - Prioridad seleccionada en el filtro
 * @returns {void}
 */
function toggleTaskSelector(selectedPriority) {
    if (!taskSelectorLabel || !taskPrioritySelector) return;
    
    if (selectedPriority === 'all') {
        taskSelectorLabel.style.display = 'none';
        taskPrioritySelector.value = '';
    } else {
        taskSelectorLabel.style.display = 'block';
        updateTaskSelector();
    }
}

/**
 * Aplica la prioridad seleccionada a la tarea especificada.
 *
 * @param {string} taskId - ID de la tarea a modificar
 * @param {string} newPriority - Nueva prioridad a aplicar
 * @returns {void}
 */
function applyPriorityToTask(taskId, newPriority) {
    const task = findTaskById(taskId);
    if (!task) return;
    
    task.priority = newPriority;
    saveTasks();
    renderTasks();
    
    // Resetear el selector
    if (priorityFilter) priorityFilter.value = 'all';
    toggleTaskSelector('all');
}
function createId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Normaliza una tarea cargada (compatibilidad con tareas antiguas).
 *
 * @param {any} task
 * @returns {Task}
 */
function normalizeTask(task) {
    const text = typeof task?.text === 'string' ? task.text : '';
    const category = typeof task?.category === 'string' ? task.category : 'General';
    const priority = typeof task?.priority === 'string' && task.priority ? task.priority : '';
    const createdAt = Number.isFinite(task?.createdAt) ? task.createdAt : Date.now();
    const id = typeof task?.id === 'string' ? task.id : createId();
    const completed = Boolean(task?.completed);
    const notes = Array.isArray(task?.notes) ? task.notes.map(String) : [];

    return { id, text, category, priority, createdAt, completed, notes };
}

/**
 * Devuelve el estado actual de UI para filtrar/ordenar/buscar.
 *
 * @returns {{ q: string, category: string, priority: string, sort: string }}
 */
function getViewState() {
    return {
        q: (searchInput?.value || '').trim(),
        category: categoryFilter?.value || 'all',
        priority: priorityFilter?.value || 'all',
        sort: sortSelect?.value || 'newest'
    };
}

/**
 * Guarda el estado de vista (búsqueda/filtros/orden) en localStorage.
 *
 * @param {{ q: string, category: string, priority: string, sort: string }} state
 * @returns {void}
 */
function saveViewState(state) {
    localStorage.setItem('viewState', JSON.stringify(state));
}

/**
 * Carga el estado de vista desde localStorage si existe.
 *
 * @returns {{ q: string, category: string, priority: string, sort: string } | null}
 */
function loadViewState() {
    try {
        const raw = localStorage.getItem('viewState');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        return {
            q: typeof parsed.q === 'string' ? parsed.q : '',
            category: typeof parsed.category === 'string' ? parsed.category : 'all',
            priority: typeof parsed.priority === 'string' ? parsed.priority : 'all',
            sort: typeof parsed.sort === 'string' ? parsed.sort : 'newest'
        };
    } catch {
        return null;
    }
}

/**
 * Aplica filtro + búsqueda + ordenación al array de tareas.
 *
 * @param {Task[]} list
 * @param {{ q: string, category: string, priority: string, sort: string }} state
 * @returns {Task[]}
 */
function getVisibleTasks(list, state) {
    const q = state.q.toLowerCase();

    const filtered = list.filter(t => {
        if (state.category !== 'all' && t.category !== state.category) return false;
        if (state.priority !== 'all' && t.priority !== state.priority) return false;
        if (q && !t.text.toLowerCase().includes(q)) return false;
        return true;
    });

    const sorted = filtered.slice();
    switch (state.sort) {
        case 'oldest':
            sorted.sort((a, b) => a.createdAt - b.createdAt);
            break;
        case 'az':
            sorted.sort((a, b) => a.text.localeCompare(b.text, 'es', { sensitivity: 'base' }));
            break;
        case 'za':
            sorted.sort((a, b) => b.text.localeCompare(a.text, 'es', { sensitivity: 'base' }));
            break;
        case 'newest':
        default:
            sorted.sort((a, b) => b.createdAt - a.createdAt);
            break;
    }

    return sorted;
}

/**
 * Busca una tarea por id.
 *
 * @param {string} id
 * @returns {Task|null}
 */
function findTaskById(id) {
    return tasks.find(t => t.id === id) || null;
}

/**
 * Actualiza el texto de una tarea existente.
 *
 * @param {string} id
 * @param {string} newText
 * @returns {void}
 */
function updateTaskText(id, newText) {
    const task = findTaskById(id);
    if (!task) return;
    task.text = newText;
    saveTasks();
}

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
    if (Array.isArray(storedTasks)) {
        tasks = storedTasks.map(normalizeTask);
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

    // Restaura filtros/búsqueda/orden si existen
    const restoredView = loadViewState();
    if (restoredView) {
        if (searchInput) searchInput.value = restoredView.q;
        if (categoryFilter) categoryFilter.value = restoredView.category;
        if (priorityFilter) priorityFilter.value = restoredView.priority;
        if (sortSelect) sortSelect.value = restoredView.sort;
    }

    renderTasks();
});


/**
 * Pinta en el DOM la lista de tareas aplicando búsqueda, filtros y ordenación.
 *
 * @returns {void}
 */
function renderTasks() {
    tasksContainer.innerHTML = '';

    const state = getViewState();
    saveViewState(state);
    const visibleTasks = getVisibleTasks(tasks, state);

    if (!visibleTasks.length) {
        tasksContainer.innerHTML = `
            <div class="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400 italic">
                No hay tareas por ahora.
            </div>
        `;
        return;
    }

    visibleTasks.forEach((task) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-card ${task.priority || 'medium'}`;
        taskDiv.dataset.taskId = task.id;

        const isEditing = editingTaskId === task.id;
        const safeText = task.text
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');

        taskDiv.innerHTML = isEditing
            ? `
                <div class="task-content">
                    <input class="edit-input w-full p-2 rounded-md border bg-white dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value="${safeText}" />
                </div>
                <div class="task-actions">
                    <button class="save-btn save-btn">💾 Guardar</button>
                    <button class="cancel-btn cancel-btn">Cancelar</button>
                </div>
            `
            : `
                ${task.priority ? getPriorityBadge(task.priority) : ''}
                <div class="task-content">
                    <span class="task-title${task.completed ? ' task-completed' : ''}"><strong>${safeText}</strong></span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn edit-btn">📝 Editar</button>
                    <button class="delete-btn delete-btn">🧽 Borrar</button>
                </div>
            `;

        tasksContainer.appendChild(taskDiv);

        // Anotaciones fuera de la tarjeta, justo debajo
        if (task.notes && task.notes.length) {
            const notesWrapper = document.createElement('div');
            notesWrapper.innerHTML = `<ul class="task-notes">${task.notes
                .map(n =>
                    `<li><em>${String(n)
                        .replaceAll('&', '&amp;')
                        .replaceAll('<', '&lt;')
                        .replaceAll('>', '&gt;')}</em></li>`
                )
                .join('')}</ul>`;
            tasksContainer.appendChild(notesWrapper);
        }
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
    renderTasks();
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

    tasks.push(normalizeTask({
        id: createId(),
        text: taskText,
        category: 'General',
        priority: '',
        createdAt: Date.now(),
        completed: false,
        notes: []
    }));

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
    renderTasks();
});

if (categoryFilter) categoryFilter.addEventListener('change', () => renderTasks());
if (priorityFilter) {
    priorityFilter.addEventListener('change', (e) => {
        const selectedPriority = e.target.value;
        toggleTaskSelector(selectedPriority);
        renderTasks();
    });
}
if (taskPrioritySelector) {
    taskPrioritySelector.addEventListener('change', (e) => {
        const selectedTaskId = e.target.value;
        const selectedPriority = priorityFilter ? priorityFilter.value : 'all';
        
        if (selectedTaskId && selectedPriority !== 'all') {
            applyPriorityToTask(selectedTaskId, selectedPriority);
        }
    });
}
if (sortSelect) sortSelect.addEventListener('change', () => renderTasks());

if (completeAllBtn) {
    completeAllBtn.addEventListener('click', () => {
        if (!tasks.length) return;
        tasks = tasks.map(t => ({ ...t, completed: true }));
        saveTasks();
        renderTasks();
    });
}

if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', () => {
        if (!tasks.length) return;
        tasks = [];
        saveTasks();
        renderTasks();
    });
}

// --- Anotaciones ---

function openNotesModal() {
    if (!notesModal) return;

    const hasTasks = tasks.length > 0;

    // Mostrar/ocultar aviso y habilitar/deshabilitar controles
    if (notesWarning) notesWarning.style.display = hasTasks ? 'none' : 'block';
    if (notesTaskSelect) {
        notesTaskSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = hasTasks ? 'Selecciona una tarea...' : 'No hay tareas disponibles';
        notesTaskSelect.appendChild(placeholder);

        if (hasTasks) {
            tasks.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.textContent = t.text;
                notesTaskSelect.appendChild(opt);
            });
        }

        notesTaskSelect.disabled = !hasTasks;
    }

    if (notesTextarea) {
        notesTextarea.value = '';
        notesTextarea.disabled = !hasTasks;
    }
    if (notesCharCount) notesCharCount.textContent = '0';
    if (notesAcceptBtn) notesAcceptBtn.disabled = !hasTasks;

    notesModal.classList.remove('hidden');

    // Enfoca el selector al abrir
    if (notesTaskSelect && hasTasks) notesTaskSelect.focus();
}

function closeNotesModal() {
    if (!notesModal) return;
    notesModal.classList.add('hidden');
}

function addNoteToTask(taskId, noteText) {
    const task = findTaskById(taskId);
    if (!task) return;
    if (!Array.isArray(task.notes)) task.notes = [];
    task.notes.push(noteText);
    saveTasks();
}

if (notesOpenBtn) {
    notesOpenBtn.addEventListener('click', () => {
        openNotesModal();
    });
}

if (notesCancelBtn) {
    notesCancelBtn.addEventListener('click', () => {
        closeNotesModal();
    });
}

if (notesCloseIcon) {
    notesCloseIcon.addEventListener('click', () => {
        closeNotesModal();
    });
}

// Cerrar al pulsar ESC
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!notesModal) return;
    if (!notesModal.classList.contains('hidden')) closeNotesModal();
});

// Cerrar al hacer clic fuera del cuadro (backdrop)
if (notesModal) {
    notesModal.addEventListener('click', (e) => {
        if (e.target === notesModal) closeNotesModal();
    });
}

if (notesTextarea && notesCharCount) {
    notesTextarea.addEventListener('input', () => {
        const current = notesTextarea.value.slice(0, 500);
        if (notesTextarea.value.length > 500) {
            notesTextarea.value = current;
        }
        notesCharCount.textContent = String(current.length);
    });
}

if (notesAcceptBtn) {
    notesAcceptBtn.addEventListener('click', () => {
        if (!notesTaskSelect || !notesTextarea) return;
        const taskId = notesTaskSelect.value;
        const noteText = notesTextarea.value.trim();

        if (!taskId || !noteText) return;

        addNoteToTask(taskId, noteText);
        renderTasks();
        closeNotesModal();
    });
}

// Delegación de eventos para acciones por tarea (editar/borrar/guardar/cancelar)
tasksContainer.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement|null} */ (e.target);
    if (!target) return;

    const card = target.closest('[data-task-id]');
    if (!card) return;

    const taskId = card.getAttribute('data-task-id');
    if (!taskId) return;

    if (target.classList.contains('delete-btn')) {
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx !== -1) deleteTask(idx);
        return;
    }

    if (target.classList.contains('edit-btn')) {
        editingTaskId = taskId;
        renderTasks();
        return;
    }

    if (target.classList.contains('cancel-btn')) {
        editingTaskId = null;
        renderTasks();
        return;
    }

    if (target.classList.contains('save-btn')) {
        const input = /** @type {HTMLInputElement|null} */ (card.querySelector('.edit-input'));
        const newText = (input?.value || '').trim();
        if (newText) updateTaskText(taskId, newText);
        editingTaskId = null;
        renderTasks();
    }
});
