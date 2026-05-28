// ─── controllers/category.controller.js ──────────────────────────────────────
// Controlador con operaciones CRUD completas para el módulo de Categorías.
// Cada función maneja una operación HTTP y responde con JSON.

import Category from "../models/category.model.js";

const buildCategoryTree = (categories) => {
  const map = new Map();

  categories.forEach((category) => {
    map.set(category.id, { ...category, subcategories: [] });
  });

  const tree = [];
  categories.forEach((category) => {
    if (category.parent_id) {
      const parent = map.get(category.parent_id);
      if (parent) {
        parent.subcategories.push(map.get(category.id));
      }
    } else {
      tree.push(map.get(category.id));
    }
  });

  return tree;
};

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

export const getAllCategoryTree = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["created_at", "DESC"]]
    });

    const tree = buildCategoryTree(categories.map((category) => category.toJSON()));

    return res.status(200).json({
      success: true,
      message: "Categorías obtenidas en forma de árbol",
      total: categories.length,
      data: tree
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
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: "parent",
          attributes: ["id", "name", "status", "parent_id"]
        },
        {
          model: Category,
          as: "subcategories",
          attributes: ["id", "name", "status", "parent_id"]
        }
      ]
    });

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
    const { name, description, status, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El campo 'name' es obligatorio"
      });
    }

    if (parent_id) {
      const parent = await Category.findByPk(parent_id);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: `Categoría padre con id ${parent_id} no encontrada`
        });
      }
    }

    const newCategory = await Category.create({
      name,
      description,
      status: status ?? "active",
      parent_id
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

const isCircularParent = async (categoryId, parentId) => {
  let parent = await Category.findByPk(parentId);
  while (parent) {
    if (parent.id === categoryId) {
      return true;
    }
    if (!parent.parent_id) {
      break;
    }
    parent = await Category.findByPk(parent.parent_id);
  }
  return false;
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

    const { name, description, status, parent_id } = req.body;

    if (parent_id !== undefined) {
      if (Number(parent_id) === Number(id)) {
        return res.status(400).json({
          success: false,
          message: "Una categoría no puede ser su propia subcategoría"
        });
      }

      const parent = await Category.findByPk(parent_id);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: `Categoría padre con id ${parent_id} no encontrada`
        });
      }

      if (await isCircularParent(Number(id), Number(parent_id))) {
        return res.status(400).json({
          success: false,
          message: "No se puede asignar una categoría hija como padre"
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (parent_id !== undefined) updateData.parent_id = parent_id;

    await category.update(updateData);

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

    const childCount = await Category.count({ where: { parent_id: id } });
    if (childCount > 0) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar la categoría porque tiene subcategorías"
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