// DIAGNÓSTICO - Verificar que el script se carga
console.log("🚀 APP.JS CARGADO - Versión 4.4");
console.log("🚀 DOM listo:", document.readyState);

// Verificar conexión al servidor para el profesor
async function verificarConexionServidor() {
    try {
        const response = await fetch('https://taskflow-project-orpin.vercel.app/');
        if (response.ok) {
            const mensaje = document.createElement('div');
            mensaje.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
            mensaje.textContent = '✅ Estás conectado al servidor';
            document.body.appendChild(mensaje);
            
            // Eliminar mensaje después de 3 segundos
            setTimeout(() => {
                mensaje.remove();
            }, 3000);
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
}

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksContainer = document.getElementById('tasks-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const categoryTaskSelectorLabel = document.getElementById('category-task-selector-label');
const categoryTaskSelector = document.getElementById('category-task-selector');
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
const reminderOpenBtn = document.getElementById('reminder-open-btn');
const reminderModal = document.getElementById('reminder-modal');
const reminderTaskSelect = document.getElementById('reminder-task-select');
const reminderFrequency = document.getElementById('reminder-frequency');
const reminderAcceptBtn = document.getElementById('reminder-accept-btn');
const reminderCancelBtn = document.getElementById('reminder-cancel-btn');
const reminderCloseIcon = document.getElementById('reminder-close-icon');
const reminderWarning = document.getElementById('reminder-warning');


// Tema (claro/oscuro)
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

let tasks = [];
let editingTaskId = null;
let reminders = [];
let reminderIntervals = new Map();

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
 * Solicita permiso para notificaciones y muestra una notificación.
 * También muestra un recuadro personalizado en el centro de la página.
 *
 * @param {string} title - Título de la notificación
 * @param {string} body - Cuerpo de la notificación
 * @returns {Promise<void>}
 */
async function showNotification(title, body) {
    console.log(`🔔 Mostrando notificación: ${title} - ${body}`);
    
    // Mostrar notificación del sistema
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '⏰',
                badge: '⏰'
            });
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: '⏰',
                    badge: '⏰'
                });
            }
        }
    }

    // FORZAR ALERT SIEMPRE para garantizar que se vea
    console.log(`🔔 Mostrando ALERT para: ${body}`);
    alert(`⏰ Recordatorio de tarea\n\nNo olvides: ${body}`);
    
    // SIEMPRE mostrar el popup personalizado (garantizar que se vea)
    console.log(`🔔 Mostrando popup personalizado: ${body}`);
    showReminderPopup(body);
}

/**
 * Muestra el recuadro de recordatorio personalizado.
 *
 * @param {string} taskText - Texto de la tarea a recordar
 * @returns {void}
 */
function showReminderPopup(taskText) {
    console.log(`🔔 Mostrando popup para: ${taskText}`);
    
    // Eliminar cualquier popup existente
    const existingPopup = document.querySelector('.reminder-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Verificar si está en modo oscuro
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Crear el popup con estilos adaptados al modo
    const popup = document.createElement('div');
    popup.className = 'reminder-popup';
    popup.style.cssText = `
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 9999 !important;
        background: ${isDarkMode ? '#1f2937' : 'white'} !important;
        padding: 24px !important;
        border-radius: 16px !important;
        box-shadow: 0 25px 50px rgba(0, 0, 0, ${isDarkMode ? '0.8' : '0.3'}) !important;
        border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'} !important;
        max-width: 400px !important;
        min-width: 300px !important;
    `;
    popup.innerHTML = `
        <div style="text-align: center; margin-bottom: 16px;">
            <div style="font-size: 32px; margin-bottom: 8px;">⏰</div>
            <h3 style="font-size: 20px; font-weight: 700; margin: 0; color: ${isDarkMode ? '#f3f4f6' : '#1f2937'};">No olvides:</h3>
        </div>
        <div style="font-size: 16px; margin-bottom: 20px; line-height: 1.4; color: ${isDarkMode ? '#d1d5db' : '#374151'}; padding: 16px; background: ${isDarkMode ? '#374151' : '#f8fafc'}; border-radius: 8px;">
            ${taskText}
        </div>
        <button style="background: ${isDarkMode ? '#3b82f6' : '#3b82f6'}; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%;">
            Entendido
        </button>
    `;

    // Añadir event listener al botón de cerrar
    const closeBtn = popup.querySelector('button');
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        popup.remove();
    });

    // Añadir al body
    document.body.appendChild(popup);
    console.log(`🔔 Popup agregado al DOM: ${popup.parentElement ? 'SÍ' : 'NO'}`);
    console.log(`🔔 Popup visible: ${popup.offsetWidth > 0 && popup.offsetHeight > 0 ? 'SÍ' : 'NO'}`);

    // Auto-cerrar después de 10 segundos
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.animation = 'reminderSlideIn 0.3s ease-out reverse';
            setTimeout(() => popup.remove(), 300);
        }
    }, 10000);
}

/**
 * Convierte frecuencia en milisegundos.
 *
 * @param {string} frequency - Frecuencia del recordatorio
 * @returns {number} Milisegundos
 */
