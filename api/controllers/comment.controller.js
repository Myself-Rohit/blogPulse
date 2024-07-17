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

export const getPostComment = async (req, res, next) => {
	try {
		const comments = await Comment.find({ postId: req.params.postId }).sort({
			createdAt: -1,
		});
		res.status(200).json(comments);
	} catch (error) {
		next(error);
	}
};

export const likeComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			return next(errorHandler(400, "comment not found"));
		}
		const userIndex = comment.likes.indexOf(req.user.id);
		if (userIndex === -1) {
			comment.likes.push(req.user.id);
			comment.numberOfLikes += 1;
		} else {
			comment.likes.splice(userIndex, 1);
			comment.numberOfLikes -= 1;
		}
		await comment.save();
		res.status(200).json(comment);
	} catch (error) {
		next(error);
	}
};

export const editComment = async (req, res, next) => {
	const comment = await Comment.findById(req.params.commentId);
	if (!comment) {
		return next(errorHandler(400, "comment not found"));
	}
	if (!req.user.isAdmin && req.user.id !== comment.userId) {
		return next(errorHandler(403, "You are not allowed to edit this comment"));
	}
	try {
		const editedComment = await Comment.findByIdAndUpdate(
			req.params.commentId,
			{
				content: req.body.content,
			},
			{ new: true }
		);

		res.status(200).json(editedComment);
	} catch (error) {
		next(error);
	}
};

export const deleteComment = async (req, res, next) => {
	const comment = await Comment.findById(req.params.commentId);
	if (!comment) {
		return next(errorHandler(400, "comment not found"));
	}
	if (!req.user.isAdmin && req.user.id !== req.params.commentId) {
		return next(
			errorHandler(403, "You are not allowed to delete this comment")
		);
	}

	try {
		const deletedComment = await Comment.findByIdAndDelete(
			req.params.commentId
		);
		res.status(200).json(deletedComment);
	} catch (error) {
		next(error);
	}
};

export const getAllComments = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, "You are not allowed to see this page"));
	}
	try {
		const allcomments = await Comment.find();
		if (!allcomments) {
			return next(errorHandler("No comments yet"));
		}
		res.status(200).json(allcomments);
	} catch (error) {
		next(error);
	}
};
