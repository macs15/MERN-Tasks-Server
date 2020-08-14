const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();

// conectar la base de datos
conectarDB();

// habilitar cors 
app.use(cors());

// habilitar express.json *obs: esto reemplaza al bodyParser()*
app.use(express.json({ extend: true }));

// importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// puerto de la app
const PORT = process.env.PORT || 4000;

// iniciar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});