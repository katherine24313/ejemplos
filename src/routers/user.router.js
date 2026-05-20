import { Router } from "express";
import UserController from "../controller/user.controller.js"
import UserScheme from "../schemes/user.schema.js"
import userMiddleware from "../middlewares/user.middleware.js";
import verifyToken from "../middlewares/jwt.middleware.js";
import userSchema from "../schemes/user.schema.js";


const router = Router();

router.post("/user", userMiddleware(UserScheme.createUser), UserController.createUser);
router.get("/user", verifyToken, UserController.showUser);
router.get("/user", verifyToken, UserController.showUserId);
router.put("/user", verifyToken, userMiddleware(UserScheme.updateUser), UserController.createUser);
router.delete("/user", verifyToken, UserController.deleteUser);
router.post("/user/login", UserController.loginUser);

export default router;