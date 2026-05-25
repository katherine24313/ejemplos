import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

export const getAllProducts = async (req, res) => {
  try {
    await Product.sync();
    await Category.sync();

    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "status"]
        }
      ],
      order: [["id", "DESC"]]
    });

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Productos obtenidos correctamente",
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    await Product.sync();
    await Category.sync();

    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "status"]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: `Producto con id ${id} no encontrado`
      });
    }

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Producto encontrado",
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    await Product.sync();
    await Category.sync();

    const { categoryId } = req.params;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: `Categoría con id ${categoryId} no encontrada`
      });
    }

    const products = await Product.findAll({
      where: { category_id: categoryId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "status"]
        }
      ]
    });

    return res.status(200).json({
      ok: true,
      status: 200,
      message: `Productos de la categoría "${category.name}"`,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    await Product.sync();
    await Category.sync();

    const { name, description, price, stock, image_url, category_id, status } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Los campos 'name' y 'price' son obligatorios"
      });
    }

    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          ok: false,
          status: 404,
          message: `Categoría con id ${category_id} no encontrada`
        });
      }
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock: stock ?? 0,
      image_url,
      category_id,
      status: status ?? "active"
    });

    const productWithCategory = await Product.findByPk(newProduct.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"]
        }
      ]
    });

    return res.status(201).json({
      ok: true,
      status: 201,
      message: "Producto creado correctamente",
      data: productWithCategory
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Error de validación",
        errors: error.errors.map((item) => item.message)
      });
    }

    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    await Product.sync();
    await Category.sync();

    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: `Producto con id ${id} no encontrado`
      });
    }

    const { name, description, price, stock, image_url, category_id, status } = req.body;

    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          ok: false,
          status: 404,
          message: `Categoría con id ${category_id} no encontrada`
        });
      }
    }

    await product.update({
      name,
      description,
      price,
      stock,
      image_url,
      category_id,
      status
    });

    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"]
        }
      ]
    });

    return res.status(200).json({
      ok: true,
      status: 200,
      message: "Producto actualizado correctamente",
      data: updatedProduct
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        ok: false,
        status: 400,
        message: "Error de validación",
        errors: error.errors.map((item) => item.message)
      });
    }

    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.sync();

    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: `Producto con id ${id} no encontrado`
      });
    }

    await product.destroy();

    return res.status(200).json({
      ok: true,
      status: 200,
      message: `Producto con id ${id} eliminado correctamente`
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      status: 500,
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

const ProductController = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};

export default ProductController;
