// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

// Crea un usuario
// api/usuarios -ruta que viene ya desde el index- ruta final /api/usuarios/
router.post('/', 
    [
        check('nombre', 'El nombre es obligatiorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 }),
    ],
    usuarioController.crearUsuario
);

module.exports = router;