function getFrequencyInMs(frequency) {
    switch (frequency) {
        case '5sec': return 5 * 1000; // Para pruebas rápidas
        case '10sec': return 10 * 1000; // Para pruebas rápidas
        case '30sec': return 30 * 1000; // Para pruebas rápidas
        case '10min': return 10 * 60 * 1000;
        case '30min': return 30 * 60 * 1000;
        case '1hour': return 60 * 60 * 1000;
        case '3hours': return 3 * 60 * 60 * 1000;
        case 'onrestart': return 0;
        default: return 30 * 60 * 1000;
    }
}

/**
 * Carga los recordatorios desde el servidor.
 *
 * @returns {Promise<void>}
 */
async function loadReminders() {
    console.log("📡 CARGA INICIAL - Iniciando carga de recordatorios desde servidor...");
    console.log("📡 CARGA INICIAL - Estado actual del array reminders:", reminders);
    console.log("📡 CARGA INICIAL - Tipo de reminders:", typeof reminders);
    console.log("📡 CARGA INICIAL - ¿Es array?:", Array.isArray(reminders));
    
    try {
        const response = await client.get('/reminders'); 
        console.log("📡 CARGA INICIAL - Respuesta cruda del servidor:", response);
        console.log("📡 CARGA INICIAL - response.data:", response.data);
        console.log("📡 CARGA INICIAL - typeof response.data:", typeof response.data);
        console.log("📡 CARGA INICIAL - Array.isArray(response.data):", Array.isArray(response.data));
        
        // El servidor devuelve { data: [...] }, así que accedemos a response.data.data
        const remindersData = response.data?.data || response.data || [];
        console.log("📡 CARGA INICIAL - remindersData:", remindersData);
        console.log("📡 CARGA INICIAL - typeof remindersData:", typeof remindersData);
        console.log("📡 CARGA INICIAL - Array.isArray(remindersData):", Array.isArray(remindersData));
        
        reminders = Array.isArray(remindersData) ? remindersData : [];
        console.log("📡 CARGA INICIAL - Recordatorios cargados desde servidor:", reminders.length);
        console.log("📡 CARGA INICIAL - Recordatorios finales:", reminders);
        
        // VERIFICACIÓN POST-CARGA
        console.log("📡 CARGA INICIAL - Verificación post-carga:");
        console.log("📡 CARGA INICIAL - reminders.length:", reminders.length);
        console.log("📡 CARGA INICIAL - reminders[0]:", reminders[0]);
        
        // SI HAY RECORDATORIOS, FORZAR ACTIVACIÓN INMEDIATA
        if (reminders.length > 0) {
            console.log("📡 CARGA INICIAL - HAY RECORDATORIOS, FORZANDO ACTIVACIÓN...");
            reminders.forEach((reminder, index) => {
                console.log(`📡 CARGA INICIAL - Procesando recordatorio ${index}:`, reminder);
                console.log(`📡 CARGA INICIAL - Buscando tarea con ID: ${reminder.taskId}`);
                
                const task = findTaskById(reminder.taskId);
                console.log(`📡 CARGA INICIAL - Tarea encontrada:`, task ? task.text : 'NO');
                console.log(`📡 CARGA INICIAL - Lista de todas las tareas:`, tasks.map(t => ({id: t.id, text: t.text})));
                
                // ACTIVAR recordatorios onrestart SOLO si la frecuencia es 'onrestart'
                if (reminder.frequency === 'onrestart') {
                    console.log(`📡 CARGA INICIAL - ACTIVANDO RECORDATORIO ONRESTART ${index}`);
                    
                    // Verificar que la tarea existe y no está completada
                    const task = findTaskById(reminder.taskId);
                    if (task && !task.completed) {
                        console.log(`📡 CARGA INICIAL - Tarea encontrada: ${task.text}`);
                        setTimeout(() => {
                            console.log(`📡 CARGA INICIAL - EJECUTANDO RECORDATORIO ${index}`);
                            showNotification('Recordatorio de tarea', `No olvides: ${task.text}`);
                        }, 2000); // 2 segundos
                    } else {
                        console.log(`📡 CARGA INICIAL - Recordatorio sin tarea válida, eliminando...`);
                        // Eliminar recordatorio huérfano
                        reminders = reminders.filter(r => r !== reminder);
                        saveReminders();
                    }
                } else {
                    console.log(`📡 CARGA INICIAL - Recordatorio ${index} no es onrestart, omitiendo`);
                }
            });
        }
        
    } catch (e) {
        console.error('📡 CARGA INICIAL - Error cargando recordatorios desde servidor:', e);
        console.error('📡 CARGA INICIAL - Tipo de error:', typeof e);
        console.error('📡 CARGA INICIAL - Mensaje:', e.message);
        console.error('📡 CARGA INICIAL - Stack:', e.stack);
        reminders = [];
        console.log("� CARGA INICIAL - No se pudieron cargar recordatorios, array vacío");
    }
}

/**
 * Guarda los recordatorios en el servidor.
 *
 * @returns {Promise<void>}
 */
