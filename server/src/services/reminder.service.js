const fs = require('fs').promises;
const path = require('path');

const REMINDERS_FILE = path.join(__dirname, '../../data/reminders.json');

// Asegurar que el directorio data existe
const ensureDataDir = async () => {
    const dataDir = path.dirname(REMINDERS_FILE);
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
};

// Cargar recordatorios desde archivo
const loadReminders = async () => {
    await ensureDataDir();
    
    try {
        const data = await fs.readFile(REMINDERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe, devolver array vacío
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

// Guardar recordatorios en archivo
const saveReminders = async (reminders) => {
    await ensureDataDir();
    
    try {
        // Validar que reminders sea un array
        if (!Array.isArray(reminders)) {
            throw new Error('reminders debe ser un array');
        }
        
        await fs.writeFile(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
        console.log("💾 Recordatorios guardados en archivo:", reminders.length);
    } catch (error) {
        console.error("❌ Error guardando recordatorios:", error);
        throw error;
    }
};

module.exports = {
    loadReminders,
    saveReminders
};
