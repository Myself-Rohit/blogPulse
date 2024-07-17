import { Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineArrowNarrowUp } from "react-icons/hi";
import {
	HiAnnotation,
	HiDocumentText,
	HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function DashboardComp() {
	const [users, setUsers] = useState([]);
	const [comments, setComments] = useState([]);
	const [posts, setPosts] = useState([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalComments, setTotalComments] = useState(0);
	const [totalPosts, setTotalPosts] = useState(0);
	const [lastMonthsUsers, setLastMonthsUsers] = useState(0);
	const [lastMonthsComments, setLastMonthsComments] = useState(0);
	const [lastMonthsPosts, setLastMonthsPosts] = useState(0);
	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch("/api/user/getusers");
				const data = await res.json();
				if (res.ok) {
					setUsers(data.users);
					setTotalUsers(data.totalUsers);
					setLastMonthsUsers(data.lastMonthUsers);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		const fetchComments = async () => {
			try {
				const res = await fetch("/api/comment/getcomments");
				const data = await res.json();
				if (res.ok) {
					setComments(data.allcomments);
					setTotalComments(data.totalComments);
					setLastMonthsComments(data.lastMonthComments);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		const fetchUPost = async () => {
			try {
				const res = await fetch("/api/post/getposts");
				const data = await res.json();
				if (res.ok) {
					setPosts(data.posts);
					setTotalPosts(data.totalPosts);
					setLastMonthsPosts(data.lastMonthPosts);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchUsers();
			fetchComments();
			fetchUPost();
		}
	}, []);
	return (
		<>
			<div>
				<div className="flex justify-center flex-wrap">
					<div className="p-4 shadow-md shadaw-gray-300 w-72">
						<div className="flex justify-between">
							<div>
								<h1>TOTAL USERS</h1>
								<h1 className="font-semibold text-2xl">{totalUsers}</h1>
							</div>
							<div>
								<div>
									<HiOutlineUserGroup className="w-12 h-12 rounded-full text-white p-3 object-cover bg-teal-600" />
								</div>
							</div>
						</div>
						<div className="text-gray-400 text-sm flex gap-2 items-center mt-4">
							<span className="text-green-500 flex items-center ">
								<span>
									<HiOutlineArrowNarrowUp />
								</span>
								<span>{lastMonthsUsers}</span>
							</span>
							<span>Last month</span>
						</div>
					</div>

					<div className="p-4 shadow-md shadaw-gray-300 w-72 gap-2">
						<div className="flex justify-between">
							<div>
								<h1>TOTAL COMMENTS</h1>
								<h1 className="font-semibold text-2xl">{totalComments}</h1>
							</div>
							<div>
								<HiAnnotation className="w-12 h-12 rounded-full text-white p-3 object-cover bg-indigo-600" />
							</div>
						</div>
						<div className="text-gray-400 text-sm flex gap-2 items-center mt-4">
							<span className="text-green-500 flex items-center ">
								<span>
									<HiOutlineArrowNarrowUp />
								</span>
								<span>{lastMonthsComments}</span>
							</span>
							<span>Last month</span>
						</div>
					</div>

					<div className="p-4 shadow-md shadaw-gray-300 w-72 gap-2">
						<div className="flex justify-between">
							<div>
								<h1>TOTAL POSTS</h1>
								<h1 className="font-semibold text-2xl">{totalPosts}</h1>
							</div>
							<div>
								<div>
									<HiDocumentText className="w-12 h-12 rounded-full text-white p-3 object-cover bg-lime-600" />
								</div>
							</div>
						</div>
						<div className="text-gray-400 text-sm flex gap-2 items-center mt-4">
							<span className="text-green-500 flex items-center ">
								<span>
									<HiOutlineArrowNarrowUp />
								</span>
								<span>{lastMonthsPosts}</span>
							</span>
							<span>Last month</span>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
					<div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800">
						<div className="flex justify-between p-3 text-sm font-semibold">
							<h1 className="text-center p-2">Recent users</h1>
							<Button gradientDuoTone="purpleToPink" outline>
								<Link to={"/dashboard?tab=users"}>See all</Link>
							</Button>
						</div>
						<Table hoverable>
							<Table.Head>
								<Table.HeadCell>User image</Table.HeadCell>
								<Table.HeadCell>Username</Table.HeadCell>
							</Table.Head>
							{users &&
								users.map((user) => {
									return (
										<Table.Body key={user._id} className="divide-y">
											<Table.Row className="bg-white dark:border-gray-700 data:bg-gray-800"></Table.Row>
											<Table.Cell>
												<img
													src={user.profilePicture}
													alt="user"
													className="w-10 h-10 rounded-full bg-gray-500"
												/>
											</Table.Cell>
											<Table.Cell>{user.username}</Table.Cell>
										</Table.Body>
									);
								})}
						</Table>
					</div>

					<div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800">
						<div className="flex justify-between p-3 text-sm font-semibold">
							<h1 className="text-center p-2">Recent comments</h1>
							<Button gradientDuoTone="purpleToPink" outline>
								<Link to={"/dashboard?tab=comments"}>See all</Link>
							</Button>
						</div>
						<Table hoverable>
							<Table.Head>
								<Table.HeadCell>Comment content</Table.HeadCell>
								<Table.HeadCell>Likes</Table.HeadCell>
							</Table.Head>
							{comments &&
								comments.map((comment) => {
									return (
										<Table.Body key={comment._id} className="divide-y">
											<Table.Row className="bg-white dark:border-gray-700 data:bg-gray-800"></Table.Row>
											<Table.Cell>{comment.content}</Table.Cell>
											<Table.Cell>{comment.numberOfLikes}</Table.Cell>
										</Table.Body>
									);
								})}
						</Table>
					</div>

					<div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800">
						<div className="flex justify-between p-3 text-sm font-semibold">
							<h1 className="text-center p-2">Recent post</h1>
							<Button gradientDuoTone="purpleToPink" outline>
								<Link to={"/dashboard?tab=posts"}>See all</Link>
							</Button>
						</div>
						<Table hoverable>
							<Table.Head>
								<Table.HeadCell>Post image</Table.HeadCell>
								<Table.HeadCell>Post Title</Table.HeadCell>
								<Table.HeadCell>Category</Table.HeadCell>
							</Table.Head>
							{posts &&
								posts.map((post) => {
									return (
										<Table.Body key={post._id} className="divide-y">
											<Table.Row className="bg-white dark:border-gray-700 data:bg-gray-800"></Table.Row>
											<Table.Cell>
												<img
													src={post.image}
													alt="post"
													className="w-10 h-10 rounded-full bg-gray-500"
												/>
											</Table.Cell>
											<Table.Cell>{post.title}</Table.Cell>
											<Table.Cell>{post.category}</Table.Cell>
										</Table.Body>
									);
								})}
						</Table>
					</div>
				</div>
			</div>
		</>
	);
}

export default DashboardComp;
