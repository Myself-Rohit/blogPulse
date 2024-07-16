import express from "express";
import  {userRoutes, updateRoute, deleteRoute, signoutRoute, getUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", userRoutes);
router.put("/update/:userId", verifyToken, updateRoute)
router.delete("/delete/:userId", verifyToken, deleteRoute)
router.post("/signout", signoutRoute)
router.get("/getusers", verifyToken, getUsers)

export default router;
