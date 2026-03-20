const express = require('express');
const router = express.Router();
const { getReminders, postReminders } = require('../controllers/reminder.controller');

// GET /api/v1/reminders - Obtener todos los recordatorios
router.get('/', getReminders);

// POST /api/v1/reminders - Guardar recordatorios
router.post('/', postReminders);

module.exports = router;
