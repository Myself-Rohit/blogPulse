import express from "express"
import { verifyToken } from "../utils/verifyToken.js";
import { createPostRoute } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create",verifyToken, createPostRoute);
export default router;