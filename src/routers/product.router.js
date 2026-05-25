import { Router } from "express";
import ProductController from "../controller/product.controller.js";

const router = Router();

router.get("/products", ProductController.getAllProducts);
router.get("/products/category/:categoryId", ProductController.getProductsByCategory);
router.get("/products/:id", ProductController.getProductById);
router.post("/products", ProductController.createProduct);
router.put("/products/:id", ProductController.updateProduct);
router.delete("/products/:id", ProductController.deleteProduct);

export default router;
