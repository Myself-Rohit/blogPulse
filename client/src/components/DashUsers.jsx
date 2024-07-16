import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

function DashUsers() {
    const { currentUser } = useSelector((state)=> state.user);
    const [users, setUsers] = useState([]);
    const [showmore, setShowmore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    
    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                const res = await fetch(`/api/user/getUsers`);
                const data = await res.json();
                if(res.ok){
                    setUsers(data.users);
                    if(data.users.length < 9){
                        setShowmore(false);
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        if(currentUser.isAdmin){
            fetchUsers();
        }
    },[currentUser._id])


    const handleShowMore = async()=>{
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if(res.ok){
                setUsers((prev)=>[...prev, ...data.userWithoutPassword]);
                if(data.userWithoutPassword.length < 9){
                    setShowmore(false);
                }
            }
        } catch (error) {
            
        }
    }

    const handleDeleteUser = async() => {
        setShowModal(false);
        try{
            const res = await fetch(`/api/user/delete/${userIdToDelete}`,{
                method: "DELETE"
            })
            const data = await res.json();
            if(res.ok){
                setUsers((prev)=>prev.filter((user)=>user._id!==userIdToDelete))
            }
        }
        catch(error){
            console.log(error.message);
        }
    }
    return (
        <div className="table-auto md:mx-auto overflow-x-scroll">
            {
                currentUser.isAdmin && users.length ? (<>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell><span>Admin</span></Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {
                            users.map(user => {
                               return(
                                <Table.Body key={user.title} className="divide-y">
                                    <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>
                                            <Link className="font-medium text-gray-900 dark:text-white"
                                             to={`/post/${user.slug}`}>
                                            <img src={user.profilePicture}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover bg-gray-500"/>
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell className="font-semibold">{user.username}</Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell className="text-teal-500 hover:underline">
                                        <span>{user.isAdmin?<FaCheck/>:<FaTimes className="text-red-500"/>}</span></Table.Cell>
                                        <Table.Cell>
                                            <span onClick={()=>{
                                                setShowModal(true);
                                                setUserIdToDelete(user._id)}}
                                                className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                               )
                            })
                        }
                    </Table>
                    {
                        showmore && (<button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Show more</button>
                        )
                    }
                    </>
                ):(<p>You have no  Users yet!</p>)
            }
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-400">Are you sure you want to delete this account?</h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>Yes, I'm sure</Button>
            <Button color="gray" onClick={() => setShowModal(false)}>No, Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>
        </div>
    )
}

export default DashUsers;