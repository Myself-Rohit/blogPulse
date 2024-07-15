import express from "express"
import { verifyToken } from "../utils/verifyToken.js";
import { createPostRoute, getPosts } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create",verifyToken, createPostRoute);
router.get("/getposts", getPosts);
export default router;