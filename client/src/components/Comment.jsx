import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Modal, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
function Comment({ comment, onLike, allComments, setComments }) {
	const [user, setUser] = useState({});
	const { currentUser } = useSelector((state) => state.user);
	const [showEdit, setShowEdit] = useState(false);
	const [editValue, setEditValue] = useState(comment.content);
	const [showModal, setShowModal] = useState(false);
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

	const handleSave = async () => {
		if (!currentUser) {
			return;
		}
		try {
			const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content: editValue }),
			});
			const data = await res.json();
			if (res.ok) {
				comment.content = editValue;
				setShowEdit(false);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDelete = async () => {
		try {
			const res = await fetch(`/api/comment/deletecomment/${comment._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (res.ok) {
				setComments(
					allComments.filter((comment) => {
						return data._id !== comment._id;
					})
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};
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
				{showEdit ? (
					<>
						<Textarea
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
						/>
						<div className="flex items-center justify-end gap-2 my-1">
							<Button gradientDuoTone="purpleToBlue" onClick={handleSave}>
								Save
							</Button>
							<Button
								gradientDuoTone="purpleToBlue"
								outline
								onClick={() => setShowEdit(false)}
							>
								Cancel
							</Button>
						</div>
					</>
				) : (
					<>
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
							<p
								className="cursor-pointer text-gray-400 hover:text-blue-500"
								onClick={() => {
									setEditValue(comment.content);
									setShowEdit(true);
								}}
							>
								Edit
							</p>
							<p
								className="cursor-pointer text-gray-400 hover:text-red-500"
								onClick={() => setShowModal(true)}
							>
								Delete
							</p>
						</div>
						<Modal
							show={showModal}
							onClose={() => setShowModal(false)}
							popup
							size="md"
						>
							<Modal.Header />
							<Modal.Body>
								<div className="text-center">
									<HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
									<h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-400">
										Are you sure you want to delete your account?
									</h3>
								</div>
								<div className="flex justify-center gap-4">
									<Button color="failure" onClick={handleDelete}>
										Yes, I'm sure
									</Button>
									<Button color="gray" onClick={() => setShowModal(false)}>
										No, Cancel
									</Button>
								</div>
							</Modal.Body>
						</Modal>
					</>
				)}
			</div>
		</div>
	);
}
export default Comment;
