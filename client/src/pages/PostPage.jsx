import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

function PostPage() {
	const [loading, setLoading] = useState(true);
	const [post, setPost] = useState(null);
	const [recentPosts, setRecentPosts] = useState([]);
	const { postSlug } = useParams();
	useEffect(() => {
		const fetchPost = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
				const data = await res.json();
				if (!res.ok) {
					setLoading(false);
				} else {
					setPost(data.posts[0]);
					setLoading(false);
				}
			} catch (error) {
				setLoading(false);
				console.log(error.message);
			}
		};
		fetchPost();
	}, [postSlug]);

	useEffect(() => {
		const fetchRecentPost = async () => {
			try {
				const res = await fetch("/api/post/getposts?limit=3");
				const data = await res.json();
				if (res.ok) {
					setRecentPosts(data.posts);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		fetchRecentPost();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Spinner size="xl" />
			</div>
		);
	}
	if (!post) return;
	return (
		<>
			<div className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
				<h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
					{post.title}
				</h1>
				<Link
					to={`/search?category=${post.category}`}
					className="self-center mt-5"
				>
					<Button color="gray" pill size="xs">
						{post.category}
					</Button>
				</Link>
				<img
					src={post.image}
					alt={post.title}
					className="mt-10 p-3 max-h-[600px] w-full object-cover"
				/>
				<div className="flex justify-between p-3 border-b border-slate-500">
					<span>{new Date(post.createdAt).toLocaleDateString()}</span>
					<span className="italic">
						{(post.content.length / 1000).toFixed(0)} mins read
					</span>
				</div>
				<div
					className="p-3 max-w-2xl mx-auto w-full post-content"
					dangerouslySetInnerHTML={{ __html: post.content }}
				></div>

				<div className="max-w-4xl mx-auto w-full">
					<CallToAction />
				</div>
				<CommentSection postId={post._id} />
				<div>
					<h1 className="text-xl mt-5 text-center">Recent articles</h1>
					<div className="flex flex-col md:flex-row gap-5 flex-wrap justify-center mt-5">
						{recentPosts.map((post) => {
							return <PostCard key={post._id} post={post} />;
						})}
					</div>
				</div>
			</div>
		</>
	);
}
export default PostPage;
