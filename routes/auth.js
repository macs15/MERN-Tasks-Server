// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Logea a un usuario
// api/auth
router.post('/', 
    [
        check('email', 'Agrega un email válido').isEmail()
    ],
    authController.autenticarUsuario
);

router.get('/',
    auth,
    authController.usuarioAutenticado    
)

module.exports = router;