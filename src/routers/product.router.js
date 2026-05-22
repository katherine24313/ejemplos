const { Router } = require("express");
const {
  getAllproduct,
  getProductById,
  getProductsBycategory,
  createroduct,
  updateproduct,
  deleteproduct
} = require("../controller/product.controller");

const router = Router(); // Instancia del Router de Express

// ─── Rutas de Productos ───────────────────────────────────────────────────────

// GET    /api/products                        → Listar todos los productos (con categoría)
router.get("/", getAllProducts);

// GET    /api/products/category/:categoryId   → Filtrar productos por categoría
// IMPORTANTE: esta ruta va ANTES de /:id para evitar conflictos de parámetros
router.get("/category/:categoryId", getProductsByCategory);

// GET    /api/products/:id                    → Obtener un producto por ID
router.get("/:id", getProductById);

// POST   /api/products                        → Crear un nuevo producto
// Body esperado: { name, price, description?, stock?, image_url?, category_id?, status? }
router.post("/", createProduct);

// PUT    /api/products/:id                    → Actualizar un producto existente
// Body esperado: cualquier campo a actualizar
router.put("/:id", updateProduct);

// DELETE /api/products/:id                    → Eliminar un producto por ID
router.delete("/:id", deleteProduct);

module.exports = router;
