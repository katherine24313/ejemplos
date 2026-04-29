import { Router } from "express";

const userRouter = Router();

Router.get("/users", (req, res) => {
  res.send("this is user Get");
  });
export default router;