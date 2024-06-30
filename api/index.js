import express, { urlencoded } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import signup from "./routes/auth.route.js";
const app = express();
app.use(express.json());
dotenv.config();
mongoose
  .connect(process.env.URI)
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("app running successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", signup);
