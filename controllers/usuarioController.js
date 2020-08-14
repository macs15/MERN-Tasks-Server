const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    // si errores no esta vacío entonces devolver un json con los errores
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extraer email y password
    const { email, password } = req.body;
    
    try {
        // Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        // comprobamos que el correo no este ya en uso
        if( usuario ) {
            return res.status(400).json({ msg: 'El usuario ya existe'});
        }

        // crear el nuevo usuario
        usuario = new Usuario(req.body);

        // hashear el password
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        // guardar usuario
        await usuario.save();

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmacion
            res.json({ token });
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
};