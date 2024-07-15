import {Alert, Button, FileInput, Select, TextInput}from "flowbite-react"
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import 'react-quill/dist/quill.snow.css';
import {app} from "../firebase.js";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function UpdatePost() {
    const [file,setFile] = useState(null);
    const [imageUploadProgress,setImageUploadProgress] = useState(null);
    const [imageUploadError,setImageUploadError] = useState(null);
    const [formData,setFormData] = useState({});
    const [publishError,setPublishError] = useState(null);
    const { postId } = useParams();
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate()
    
    useEffect(()=>{
        try {
            const fetchPost = async() => {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if(!res.ok){
                    setPublishError(data.message)
                }else{
                    setPublishError(null);
                    setFormData(data.posts[0]);
                }
            }
            fetchPost()
        } catch (error) {
            console.log(error.message);
        }
    },[postId])

    const handleImageUpload = async () => {
        try {
            if(!file){
                setImageUploadError("Please select an image");
                return;
            }
            setImageUploadError(null)
            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" +file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));

                },
                (error) => {
                    setImageUploadError("Image upload failed");
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        setImageUploadError(null);
                        setImageUploadProgress(null);
                        setFormData({...formData,image:downloadURL});
                    })
                }
            )
        } catch (error) {
            setImageUploadProgress(null);
            setImageUploadError("Image upload failed");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/update/${formData._id}/${currentUser._id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            })
           const data = await res.json();
           if(!res.ok){
            setPublishError(data.message);
           }else{
            setPublishError(null);
            navigate(`/post/${data.slug}`)
           }
        } catch (error) {
            setPublishError("Something went worng")
        }
    }

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type="text"
                    value={formData.title}
                    onChange={(e)=>setFormData({...formData, title: e.target.value})}
                     placeholder="Title" required id="title"
                     className="flex-1" 
                     />
                    <Select value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">Javascript</option>
                        <option value="reactjs">React.js</option>
                        <option value="nextjs">Next.js</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0])}/>
                    <Button onClick={handleImageUpload} type="button" gradientDuoTone="purpleToBlue" size="sm" outline>
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                value={imageUploadProgress}
                                text={`${imageUploadProgress||0}%`} />
                            </div> ) : ("Upload Image")}</Button>
                </div>
                {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
                {formData.image && (
                    <img src={formData.image} alt="upload" className="w-full h-72 object-cover" />
                )}


                <ReactQuill theme="snow"
                 value={formData.content}
                 onChange={(value)=>setFormData({...formData, content: value})}
                 required placeholder="Write something...." className="h-72 mb-12" />
                <Button type="submit" gradientDuoTone="purpleToPink" >Update Post</Button>
                {publishError && <Alert color="failure">{publishError}</Alert>}
            </form>
        </div>
    )
}
export default UpdatePost;