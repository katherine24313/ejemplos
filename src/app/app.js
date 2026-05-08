import express from "express";
import userRouter from "../routers/user.router.js";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use("/api/v1",userRouter);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Endpoint losses"
  });
});

export default app;