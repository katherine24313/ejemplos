// ─── controllers/category.controller.js ──────────────────────────────────────
// Controlador con operaciones CRUD completas para el módulo de Categorías.
// Cada función maneja una operación HTTP y responde con JSON.

const Category = require("../models/category.model");

// ─── GET /api/categories ──────────────────────────────────────────────────────
// Obtiene todas las categorías registradas en la base de datos.
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["created_at", "DESC"]]  // Más recientes primero
    });

    return res.status(200).json({
      success: true,
      message: "Categorías obtenidas correctamente",
      total: categories.length,
      data: categories
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};