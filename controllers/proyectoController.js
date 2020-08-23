const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario.id;
    proyecto.save();
    res.json(proyecto);
  } catch (e) {
    console.log(e);
    res.status(500).send("hubo un error");
  }
};

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
exports.actualizarProyecto = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    let proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.json({ msg: "No autorizado" });
    }
    proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
    res.json({ nuevoProyecto });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Hubo un error");
  }
};

exports.eliminarProyecto = async (req, res) => {
  try {
    let proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.json({ msg: "No autorizado" });
    }
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto eliminado" });
  } catch (e) {
    return res.status(500).send("Hubo un error");
  }
};