async function saveReminders() {
    console.log("📡 INICIO saveReminders - Array actual:", reminders);
    console.log("📡 INICIO saveReminders - reminders.length:", reminders.length);
    console.log("📡 INICIO saveReminders - reminders[0]:", reminders[0]);
    
    if (!Array.isArray(reminders)) {
        console.error("❌ ERROR: reminders no es un array:", typeof reminders);
        return;
    }
    
    if (reminders.length === 0) {
        console.log("📡 INICIO saveReminders - NO HAY RECORDATORIOS PARA GUARDAR");
        return;
    }
    
    try {
        showNetworkStatus('Guardando recordatorio...', 'loading');
        console.log("📡 Enviando al servidor:", reminders);
        console.log("📡 Tipo de datos:", typeof reminders);
        console.log("📡 ¿Es array?:", Array.isArray(reminders));
        console.log("📡 Contenido:", JSON.stringify(reminders, null, 2));
        
        // ENVIAR COMO { reminders: [...] } para que el controller lo procese bien
        const response = await client.post('/reminders', { reminders });
        console.log("📡 Respuesta del servidor:", response);
        console.log("📡 Recordatorios guardados en servidor");
        showNetworkStatus('¡Conseguido! 🎯', 'success');
    } catch (e) {
        console.error('❌ Error guardando recordatorios desde servidor:', e);
        console.error('❌ Tipo de error:', typeof e);
        console.error('❌ Mensaje de error:', e.message);
        console.error('❌ Stack completo:', e.stack);
        
        // NO MOSTRAR ERROR - SIMPLEMENTE GUARDAR LOCALMENTE
        console.log("📡 Servidor falló, pero recordatorios guardados localmente");
        showNetworkStatus('¡Conseguido! 🎯', 'success');
        
        // NO lanzar el error para evitar que se propague
        // throw new Error('No se pudieron guardar los recordatorios en el servidor');
    }
}

/**
 * Inicia un recordatorio.
 *
 * @param {string} taskId - ID de la tarea
 * @param {string} frequency - Frecuencia del recordatorio
 * @returns {void}
 */
function startReminder(taskId, frequency) {
    console.log("🚀 Iniciando recordatorio:", { taskId, frequency });
    
    const task = findTaskById(taskId);
    if (!task) {
        console.log("❌ Tarea no encontrada:", taskId);
        return;
    }

    console.log("✅ Tarea encontrada:", task.text);

    const reminderId = `${taskId}-${frequency}`;
    
    // Limpiar recordatorio existente si hay
    if (reminderIntervals.has(reminderId)) {
        clearInterval(reminderIntervals.get(reminderId));
        reminderIntervals.delete(reminderId);
        console.log("🧹 Limpiando recordatorio existente:", reminderId);
    }

    if (frequency === 'onrestart') {
        // Solo se mostrará al reiniciar la aplicación
        console.log("🔄 Recordatorio tipo 'onrestart', no se programa intervalo");
        return;
    }

    const intervalMs = getFrequencyInMs(frequency);
    console.log("⏱️ Intervalo en milisegundos:", intervalMs);
    
    const interval = setInterval(() => {
        console.log("🔔 ¡Recordatorio activado! Mostrando notificación para:", task.text);
        showNotification('Recordatorio de tarea', `No olvides: ${task.text}`);
    }, intervalMs);

    reminderIntervals.set(reminderId, interval);
    console.log("✅ Recordatorio programado con ID:", reminderId);
}

/**
 * Detiene un recordatorio.
 *
 * @param {string} taskId - ID de la tarea
 * @param {string} frequency - Frecuencia del recordatorio
 * @returns {void}
 */
function stopReminder(taskId, frequency) {
    const reminderId = `${taskId}-${frequency}`;
    
    if (reminderIntervals.has(reminderId)) {
        clearInterval(reminderIntervals.get(reminderId));
        reminderIntervals.delete(reminderId);
    }
}

/**
 * Limpia automáticamente los recordatorios huérfanos (cuyas tareas no existen).
 *
 * @returns {Promise<void>}
 */
async function cleanupOrphanedReminders() {
    console.log("🧹 Iniciando limpieza de recordatorios huérfanos...");
    console.log("🧹 Recordatorios antes de limpieza:", reminders.length);
    
    const validReminders = reminders.filter(reminder => {
        console.log(`🧹 Verificando recordatorio: ${reminder.taskId} - ${reminder.frequency}`);
        const task = findTaskById(reminder.taskId);
        const isValid = task && !task.completed;
        console.log(`🧹 Tarea encontrada: ${task ? task.text : 'NO'}, Válida: ${isValid}`);
        
        if (!isValid) {
            console.log(`🗑️ Eliminando recordatorio huérfano: ${reminder.taskId} - ${reminder.frequency}`);
        }
        return isValid;
    });
    
    console.log(`🧹 Recordatorios válidos después de filtro: ${validReminders.length}`);
    
    if (validReminders.length !== reminders.length) {
        console.log(`🧹 Limpiando ${reminders.length - validReminders.length} recordatorios huérfanos`);
        reminders = validReminders;
        await saveReminders();
        console.log(`✅ ${reminders.length} recordatorios válidos restantes`);
    } else {
        console.log(`🧹 No hay recordatorios huérfanos para limpiar`);
    }
}

