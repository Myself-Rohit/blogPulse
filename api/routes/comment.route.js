import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
	createComment,
	deleteComment,
	editComment,
	getAllComments,
	getPostComment,
	likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();
router.post("/create", verifyToken, createComment);
router.get("/getcomments/:postId", getPostComment);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editcomment/:commentId", verifyToken, editComment);
router.delete("/deletecomment/:commentId", verifyToken, deleteComment);
router.get("/getcomments", verifyToken, getAllComments);
export default router;
