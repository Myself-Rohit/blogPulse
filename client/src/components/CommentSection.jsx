import { Alert, Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CommentSection({ postId }) {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState("");
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (comment.length > 200) {
			return;
		}
		try {
			const res = await fetch("/api/comment/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: comment,
					postId,
					userId: currentUser._id,
				}),
			});
			const data = await res.json();
			console.log(data);
			if (res.ok) {
				setComment("");
			}
		} catch (error) {
			setError(error.message);
		}
	};
	return (
		<div className="max-w-2xl mx-auto w-full p-3">
			{currentUser ? (
				<div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
					<p>Signed in as:</p>
					<img
						className="w-5 h-5 object-cover rounded-full"
						src={currentUser.profilePicture}
						alt="profile picture"
					/>
					<Link
						to="/dashboard?tab=profile"
						className="text-xs text-cyan-500 hover:underline"
					>
						@{currentUser.username}
					</Link>
				</div>
			) : (
				<div className="text-sm text-teal-500 my-5 flex gap-1">
					You must be signed in to comment.
					<Link to="/signin" className="text-blue-500 hover:underline">
						Sign In
					</Link>
				</div>
			)}
			{currentUser && (
				<form
					onSubmit={handleSubmit}
					className="border border-teal-500 p-3 rounded-md"
				>
					<Textarea
						placeholder="Add a comment..."
						rows="3"
						maxLength="200"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<div className="flex justify-between items-center mt-5">
						<p className="text-gray-500 text-xs">
							{200 - comment.length} characters remaining
						</p>
						<Button gradientDuoTone="purpleToBlue" outline type="submit">
							Submit
						</Button>
					</div>
					{error && <Alert color="failure">{error}</Alert>}
				</form>
			)}
		</div>
	);
}
export default CommentSection;