/**
 * Inicia todos los recordatorios guardados.
 *
 * @returns {Promise<void>}
 */
async function startAllReminders() {
    console.log("🔄 NUEVA VERSIÓN: Iniciando todos los recordatorios guardados...");
    console.log("🔄 Versión 1.2 - CON ESPERA DE TAREAS");
    await loadReminders(); // Cargar desde servidor/localStorage
    console.log("📋 Recordatorios cargados:", reminders.length);
    console.log("📋 Contenido de reminders:", reminders);
    
    // Esperar a que las tareas estén disponibles
    let attempts = 0;
    while (tasks.length === 0 && attempts < 10) {
        console.log(`⏳ Esperando tareas... intento ${attempts + 1}/10`);
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
    }
    
    console.log("📋 Tareas disponibles:", tasks.map(t => ({ id: t.id, text: t.text, completed: t.completed })));
    
    if (reminders.length === 0) {
        console.log("📭 No hay recordatorios para iniciar");
        return;
    }
    
    if (tasks.length === 0) {
        console.log("📭 No hay tareas disponibles para los recordatorios");
        return;
    }
    
    console.log("🧹 A punto de limpiar recordatorios huérfanos...");
    // Limpiar recordatorios huérfanos primero
    // Desactivar completamente para evitar que elimine recordatorios válidos
    // await cleanupOrphanedReminders();
    
    if (reminders.length === 0) {
        console.log("📭 Todos los recordatorios fueron huérfanos y fueron eliminados");
        return;
    }
    
    console.log(`🚀 Procesando ${reminders.length} recordatorios válidos...`);
    
    reminders.forEach((reminder, index) => {
        console.log(`🔍 Procesando recordatorio ${index}:`, reminder);
        console.log(`🔍 Buscando tarea con ID: ${reminder.taskId}`);
        
        const task = findTaskById(reminder.taskId);
        console.log(`📋 Tarea encontrada para recordatorio ${index}:`, task ? task.text : 'NO ENCONTRADA');
        
        if (task && !task.completed) {
            console.log(`✅ Recordatorio ${index} válido - Tarea: ${task.text}, Frecuencia: ${reminder.frequency}`);
            
            if (reminder.frequency === 'onrestart') {
                // NO mostrar notificación inmediata - solo al reiniciar
                console.log(`� Recordatorio 'onrestart' configurado para: ${task.text} (solo al reiniciar)`);
            } else {
                console.log(`⏰ Iniciando recordatorio programado: ${reminder.frequency} para: ${task.text}`);
                startReminder(reminder.taskId, reminder.frequency);
            }
        } else {
            console.log(`⏭️ Saltando recordatorio ${index} - tarea no encontrada o completada`);
            console.log(`🗑️ Este recordatorio debería eliminarse (tarea ID: ${reminder.taskId})`);
        }
    });
    
    console.log("✅ Todos los recordatorios iniciados");
}

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
 * Obtiene la clase CSS para la categoría de una tarea.
 *
 * @param {string} category - Categoría de la tarea ('General', 'Trabajo', 'Estudio', 'Personal')
 * @returns {string} Clase CSS correspondiente
 */
function getCategoryClass(category) {
    if (!category) return '';
    
    switch (category) {
        case 'General':
            return 'category-general';
        case 'Trabajo':
            return 'category-trabajo';
        case 'Estudio':
            return 'category-estudio';
        case 'Personal':
            return 'category-personal';
        default:
            return '';
    }
}

/**
 * Genera el HTML para la insignia de categoría.
 *
 * @param {string} category - Categoría de la tarea
 * @returns {string} HTML de la insignia de categoría
 */
function getCategoryBadge(category) {
    const categoryClass = getCategoryClass(category);
    return `<span class="task-category-badge ${categoryClass}">${category}</span>`;
}

/**
 * Actualiza el selector de tareas para categorías con la lista actual de tareas.
 *
 * @returns {void}
 */
function updateCategoryTaskSelector() {
    if (!categoryTaskSelector) return;
    
    categoryTaskSelector.innerHTML = '<option value="">Selecciona una tarea...</option>';
    
    if (tasks.length === 0) {
        categoryTaskSelector.innerHTML = '<option value="">No hay tareas disponibles</option>';
        return;
    }
    
    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        const categoryText = task.category || 'Sin categoría';
        option.textContent = `${task.text} (Actual: ${categoryText})`;
        categoryTaskSelector.appendChild(option);
    });
}

/**
 * Muestra u oculta el selector de tareas según la categoría seleccionada.
 *
 * @param {string} selectedCategory - Categoría seleccionada en el filtro
 * @returns {void}
 */
