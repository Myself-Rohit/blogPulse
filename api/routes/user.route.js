import express from "express";
import  {userRoutes, updateRoute } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", userRoutes);
router.put("/update/:userId",verifyToken,updateRoute)

export default router;
