import { Alert, Button, TextInput } from "flowbite-react";
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
import { updateFailure, updateSuccess } from "../redux/user/userSlice.js";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [formData,setFormData]=useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileRef = useRef();
  const dispatch = useDispatch()

  const handleChange= (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(Object.keys(formData).length===0){
  return dispatch(updateFailure("No field changed"))
}
if(uploadProgress && uploadProgress!==100){
  return;
}
try {
  const res = await fetch(`/api/user/update/${currentUser._id}`,{
    method:"PUT",
    headers:{
      "Content-Type" : "application/json"
    },
    body:JSON.stringify(formData)
  })
  const data = await res.json()
  if(!res.ok){
    dispatch(updateFailure(data.message))
    setErrorMessage("user's profile not updated. try again!")
  }else{
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
          setFormData({...formData,profilePicture:downloadUrl})
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
            className={`rounded-full w-full h-full object-cover border-8 border-gray-400 ${
              uploadProgress && uploadProgress < 100 && "opacity-60"
            }`}
          />
        </div>
        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}onChange={handleChange}
        />
        <TextInput type="password" id="password" placeholder="**************" onChange={handleChange}/>
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="curser-pointer">Delete Account</span>
        <span className="curser-pointer">Sign Out</span>
      </div>
      {
        updateUserSuccess && <Alert color="success" className="mt-5">{updateUserSuccess}</Alert>
        ||
        errorMessage && <Alert color="failure" className="mt-5">{errorMessage}</Alert>
      }
    </div>
  );
}

export default DashProfile;
