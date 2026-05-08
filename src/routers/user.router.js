import { Router } from "express";

const router = Router();

router.get("/user", (req, res) => {
    res.send("Thisis user Get");
});

export default router;