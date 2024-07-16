import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
	try {
		if (req.user.id !== req.body.userId) {
			return next(errorHandler(403, "You are not allowed to delete this post"));
		}
		const newComment = new Comment({
			content: req.body.content,
			postId: req.body.postId,
			userId: req.body.userId,
		});
		await newComment.save();

		res.status(201).json(newComment);
	} catch (error) {
		next(error);
	}
};
