// ─── controllers/category.controller.js ──────────────────────────────────────
// Controlador con operaciones CRUD completas para el módulo de Categorías.
// Cada función maneja una operación HTTP y responde con JSON.

import Category from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["created_at", "DESC"]]
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

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Categoría con id ${id} no encontrada`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categoría encontrada",
      data: category
    });
  } catch (error) {
    console.error("Error al obtener categoría:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El campo 'name' es obligatorio"
      });
    }

    const newCategory = await Category.create({
      name,
      description,
      status: status ?? "active"
    });

    return res.status(201).json({
      success: true,
      message: "Categoría creada correctamente",
      data: newCategory
    });
  } catch (error) {
    console.error("Error al crear categoría:", error.message);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map((item) => item.message)
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Categoría con id ${id} no encontrada`
      });
    }

    const { name, description, status } = req.body;
    await category.update({ name, description, status });

    return res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente",
      data: category
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error.message);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map((item) => item.message)
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Categoría con id ${id} no encontrada`
      });
    }

    await category.destroy();
    return res.status(200).json({
      success: true,
      message: `Categoría con id ${id} eliminada correctamente`
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};