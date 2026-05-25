import { Router } from "express";
import { createByDocument } from "../controller/assignment.controller.js";

const router = Router();

router.post("/insert-by-document", createByDocument);

export default router;