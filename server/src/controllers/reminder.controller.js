import { saveReminders, loadReminders } from '../services/reminder.service.js';

// GET /api/v1/reminders - Obtener todos los recordatorios
const getReminders = async (req, res) => {
    try {
        const reminders = await loadReminders();
        res.json({ data: reminders });
    } catch (error) {
        console.error('Error al obtener recordatorios:', error);
        res.status(500).json({ message: 'Error al obtener recordatorios' });
    }
};

// POST /api/v1/reminders - Guardar recordatorios
const postReminders = async (req, res) => {
    try {
        console.log("🔍 CONTROLLER - req.body:", req.body);
        console.log("🔍 CONTROLLER - req.body.reminders:", req.body.reminders);
        
        let reminders;
        
        // Si viene un objeto con propiedad reminders, usarlo
        if (req.body && req.body.reminders && Array.isArray(req.body.reminders)) {
            reminders = req.body.reminders;
            console.log("🔍 CONTROLLER - Usando req.body.reminders:", reminders);
        }
        // Si viene directamente un array, usarlo
        else if (req.body && Array.isArray(req.body)) {
            reminders = req.body;
            console.log("🔍 CONTROLLER - Usando req.body directamente:", reminders);
        }
        // Si viene un objeto sin reminders, intentar extraer array
        else if (req.body && typeof req.body === 'object') {
            const values = Object.values(req.body);
            reminders = values.find(v => Array.isArray(v)) ? values.find(v => Array.isArray(v)) : [];
            console.log("🔍 CONTROLLER - Extraído de objeto:", reminders);
        }
        // Si no viene nada, error
        else {
            console.log("🔍 CONTROLLER - No se pudo extraer array de:", req.body);
            return res.status(400).json({ 
                message: 'Se debe enviar un array de recordatorios' 
            });
        }
        
        if (!Array.isArray(reminders)) {
            return res.status(400).json({ 
                message: 'Se debe enviar un array de recordatorios válido' 
            });
        }
        
        console.log("🔍 CONTROLLER - Array final a guardar:", reminders);
        await saveReminders(reminders);
        res.json({ 
            message: 'Recordatorios guardados exitosamente',
            data: reminders 
        });
    } catch (error) {
        console.error('Error al guardar recordatorios:', error);
        res.status(500).json({ message: 'Error al guardar recordatorios' });
    }
};

export {
    getReminders,
    postReminders
};
