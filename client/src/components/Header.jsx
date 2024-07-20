import {
	Avatar,
	Button,
	Dropdown,
	Navbar,
	TextInput,
	theme,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import { signOutSuccess } from "../redux/user/userSlice.js";

function Header() {
	const path = useLocation().pathname;
	const location = useLocation();
	const { theme } = useSelector((state) => state.theme);
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, [location.search]);

	const handleSignout = async () => {
		try {
			const res = await fetch("/api/user/signout", {
				method: "POST",
			});
			const data = await res.json();
			if (res.ok) {
				dispatch(signOutSuccess());
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", searchTerm);
		const stringUrl = urlParams.toString();
		navigate(`/search?${stringUrl}`);
	};
	return (
		<Navbar className="border-b-2">
			<Link
				to={"/"}
				className="whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
			>
				<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
					Rohit's
				</span>
				Blog
			</Link>
			<form onSubmit={handleSubmit}>
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				></TextInput>
			</form>
			<Link to="/search">
				<Button className="w-12 h-10 lg:hidden" color="gray" pill>
					<AiOutlineSearch />
				</Button>
			</Link>
			<div className="flex gap-2 md:order-2">
				<Button
					className="w-12 h-10 inline"
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}
				>
					{theme === "light" ? <FaSun /> : <FaMoon />}
				</Button>
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar alt="user" img={currentUser.profilePicture} rounded />
						}
					>
						<Dropdown.Header>
							<span className="block text-sm">{currentUser.username}</span>
							<span className="block text-sm font-medium truncate">
								{currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to="/dashboard?tab=profile">
							<Dropdown.Item>Profile</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/signin">
						<Button gradientDuoTone="purpleToBlue" outline>
							Sign In
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Navbar.Link href="/" active={path === "/"}>
					<span>Home</span>
				</Navbar.Link>
				<Navbar.Link href="/about" active={path === "/about"}>
					<span>About</span>
				</Navbar.Link>
				<Navbar.Link href="/projects" active={path === "/projects"}>
					<span>Projects</span>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default Header;
