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
        const { reminders } = req.body;
        
        if (!Array.isArray(reminders)) {
            return res.status(400).json({ 
                message: 'El campo reminders debe ser un array' 
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
