import express from "express";
import userRoutes from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", userRoutes);

export default router;
