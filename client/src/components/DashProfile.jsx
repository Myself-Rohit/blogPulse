import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi"
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { deleteFailure, deleteStart, deleteSuccess, signOutSuccess, updateFailure, updateSuccess } from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

function DashProfile() {
  const { currentUser, error,loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef();
  const dispatch = useDispatch()

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST"
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMessage(data)
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = res.json();
      if (!res.ok) {
        dispatch(deleteFailure(data.message))
      } else {
        dispatch(deleteSuccess(data));
      }

    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return dispatch(updateFailure("No field changed"))
    }
    if (uploadProgress && uploadProgress !== 100) {
      return;
    }
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message))
      } else {
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("user's profile updated successfully")
      }
    }
    catch (error) {
      dispatch(updateFailure(error.message));
      setErrorMessage(error.message)
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }
  useEffect(() => {
    if (imageFile) {
      uploadFile();
    }
  }, [imageFile]);
  const uploadFile = async () => {
    setUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setUploadError("could not upload image (File must be less than 2MB)");
        setUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl })
        });
      }
    );
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileRef}
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative"
          onClick={() => fileRef.current.click()}
        >
          {uploadProgress && uploadProgress != 100 && (
            <CircularProgressbar
              value={uploadProgress || 0}
              text={`${uploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${uploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-gray-400 ${uploadProgress && uploadProgress < 100 && "opacity-60"
              }`}
          />
        </div>
        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username} onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email} onChange={handleChange}
        />
        <TextInput type="password" id="password" placeholder="**************" onChange={handleChange} />
        <Button type="submit" outline gradientDuoTone="purpleToBlue" disabled={loading || uploadProgress}>
          {loading?"Loading...":"Update"}
        </Button>
        {currentUser.isAdmin && <Link to="/create-post">
          <Button gradientDuoTone="purpleToPink" className="w-full">
          Create Post
        </Button>
        </Link>}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="curser-pointer">Delete Account</span>
        <span onClick={handleSignout} className="curser-pointer">Sign Out</span>
      </div>
      {
        updateUserSuccess && <Alert color="success" className="mt-5">{updateUserSuccess}</Alert>
        ||
        errorMessage && <Alert color="failure" className="mt-5">{errorMessage}</Alert>
        ||
        error && <Alert color="failure" className="mt-5">{error}</Alert>
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>Yes, I'm sure</Button>
            <Button color="gray" onClick={() => setShowModal(false)}>No, Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile;
