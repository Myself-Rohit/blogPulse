import express from "express"
import { verifyToken } from "../utils/verifyToken.js";
import { createPostRoute, deletePost, getPosts, updatePost } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create",verifyToken, createPostRoute);
router.get("/getposts", getPosts);
router.delete("/delete/:postId/:userId",verifyToken, deletePost);
router.put("/update/:postId/:userId",verifyToken, updatePost);
export default router;