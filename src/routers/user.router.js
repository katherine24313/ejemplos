import { Router } from "express";
import { createUser, showUser, showUserId, updateUser, deleteUser, loginUser } from "../controller/user.controller.js";
import UserController from "../controller/user.controller.js";
import userMiddlewares from "../middlewares/user.middlewares.js"; // ✅ Es userMiddlewares (plural)
import User from "../models/user.model.js";
import userSchema from "../schemes/user.schema.js"; // ✅ Es userSchema (con 'a')
import verifyToken from "../middlewares/user.middlewares.js";

const router = Router();

// Cambiar userMiddleware → userMiddlewares
// Cambiar userScheme → userSchema
router.post("/user", userMiddlewares(userSchema.createUser), UserController.createUser);
router.get("/user", verifyToken, UserController.showUser);
router.get("/user/:id", verifyToken, UserController.showUserId); // ✅ Agregar :id
router.put("/user", verifyToken, userMiddlewares(userSchema.updateUser), UserController.updateUser);
router.delete("/user", verifyToken, UserController.deleteUser);
router.post("/user/login", UserController.loginUser);

export default router;