const { saveReminders, loadReminders } = require('../services/reminder.service');

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
        
        // Extraer el array de recordatorios de cualquier forma
        let reminders = [];
        
        if (req.body && req.body.reminders && Array.isArray(req.body.reminders)) {
            reminders = req.body.reminders;
        } else if (req.body && Array.isArray(req.body)) {
            reminders = req.body;
        } else if (req.body && typeof req.body === 'object') {
            const values = Object.values(req.body);
            reminders = values.find(v => Array.isArray(v)) || [];
        }
        
        console.log("🔍 CONTROLLER - Array final:", reminders);
        
        if (!Array.isArray(reminders)) {
            return res.status(400).json({ 
                message: 'Se debe enviar un array de recordatorios' 
            });
        }
        
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

module.exports = {
    getReminders,
    postReminders
};
