const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});

// creando la conexion con mongoDB
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.BD_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB conectada');
    } catch (error) {
        console.log(error)
        process.exit(1); // Detener la app en caso de error de conexion
    }
}

module.exports = conectarDB;