const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


exports.crearProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    // si errores no esta vacío entonces devolver un json con los errores
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // guardamos el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
};

// obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {

    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });

        res.json({proyectos});
    } catch(error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    // si errores no esta vacío entonces devolver un json con los errores
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado '});
        }

        // verificar el creador del proyecto
        if( proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, {$set: nuevoProyecto}, {new: true});

        res.json({proyecto});
    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor');
    }
}

// Eliminar un proyecto por ID
exports.eliminarProyecto = async (req, res) => {
    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado '});
        }

        // verificar el creador del proyecto
        if( proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Eliminar el Proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto Eliminado'});
    } catch (error) {
        console.log(error)
        res.status(500).send('Error en el servidor');
    }

};