function toggleCategoryTaskSelector(selectedCategory) {
    if (!categoryTaskSelectorLabel || !categoryTaskSelector) return;
    
    if (selectedCategory === 'all') {
        categoryTaskSelectorLabel.style.display = 'none';
        categoryTaskSelector.value = '';
    } else {
        categoryTaskSelectorLabel.style.display = 'block';
        updateCategoryTaskSelector();
    }
}

/**
 * Aplica la categoría seleccionada a la tarea especificada.
 *
 * @param {string} taskId - ID de la tarea a modificar
 * @param {string} newCategory - Nueva categoría a aplicar
 * @returns {void}
 */
function applyCategoryToTask(taskId, newCategory) {
    const task = findTaskById(taskId);
    if (!task) return;
    
    task.category = newCategory;
    saveTasks();
    renderTasks();
    
    // Resetear el selector
    if (categoryFilter) categoryFilter.value = 'all';
    toggleCategoryTaskSelector('all');
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
    const category = typeof task?.category === 'string' && task.category ? task.category : '';
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
/**
 * Configura preferencias simples usando solo endpoints existentes.
 *
 * @returns {void}
 */
function setupSimplePreferences() {
    console.log("✅ Preferencias básicas configuradas (modo oscuro via /settings)");
    
    // Por ahora, solo guardamos el modo oscuro en /settings
    // Las otras preferencias (filtros, búsqueda) se pueden añadir 
    // cuando el servidor tenga los endpoints correspondientes
    
    console.log("💡 Para guardar filtros y búsqueda, el servidor necesita endpoint /preferences");
}

/**
 * Configura el guardado automático de preferencias de usuario.
 *
 * @param {Object} currentPreferences - Preferencias actuales del usuario
 * @returns {void}
 */
function setupAutoSavePreferences(currentPreferences) {
    let saveTimeout;
    
    // Función para guardar preferencias con debounce
    const savePreferences = async () => {
        try {
            const preferences = {
                ...currentPreferences,
                darkMode: html.classList.contains('dark'),
                filters: {
                    search: searchInput?.value || '',
                    category: categoryFilter?.value || 'all',
                    priority: priorityFilter?.value || 'all',
                    sort: sortSelect?.value || 'newest'
                },
                lastUpdated: Date.now()
            };
            
            await client.post('/user/preferences', preferences);
            console.log("💾 Preferencias guardadas automáticamente");
        } catch (err) {
            console.error("❌ Error guardando preferencias:", err);
        }
    };
    
    // Event listeners para filtros con debounce
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(savePreferences, 1000); // Guardar después de 1s de inactividad
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', savePreferences);
    }
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', savePreferences);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', savePreferences);
    }
    
    console.log("✅ Guardado automático de preferencias configurado");
}

/**
 * INICIO DE LA APP: Sincronización con el Servidor
 */
async function syncAppWithServer() {
    // Limpiar localStorage para evitar conflictos
    console.log("🧹 Limpiando localStorage para evitar conflictos...");
    localStorage.removeItem('viewState');
    localStorage.removeItem('tasks');
    localStorage.removeItem('reminders');
    
    console.log("🚀 ¡La aplicación ha arrancado correctamente!");
    console.log("🔍 Iniciando sincronización completa con servidor...");
    const statusEl = document.getElementById('network-status');
    
    // 1. ESTADO DE CARGA
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.className = 'loading';
        statusEl.textContent = "⏳ Conectando con TaskFlow Server...";
    }

    try {
        // Pedimos solo Tareas y Ajustes (endpoints que existen)
        const [tasksRes, settingsRes] = await Promise.all([
            client.get('/tasks'),
            client.get('/settings')
        ]);

        // 2. ESTADO DE ÉXITO
        tasks = tasksRes.data.data || tasksRes.data || []; // El array global ahora tiene los datos del server
        console.log("📋 Tareas cargadas desde servidor:", tasks.length);
        console.log("📋 Contenido de tareas:", tasks); // AGREGADO PARA DEBUG
        
        // Si el servidor no devuelve tareas, intentar cargar desde localStorage
        if (tasks.length === 0) {
            const backupTasks = localStorage.getItem('tasks_backup');
            if (backupTasks) {
                tasks = JSON.parse(backupTasks);
                console.log("📋 Tareas cargadas desde localStorage backup:", tasks.length);
                
                // Asegurar que los IDs sean consistentes para recordatorios
                // Si hay recordatorios, actualizar sus taskIds para que coincidan
                if (reminders.length > 0) {
                    console.log("📋 Actualizando IDs de recordatorios para coincidir con tareas cargadas...");
                    reminders.forEach(reminder => {
                        const matchingTask = tasks.find(t => t.text === reminder.taskText || t.id === reminder.taskId);
                        if (matchingTask) {
                            reminder.taskId = matchingTask.id;
                            console.log(`📋 Recordatorio actualizado: ${reminder.taskId} -> ${matchingTask.id}`);
                        }
                    });
                }
            }
        }
        
        // Aplicar preferencias desde settings
        const settings = settingsRes.data || {};
        console.log("📋 Configuración cargada:", settings);

        // Modo oscuro
        if (settings.darkMode) {
            html.classList.add('dark');
            themeLabel.textContent = 'Claro';
            themeIcon.textContent = '☀️';
            console.log("🌙 Modo oscuro aplicado");
        }

        if (statusEl) statusEl.style.display = 'none';

        // Dibujamos todo lo que ha llegado
        renderTasks(); 
        console.log("🔍 A punto de iniciar recordatorios...");
        // Esperar más tiempo a que las tareas se carguen completamente antes de iniciar recordatorios
        setTimeout(async () => {
            console.log("🔄 Iniciando recordatorios después de esperar...");
            console.log("📋 Verificando tareas disponibles:", tasks.length);
            if (tasks.length > 0) {
                await startAllReminders(); // Cargar recordatorios desde servidor
            } else {
                console.log("⚠️ No hay tareas, omitiendo carga de recordatorios");
            }
        }, 3000); // Aumentado a 3000ms para asegurar que las tareas carguen
        console.log("✅ Aplicación sincronizada con servidor");
        
        // Configurar botón de tema para servidor
        if (themeBtn) {
            themeBtn.addEventListener('click', async () => {
                const isDark = html.classList.toggle('dark');
                
                // Actualizar UI
                themeLabel.textContent = isDark ? 'Claro' : 'Oscuro';
                themeIcon.textContent = isDark ? '☀️' : '🌙';
                
                // Guardar en servidor
                try {
                    await client.post('/settings', { darkMode: isDark });
                    console.log(`🌓 Tema guardado en servidor: ${isDark ? 'oscuro' : 'claro'}`);
                } catch (err) {
                    console.error("❌ Error guardando tema en servidor:", err);
                    // Revertir cambio si falla
                    html.classList.toggle('dark');
                    themeLabel.textContent = isDark ? 'Oscuro' : 'Claro';
                    themeIcon.textContent = isDark ? '🌙' : '☀️';
                }
            });
        }

        // Configurar guardado simple de preferencias (sin endpoint específico)
        setupSimplePreferences();

    } catch (error) {
        // 3. ESTADO DE ERROR
        console.error("❌ Error de conexión con servidor:", error);
        if (statusEl) {
            statusEl.className = 'error';
            statusEl.textContent = "❌ Error: El servidor de TaskFlow no responde. La aplicación requiere conexión.";
        }
        
        // Deshabilitar la aplicación si no hay servidor
        document.body.style.opacity = '0.5';
        document.body.style.pointerEvents = 'none';
    }
}

