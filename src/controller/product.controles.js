// ─── controllers/product.controller.js ───────────────────────────────────────
// Controlador con operaciones CRUD completas para el módulo de Productos.
// Incluye la categoría asociada en las consultas (JOIN con Sequelize).

const Product = require("../models/product.model");
const Category = require("../models/category.model");

// ─── GET /api/products ────────────────────────────────────────────────────────
// Obtiene todos los productos. Incluye la información de su categoría (JOIN).
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",                        // Alias definido en la asociación
          attributes: ["id", "name", "status"]  // Solo traemos estos campos de Category
        }
      ],
      order: [["created_at", "DESC"]]           // Los más recientes primero
    });

    return res.status(200).json({
      success: true,
      message: "Productos obtenidos correctamente",
      total: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
// Obtiene un producto específico por su ID, incluyendo su categoría.
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "description", "status"]
        }
      ]
    });

    // Si no se encuentra el producto, retornamos 404
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${id} no encontrado`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Producto encontrado",
      data: product
    });
  } catch (error) {
    console.error("Error al obtener producto:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// ─── GET /api/products/category/:categoryId ───────────────────────────────────
// Obtiene todos los productos que pertenecen a una categoría específica.
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Verificamos que la categoría exista
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Categoría con id ${categoryId} no encontrada`
      });
    }

    // Traemos los productos filtrados por category_id
    const products = await Product.findAll({
      where: { category_id: categoryId },
      include: [{ model: Category, as: "category", attributes: ["id", "name"] }]
    });

    return res.status(200).json({
      success: true,
      message: `Productos de la categoría "${category.name}"`,
      total: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error al filtrar productos por categoría:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// ─── POST /api/products ───────────────────────────────────────────────────────
// Crea un nuevo producto con los datos del body.
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id, status } = req.body;

    // Validaciones básicas de campos obligatorios
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Los campos 'name' y 'price' son obligatorios"
      });
    }

    // Si se envía category_id, verificamos que esa categoría exista
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: `Categoría con id ${category_id} no encontrada`
        });
      }
    }

    // Creamos el producto en la base de datos
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,              // Si no envían stock, se guarda en 0
      image_url,
      category_id,
      status: status || "active"      // Si no envían status, queda activo
    });

    // Retornamos el producto creado con su categoría incluida
    const productWithCategory = await Product.findByPk(newProduct.id, {
      include: [{ model: Category, as: "category", attributes: ["id", "name"] }]
    });

    return res.status(201).json({     // 201 = Created
      success: true,
      message: "Producto creado exitosamente",
      data: productWithCategory
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map((e) => e.message)
      });
    }
    console.error("Error al crear producto:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
// Actualiza un producto existente. Solo modifica los campos enviados en el body.
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url, category_id, status } = req.body;

    // Verificamos que el producto exista
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${id} no encontrado`
      });
    }

    // Si se actualiza category_id, verificamos que la nueva categoría exista
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: `Categoría con id ${category_id} no encontrada`
        });
      }
    }

    // Actualizamos el producto (Sequelize solo modifica los campos enviados)
    await product.update({ name, description, price, stock, image_url, category_id, status });

    // Retornamos el producto actualizado con su categoría
    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: Category, as: "category", attributes: ["id", "name"] }]
    });

    return res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: updatedProduct
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map((e) => e.message)
      });
    }
    console.error("Error al actualizar producto:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
// Elimina un producto por su ID de forma permanente.
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos que el producto exista antes de eliminar
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Producto con id ${id} no encontrado`
      });
    }

    await product.destroy(); // Eliminación permanente de la BD

    return res.status(200).json({
      success: true,
      message: `Producto con id ${id} eliminado correctamente`
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Exportamos todas las funciones para usarlas en el router
module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};
