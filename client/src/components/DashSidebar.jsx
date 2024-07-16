import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";


function DashSidebar() {
  const [tab, setTab] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state)=>state.user);
  const handleSignout = async() => {
    try {
      const res = await fetch("/api/user/signout", {
        method:"POST"
      })
      const data = await res.json()
      if (res.ok) {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error.message)
    }
  }

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
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {
            currentUser.isAdmin && 
            <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              as="div"
              active={tab === "posts"}
              icon={HiDocumentText}
              className="mt-2"
            >
              Post
            </Sidebar.Item>
          </Link>
          }
          {
            currentUser.isAdmin && 
            <Link to="/dashboard?tab=users">
            <Sidebar.Item
              as="div"
              active={tab === "users"}
              icon={HiOutlineUserGroup}
              className="mt-2"
            >
              User
            </Sidebar.Item>
          </Link>
          }
          <Sidebar.Item
            as="div"
            active
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
