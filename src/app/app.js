import express from "express";
import morgan from "morgan";
import userRouter from "../routers/user.router.js";
import UserStatusRouter from "../routers/userStatus.router.js";
import roleRouter from "../routers/role.router.js";
import assignmentRouter from "../routers/assignment.router.js";
import productRouter from "../routers/product.router.js";
import categoryRouter from "../routers/category.router.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", userRouter);
app.use("/api/v1", UserStatusRouter);
app.use("/api/v1", roleRouter);
app.use("/api/v1", assignmentRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1/categories", categoryRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint losses"
  });
});

export default app;