import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
function Comment({ comment, onLike }) {
	const [user, setUser] = useState({});
	const { currentUser } = useSelector((state) => state.user);
	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch(`/api/user/${comment.userId}`);
				const data = await res.json();
				if (res.ok) {
					setUser(data);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getUser();
	}, [comment]);
	if (!user) return;

	return (
		<div className="flex p-4 border-b dark:border-gray-200 text-sm">
			<div className="flex-shrink-0 mr-3">
				<img
					className="w-10 h-10 rounded-full bg-gray-200 object-cover"
					src={user.profilePicture}
				/>
			</div>
			<div className="flex-1">
				<div className="flex items-center mb-1">
					<span className="text-xs font-bold mr-1 truncate">{`@${user.username}`}</span>
					<span className="text-gray-500 text-xs">
						{moment(comment.createdAt).fromNow()}
					</span>
				</div>
				<p className="text-gray-500 pb-2">{comment.content}</p>
				<div className="pt-2 flex items-center text-xs max-w-fit gap-2 text-gray-500 border-t dark:border-gray-700">
					<button
						type="button"
						onClick={() => onLike(comment._id)}
						className={`text-gray-400 `}
					>
						<FaThumbsUp
							className={`${
								currentUser &&
								comment.likes.includes(currentUser._id) &&
								"text-blue-500"
							}`}
						/>
					</button>
					<p className="text-gray-400">
						{comment.numberOfLikes > 0 &&
							comment.numberOfLikes +
								" " +
								(comment.numberOfLikes === 1 ? "Like" : "Likes")}
					</p>
				</div>
			</div>
		</div>
	);
}
export default Comment;
