const { PORT } = require('./config/env');
const express = require('express');
const app = express();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
