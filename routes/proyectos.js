const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crea proyectos
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto 
);

// obtiene todos los proyectos creados por el usuario
router.get('/',
    auth,
    proyectoController.obtenerProyectos 
);

// actualiza un proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto 
);

// Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto 
);

module.exports = router;