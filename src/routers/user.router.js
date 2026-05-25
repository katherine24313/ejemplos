import { Router } from "express";
import UserController from "../controller/user.controller.js";
import userMiddlewares from "../middlewares/user.middleware.js";
import verifyToken from "../middlewares/jwt.middleware.js";
import userSchema from "../schemes/user.schema.js";

const router = Router();

router.post("/user", userMiddlewares(userSchema.createUser), UserController.createUser);
router.get("/user", verifyToken, UserController.showUser);
router.get("/user/:id", verifyToken, UserController.showUserId);
router.put("/user", verifyToken, userMiddlewares(userSchema.updateUser), UserController.updateUser);
router.delete("/user", verifyToken, UserController.deleteUser);
router.post("/user/login", UserController.loginUser);

export default router;