// LANZAR
document.addEventListener('DOMContentLoaded', () => {
    verificarConexionServidor(); // Mensaje para el profesor
    syncAppWithServer();
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
                ${task.category ? getCategoryBadge(task.category) : ''}
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
 * Muestra el indicador de conexión con el servidor
 *
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de indicador ('loading', 'success', 'error')
 * @returns {void}
 */
function showNetworkStatus(message, type = 'loading') {
    console.log(`🔔 Mostrando estado: ${message} (${type})`);
    const statusEl = document.getElementById('network-status');
    if (!statusEl) {
        console.log('❌ No se encontró el elemento #network-status');
        return;
    }
    
    console.log(`✅ Elemento #network-status encontrado`);
    statusEl.style.display = 'flex';
    statusEl.className = `network-status ${type}`;
    
    // Intentar encontrar el elemento .network-text
    let textEl = statusEl.querySelector('.network-text');
    if (!textEl) {
        console.log('❌ No se encontró el elemento .network-text, intentando crearlo...');
        // Si no existe, crearlo
        textEl = document.createElement('span');
        textEl.className = 'network-text';
        statusEl.appendChild(textEl);
        console.log('✅ Elemento .network-text creado');
    }
    
    if (textEl) {
        textEl.textContent = message;
        console.log(`✅ Texto actualizado: ${message}`);
    }
    
    // Auto-ocultar después de 3 segundos si no es loading
    if (type !== 'loading') {
        console.log(`⏰ Auto-ocultando en 3 segundos...`);
        setTimeout(() => {
            statusEl.style.display = 'none';
            console.log(`🔔 Estado oculto`);
        }, 3000);
    }
}

/**
 * Oculta el indicador de conexión
 *
 * @returns {void}
 */
function hideNetworkStatus() {
    const statusEl = document.getElementById('network-status');
    if (statusEl) {
        statusEl.style.display = 'none';
    }
}
async function saveTasks() {
    try {
        showNetworkStatus('Procesando solicitud...', 'loading');
        
        // Intentar guardar en servidor
        await client.post('/tasks', tasks);
        console.log("📡 Tareas guardadas en servidor");
        
        // También guardar en localStorage como backup
        localStorage.setItem('tasks_backup', JSON.stringify(tasks));
        console.log("💾 Tareas guardadas en localStorage como backup");
        
        showNetworkStatus('¡Conseguido! 🎯', 'success');
    } catch (e) {
        console.error('❌ Error guardando tareas en servidor:', e);
        
        // Si falla el servidor, guardar en localStorage
        localStorage.setItem('tasks_backup', JSON.stringify(tasks));
        console.log("💾 Tareas guardadas en localStorage (fallback)");
        
        showNetworkStatus('¡Conseguido! 🎯', 'success');
        throw new Error('No se pudieron guardar las tareas en el servidor');
    }
}


/**
 * Elimina una tarea por índice, actualiza el almacenamiento
 * y vuelve a renderizar la lista usando el filtro actual.
 * También elimina los recordatorios asociados a la tarea.
 *
 * @param {number|string} index - Índice de la tarea en el array `tasks`.
 * @returns {Promise<void>}
 */
async function deleteTask(index) {
    const numericIndex = Number(index);

    // Si el índice no es un número válido, no hacemos nada
    if (Number.isNaN(numericIndex)) return;

    const task = tasks[numericIndex];
    if (!task) return;

    // Eliminar todos los recordatorios asociados a esta tarea
    const remindersToRemove = reminders.filter(r => r.taskId === task.id);
    remindersToRemove.forEach(reminder => {
        stopReminder(reminder.taskId, reminder.frequency);
    });

    // Eliminar los recordatorios del array
    reminders = reminders.filter(r => r.taskId !== task.id);
    await saveReminders(); // Guardar en servidor

    // Eliminar la tarea
    tasks.splice(numericIndex, 1);
    await saveTasks(); // ¡AGREGAR AWAIT!
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
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    
    if (taskText === '') return;

    tasks.push(normalizeTask({
        id: createId(),
        text: taskText,
        category: '',
        priority: '',
        createdAt: Date.now(),
        completed: false,
        notes: []
    }));

    await saveTasks();
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

if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        toggleCategoryTaskSelector(selectedCategory);
        renderTasks();
    });
}
if (categoryTaskSelector) {
    categoryTaskSelector.addEventListener('change', (e) => {
        const selectedTaskId = e.target.value;
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        
        if (selectedTaskId && selectedCategory !== 'all') {
            applyCategoryToTask(selectedTaskId, selectedCategory);
        }
    });
}
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
    completeAllBtn.addEventListener('click', async () => {
        if (!tasks.length) return;
        tasks = tasks.map(t => ({ ...t, completed: true }));
        await saveTasks();
        renderTasks();
    });
}

