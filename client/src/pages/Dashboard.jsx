import React, { useEffect, useState } from "react";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import { useLocation } from "react-router-dom";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import Dashcomments from "../components/DashComments";
function Dashboard() {
	const [tab, setTab] = useState(null);
	const location = useLocation();
	useEffect(() => {
		const tabFromUrl = new URLSearchParams(location.search).get("tab");
		setTab(tabFromUrl);
	}, [location.search]);
	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			<div className="">
				<DashSidebar />
			</div>
			{tab == "profile" && <DashProfile />}
			{tab == "posts" && <DashPosts />}
			{tab == "users" && <DashUsers />}
			{tab == "comments" && <Dashcomments />}
		</div>
	);
}

export default Dashboard;
