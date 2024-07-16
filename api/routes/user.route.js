import express from "express";
import {
	userRoutes,
	updateRoute,
	deleteRoute,
	signoutRoute,
	getUsers,
	getUserWithId,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", userRoutes);
router.put("/update/:userId", verifyToken, updateRoute);
router.delete("/delete/:userId", verifyToken, deleteRoute);
router.post("/signout", signoutRoute);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUserWithId);

export default router;