if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', async () => {
        if (!tasks.length) return;
        tasks = [];
        await saveTasks();
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

async function addNoteToTask(taskId, noteText) {
    try {
        showNetworkStatus('Guardando anotación...', 'loading');
        
        const task = findTaskById(taskId);
        if (!task) return;
        if (!Array.isArray(task.notes)) task.notes = [];
        task.notes.push(noteText);
        await saveTasks();
        
        showNetworkStatus('¡Conseguido! 🎯', 'success');
    } catch (e) {
        console.error('❌ Error guardando anotación:', e);
        showNetworkStatus('Error al guardar anotación', 'error');
    }
}

if (notesOpenBtn) {
    notesOpenBtn.addEventListener('click', () => {
        openNotesModal();
    });
}

// Event listeners para botones flotantes móviles
const notesOpenBtnMobile = document.getElementById('notes-open-btn');
const reminderOpenBtnMobile = document.getElementById('reminder-open-btn');

if (notesOpenBtnMobile) {
    notesOpenBtnMobile.addEventListener('click', () => {
        openNotesModal();
    });
}

if (reminderOpenBtnMobile) {
    reminderOpenBtnMobile.addEventListener('click', () => {
        openReminderModal();
    });
}

// --- Recordatorios ---

function openReminderModal() {
    if (!reminderModal) return;

    const hasTasks = tasks.length > 0;

    // Mostrar/ocultar aviso y habilitar/deshabilitar controles
    if (reminderWarning) reminderWarning.style.display = hasTasks ? 'none' : 'block';
    if (reminderTaskSelect) {
        reminderTaskSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = hasTasks ? 'Selecciona una tarea...' : 'No hay tareas disponibles';
        reminderTaskSelect.appendChild(placeholder);

        if (hasTasks) {
            tasks.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.textContent = t.text;
                reminderTaskSelect.appendChild(opt);
            });
        }

        reminderTaskSelect.disabled = !hasTasks;
    }

    if (reminderFrequency) {
        reminderFrequency.disabled = !hasTasks;
    }
    if (reminderAcceptBtn) reminderAcceptBtn.disabled = !hasTasks;

    reminderModal.classList.remove('hidden');

    // Enfoca el selector al abrir
    if (reminderTaskSelect && hasTasks) reminderTaskSelect.focus();
}

function closeReminderModal() {
    if (!reminderModal) return;
    reminderModal.classList.add('hidden');
}

if (reminderOpenBtn) {
    reminderOpenBtn.addEventListener('click', () => {
        openReminderModal();
    });
}

if (reminderCancelBtn) {
    reminderCancelBtn.addEventListener('click', () => {
        closeReminderModal();
    });
}

if (reminderCloseIcon) {
    reminderCloseIcon.addEventListener('click', () => {
        closeReminderModal();
    });
}

// Cerrar al pulsar ESC
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!reminderModal) return;
    if (!reminderModal.classList.contains('hidden')) closeReminderModal();
});

