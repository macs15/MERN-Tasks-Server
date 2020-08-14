const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    // si errores no esta vacío entonces devolver un json con los errores
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extraer el email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario) {
            return res.status(400).json(({ msg: 'El usuario no existe' }));
        }
        
        // revisar el password
        const passCorrecto = await bcrypt.compare(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({ msg: 'Password incorrecto' });
        }

        // si todo es correcto
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
        console.log(error)
    }
};

// obitene el usuario que esta autenticado
exports.usuarioAutenticado = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password'); // dejhamos el password por fuerta en la respuesta
        res.json({usuario});
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error'});
    }
}