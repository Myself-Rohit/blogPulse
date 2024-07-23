import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function DashPosts() {
	const { currentUser } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showmore, setShowmore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
				const data = await res.json();
				if (res.ok) {
					setUserPosts(data.posts);
					if (data.posts.length < 9) {
						setShowmore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchPosts();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = userPosts.length;
		try {
			const res = await fetch(
				`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUserPosts((prev) => [...prev, ...data.posts]);
				if (data.posts.length < 9) {
					setShowmore(false);
				}
			}
		} catch (error) {}
	};

	const handleDeletePost = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/post/delete/${postIdToDelete}/${currentUser._id}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserPosts(userPosts.filter((post) => post._id !== postIdToDelete));
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div className="table-auto md:mx-auto overflow-x-scroll">
			{currentUser.isAdmin && userPosts.length ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date updated</Table.HeadCell>
							<Table.HeadCell>Post image</Table.HeadCell>
							<Table.HeadCell>Post title</Table.HeadCell>
							<Table.HeadCell>Category</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
							<Table.HeadCell>
								<span>EDIT</span>
							</Table.HeadCell>
						</Table.Head>
						{userPosts.map((post) => {
							return (
								<Table.Body key={post.title} className="divide-y">
									<Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
										<Table.Cell>
											{new Date(post.updatedAt).toLocaleDateString()}
										</Table.Cell>
										<Table.Cell>
											<Link
												className="font-medium text-gray-900 dark:text-white"
												to={`/post/${post.slug}`}
											>
												<img
													src={post.image}
													alt={post.title}
													className="w-20 h-10 object-cover bg-gray-500"
												/>
											</Link>
										</Table.Cell>
										<Table.Cell>{post.title}</Table.Cell>
										<Table.Cell>{post.category}</Table.Cell>
										<Table.Cell>
											<span
												onClick={() => {
													setShowModal(true);
													setPostIdToDelete(post._id);
												}}
												className="font-medium text-red-500 hover:underline cursor-pointer"
											>
												DELETE
											</span>
										</Table.Cell>
										<Table.Cell>
											<Link
												className="text-teal-500 hover:underline"
												to={`/update-post/${post._id}`}
											>
												<span>EDIT</span>
											</Link>
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
							Are you sure you want to delete your account?
						</h3>
					</div>
					<div className="flex justify-center gap-4">
						<Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts;
