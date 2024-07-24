import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";

function Search() {
	const [posts, setPosts] = useState([]);
	const [sidebarData, setSideBarData] = useState({
		searchTerm: "",
		sort: "desc",
		category: "nextjs",
	});
	const [showMore, setShowMore] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		const sortFromUrl = urlParams.get("sort");
		const categoryFromUrl = urlParams.get("category");

		if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
			setSideBarData({
				...sidebarData,
				searchTerm: searchTermFromUrl,
				sort: sortFromUrl,
				category: categoryFromUrl,
			});
		}

		const fetchPosts = async () => {
			try {
				const query = urlParams.toString();
				const res = await fetch(`/api/post/getposts?${query}`);
				if (res.ok) {
					const data = await res.json();
					setPosts(data.posts);

					if (data.posts < 9) {
						setShowMore(false);
					} else {
						setShowMore(true);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchPosts();
	}, [location.search]);

	const handleShowMore = async () => {
		const startIndex = posts.length;
		console.log(posts.length);
		try {
			const res = await fetch(`/api/post/getposts?startIndex=${startIndex}`);
			if (res.ok) {
				const data = await res.json();
				setPosts((prev) => [...prev, ...data.posts]);
				if (data.posts.length < 9) {
					setShowMore(false);
				} else {
					setShowMore(true);
				}
			}
		} catch (error) {}
	};

	const handleChange = (e) => {
		if (e.target.id === "searchTerm") {
			setSideBarData({ ...sidebarData, searchTerm: e.target.value });
		}
		if (e.target.id === "sort") {
			const order = e.target.value || "desc";
			setSideBarData({ ...sidebarData, sort: order });
		}
		if (e.target.id === "category") {
			const category = e.target.value || "uncategorized";
			setSideBarData({ ...sidebarData, category });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", sidebarData.searchTerm);
		urlParams.set("sort", sidebarData.sort);
		urlParams.set("category", sidebarData.category);
		const stringUrl = urlParams.toString();
		navigate(`/search?${stringUrl}`);
	};

	return (
		<div className="flex flex-col md:flex-row ">
			<div className="p-7 border-b md:border-r md:max-h-screen border-gray-500 min-w-72 md:sticky top-16 bottom-0">
				<form onSubmit={handleSubmit} className="flex flex-col gap-8">
					<div className="flex   items-center gap-2">
						<label className="whitespace-nowrap font-semibold">
							Search Term:
						</label>
						<div className="flex">
							<div className="relative w-full">
								<TextInput
									placeholder="Search..."
									id="searchTerm"
									type="text"
									value={sidebarData.searchTerm}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<label className="font-semibold">Sort:</label>
						<div className="flex">
							<div className="relative w-full">
								<Select
									value={sidebarData.sort}
									onChange={handleChange}
									id="sort"
								>
									<option value="desc">Latest</option>
									<option value="asc">Oldest</option>
								</Select>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<label className="font-semibold">Category:</label>
						<div className="flex">
							<div className="relative w-full">
								<Select
									value={sidebarData.category}
									onChange={handleChange}
									id="category"
								>
									<option value="uncategorized">Uncategorized</option>
									<option value="reactjs">React.js</option>
									<option value="nextjs">Next.js</option>
									<option value="javascript">JavaScript</option>
								</Select>
							</div>
						</div>
					</div>
					<Button type="submit" gradientDuoTone="purpleToPink" outline>
						Apply Filters
					</Button>
				</form>
			</div>
			<div className="flex flex-col grow">
				<h1 className="sm:border-b p-3 text-3xl font-semibold border-gray-500">
					Post results:
				</h1>
				<div className="p-7 flex flex-wrap gap-4">
					{posts.length ? (
						posts.map((post) => <PostCard post={post} key={post._id} />)
					) : (
						<h1 className="text-gray-600 font-semibold text-2xl text-center">
							No post found
						</h1>
					)}
				</div>
				{posts && showMore && (
					<button
						className="text-teal-500 text-center font-semibold"
						type="button"
						onClick={handleShowMore}
					>
						Show More
					</button>
				)}
			</div>
		</div>
	);
}
export default Search;
