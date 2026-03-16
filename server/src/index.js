const { PORT } = require('./config/env');
const express = require('express');
const app = express();
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor está funcionando perfectamente 🚀');
});
// -----------------------

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