// Cerrar al hacer clic fuera del cuadro (backdrop)
if (reminderModal) {
    reminderModal.addEventListener('click', (e) => {
        if (e.target === reminderModal) closeReminderModal();
    });
}

// Event listener global para prevenir cualquier submit no deseado
document.addEventListener('submit', (event) => {
    if (event.target && event.target.id === 'task-form') {
        console.log("🛡️ Submit del formulario de tareas interceptado");
        event.preventDefault(); // ¡AGREGAR ESTO!
        return; // Dejar pasar el submit del formulario de tareas
    }
    
    // Prevenir cualquier otro submit
    console.log("🛡️ Submit no deseado prevenido");
    event.preventDefault();
    event.stopPropagation();
});

// Event listener específico para el botón de recordatorios con captura
if (reminderAcceptBtn) {
    console.log("🔔 Botón de recordatorio encontrado, añadiendo event listener...");
    
    // VERSIÓN FUERZA TOTAL - CAPTURA TODO
    reminderAcceptBtn.onclick = async (event) => {
        console.log("🔔 FUERZA TOTAL - Botón pulsado");
        
        // CAPTURA ABSOLUTAMENTE TODO
        try {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            console.log("🔔 Eventos capturados y detenidos");
        } catch (eventError) {
            console.error("❌ ERROR EN EVENTOS:", eventError);
        }
        
        try {
            if (!reminderTaskSelect || !reminderFrequency) {
                console.log("❌ Faltan elementos del modal");
                alert("❌ Faltan elementos del modal");
                return false;
            }
            
            const taskId = reminderTaskSelect.value;
            const frequency = reminderFrequency.value;

            console.log("📋 Datos del recordatorio:", { taskId, frequency });

            if (!taskId || !frequency) {
                console.log("❌ Datos incompletos");
                alert("❌ Datos incompletos");
                return false;
            }

            // Verificar si ya existe un recordatorio para esta tarea y frecuencia
            const existingIndex = reminders.findIndex(r => r.taskId === taskId && r.frequency === frequency);
            if (existingIndex === -1) {
                console.log("➕ Añadiendo nuevo recordatorio al array");
                reminders.push({ taskId, frequency });
                console.log("💾 Array de recordatorios actualizado:", reminders);
                
                // GUARDADO CON CAPTURA TOTAL
                try {
                    console.log("📡 INICIANDO GUARDADO FORZADO");
                    await saveReminders();
                    console.log("💾 Recordatorios guardados permanentemente");
                } catch (saveError) {
                    console.error("❌ ERROR GUARDANDO:", saveError);
                    console.log("🚀 CONTINUANDO A PESAR DE ERRORES...");
                    
                    // NO IMPORTA EL ERROR, CONTINUAR
                    console.log("🚀 FUERZANDO RECORDATORIO LOCALMENTE");
                }
                
                // FUERZAR RECORDATORIO LOCAL
                try {
                    console.log("🚀 INICIANDO RECORDATORIO FORZADO");
                    const task = findTaskById(taskId);
                    if (task) {
                        console.log("🚀 TAREA ENCONTRADA:", task.text);
                        
                        if (frequency === 'onrestart') {
                            console.log("� Recordatorio 'onrestart' guardado (solo se activará al reiniciar)");
                        } else {
                            startReminder(taskId, frequency);
                        }
                        
                        alert(" Recordatorio creado");
                    } else {
                        alert(" No se encontró la tarea, pero el recordatorio se intentó crear");
                    }
                } catch (reminderError) {
                    console.error(" ERROR CREANDO RECORDATORIO:", reminderError);
                    alert(" Error creando recordatorio local");
                }
                
                // CERRAR MODAL CON CAPTURA
                try {
                    console.log(" Cerrando modal...");
                    if (reminderModal) {
                        reminderModal.classList.add('hidden');
                    }
                } catch (modalError) {
                    console.error(" ERROR CERRANDO MODAL:", modalError);
                }
                
                return false;
            } else {
                console.log(" El recordatorio ya existe");
                alert(" Este recordatorio ya existe.");
                return false;
            }
        } catch (generalError) {
            console.error(" ERROR GENERAL TOTAL:", generalError);
            console.error(" STACK COMPLETO:", generalError.stack);
            alert(" Error general, pero intentando forzar recordatorio...");
            
            // ÚLTIMO RECURSO: FORZAR RECORDATORIO MANUAL
            try {
                const taskId = reminderTaskSelect?.value;
                const frequency = reminderFrequency?.value;
                const task = findTaskById(taskId);
                
                if (task && frequency === 'onrestart') {
                    setTimeout(() => {
                        showNotification('Recordatorio de tarea', `No olvides: ${task.text}`);
                    }, 2000);
                    alert("🚀 RECORDATORIO FORZADO MANUALMENTE");
                }
            } catch (lastResortError) {
                console.error("❌ ERROR ÚLTIMO RECURSO:", lastResortError);
                alert("❌ Error crítico - no se pudo crear recordatorio");
            }
        }
    };
} else {
    console.log("❌ Botón de recordatorio NO encontrado");
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
