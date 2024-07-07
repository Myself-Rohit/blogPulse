import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

function DashSidebar() {
  const [tab, setTab] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              as="div"
              active={tab === "profile"}
              icon={HiUser}
              label={"user"}
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            as="div"
            active
            icon={HiArrowSmRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
