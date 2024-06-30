import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./controllers/user.controller.js";
const app = express();
dotenv.config();
mongoose
  .connect(process.env.URI)
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("app running successfully");
});

app.use("/api/user", userRoutes);
