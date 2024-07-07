import React, { useEffect, useState } from "react";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import { useLocation } from "react-router-dom";
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
      <div className="w-screen">{tab == "profile" && <DashProfile />}</div>
    </div>
  );
}

export default Dashboard;
