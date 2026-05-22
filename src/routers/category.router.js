// ─── routers/category.router.js ──────────────────────────────────────────────
// Define las rutas HTTP para el módulo de Categorías.
// Cada ruta apunta a una función del controlador correspondiente.

const { Router } = require("express");
const {
  getAllcategories,
  getcategoryById,
  createcategory,
  updatecategory,
  deletecategory
} = require("../controller/category.controller");

const router = Router(); // Creamos una instancia del Router de Express

// ─── Rutas de Categorías ──────────────────────────────────────────────────────

// GET    /api/categories         → Listar todas las categorías
router.get("/", getAllCategories);

// GET    /api/categories/:id     → Obtener una categoría por ID
router.get("/:id", getCategoryById);

// POST   /api/categories         → Crear una nueva categoría
// Body esperado: { name, description?, status? }
router.post("/", createCategory);

// PUT    /api/categories/:id     → Actualizar una categoría existente
// Body esperado: { name?, description?, status? }
router.put("/:id", updateCategory);

// DELETE /api/categories/:id     → Eliminar una categoría por ID
router.delete("/:id", deleteCategory);

module.exports = router;
