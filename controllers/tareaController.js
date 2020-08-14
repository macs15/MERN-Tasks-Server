const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

// Crea una nueva tarea
exports.crearTarea = async (req, res) => {

     // revisar si hay errores
     const errores = validationResult(req);
     // si errores no esta vacío entonces devolver un json con los errores
     if( !errores.isEmpty() ) {
         return res.status(400).json({ errores: errores.array() })
     }

     // Extraer el proyecto y comprobar si existe
    const { proyecto } = req.body;

        try {

            const existeProyecto = await Proyecto.findById(proyecto);
            if(!existeProyecto){
                return res.status(404).json({ msg: 'Proyecto no encontrado' });
            }

            // Revisar si el proyecto actual pertenece al usuario autenticado
            if( existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
            }

            // Creamos la tarea
            const tarea = new Tarea(req.body);
            await tarea.save();
            res.json({ tarea });

        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error')
     }
};

// obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {

      // Extraer el proyecto y comprobar si existe
      const { proyecto } = req.query; // usamos req.query porque el req desde axios lo enviamos por params
      try {

          const existeProyecto = await Proyecto.findById(proyecto);
          if(!existeProyecto){
              return res.status(404).json({ msg: 'Proyecto no encontrado' });
          }

          // Revisar si el proyecto actual pertenece al usuario autenticado
          if( existeProyecto.creador.toString() !== req.usuario.id ) {
          return res.status(401).json({ msg: 'No autorizado' });
          }

          // Obtener las tareas por proyecto
          const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
          res.json({ tareas });

      } catch (error) {
          console.log(error);
          res.status(500).send('Hubo un error')
   }
};

// actualizar una tarea]
exports.actualizarTarea = async (req, res) => {
    
    // Extraer el proyecto y comprobar si existe
    const { proyecto, nombre, estado } = req.body;

    try {

        // Si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if( existeProyecto.creador.toString() !== req.usuario.id ) {
        return res.status(401).json({ msg: 'No autorizado' });
        }

        // crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar tarea editada
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });

        res.json({ tarea });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Elimina una tarea
exports.eliminarTarea = async (req, res) => {
     // Extraer el proyecto y comprobar si existe
     const { proyecto } = req.query; // usamos query porque enviamos por params en axios

     try {
 
         // Si la tarea existe o no
         let tarea = await Tarea.findById(req.params.id);
 
         if(!tarea) {
             return res.status(404).json({ msg: 'No existe esa tarea' });
         }
 
         const existeProyecto = await Proyecto.findById(proyecto);
 
         // Revisar si el proyecto actual pertenece al usuario autenticado
         if( existeProyecto.creador.toString() !== req.usuario.id ) {
         return res.status(401).json({ msg: 'No autorizado' });
         }
 
         // Eliminar
         await Tarea.findOneAndRemove({_id: req.params.id });
         res.json({ msg: 'Tarea eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}