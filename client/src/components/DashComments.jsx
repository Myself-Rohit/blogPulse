import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function Dashcomments() {
	const { currentUser } = useSelector((state) => state.user);
	const [comments, setcomments] = useState([]);
	const [showmore, setShowmore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [commentIdToDelete, setCommentIdToDelete] = useState(null);

	useEffect(() => {
		const fetchcomments = async () => {
			const startIndex = comments.length;
			try {
				const res = await fetch(
					`/api/comment/getcomments?startIndex=${startIndex}`
				);
				const data = await res.json();
				if (res.ok) {
					setcomments((prev) => [...prev, ...data.allcomments]);
					if (data.allcomments.length < 5) {
						setShowmore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchcomments();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = comments.length;
		try {
			const res = await fetch(
				`/api/comment/getcomments?startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setcomments((prev) => [...prev, ...data.allcomments]);
				if (data.allcomments.length < 5) {
					setShowmore(false);
				}
			}
		} catch (error) {}
	};

	const handleDeleteComment = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/comment/deletecomment/${commentIdToDelete}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (res.ok) {
				setcomments((prev) =>
					prev.filter((comment) => comment._id !== commentIdToDelete)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div className="table-auto md:mx-auto overflow-x-scroll">
			{currentUser.isAdmin && comments.length ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date updated</Table.HeadCell>
							<Table.HeadCell>comment content</Table.HeadCell>
							<Table.HeadCell>number of likes</Table.HeadCell>
							<Table.HeadCell>postid</Table.HeadCell>
							<Table.HeadCell>userid</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
						</Table.Head>
						{comments.map((comment) => {
							return (
								<Table.Body key={comment.title} className="divide-y">
									<Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
										<Table.Cell>
											{new Date(comment.updatedAt).toLocaleDateString()}
										</Table.Cell>

										<Table.Cell className="font-semibold">
											{comment.content}
										</Table.Cell>
										<Table.Cell>{comment.numberOfLikes}</Table.Cell>
										<Table.Cell>{comment.postId}</Table.Cell>
										<Table.Cell>{comment.userId}</Table.Cell>

										<Table.Cell>
											<span
												onClick={() => {
													setShowModal(true);
													setCommentIdToDelete(comment._id);
												}}
												className="font-medium text-red-500 hover:underline cursor-pointer"
											>
												Delete
											</span>
										</Table.Cell>
									</Table.Row>
								</Table.Body>
							);
						})}
					</Table>
					{showmore && (
						<button
							onClick={handleShowMore}
							className="w-full text-teal-500 self-center text-sm py-7"
						>
							Show more
						</button>
					)}
				</>
			) : (
				<Spinner size="xl" />
			)}
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
							Are you sure you want to delete this account?
						</h3>
					</div>
					<div className="flex justify-center gap-4">
						<Button color="failure" onClick={handleDeleteComment}>
							Yes, I'm sure
						</Button>
						<Button color="gray" onClick={() => setShowModal(false)}>
							No, Cancel
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default Dashcomments;
