import { Router } from "express";
import { createUser, showUser, showUserId, updateUser, deleteUser, createUserfk } from "../controller/user.controller.js";

const router = Router();
router.post("/user", createUser);
router.post("/userfk", createUserfk);
router.get("/user", showUser);
router.get("/user/:id", showUserId);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;