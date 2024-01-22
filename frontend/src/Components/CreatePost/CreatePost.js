import React, { useEffect, useState } from 'react'
import './createpost.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'



export default function CreatePost() {
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const navigate = useNavigate()


    // Toast Functions
  const notifyA = (msg) => {
    toast.error(msg)
  }

  const notifyB = (msg) => {
    toast.success(msg)
  }

    useEffect(() => {

        if (url) {
            // SAVING POST TO MONGODB
            fetch("http://localhost:5000/createPost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {if(data.error){
                    notifyA(data.error)
                }else{
                    notifyB("Successfully Posted")
                    navigate("/")
                }})
                .catch(err => console.log(err))
        }

    }, [url])


    // POSTING IMAGES TO CLOUDINARY
    const postDetails = () => {
        console.log(body, image);
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "fitfusioncloud")
        fetch("https://api.cloudinary.com/v1_1/fitfusioncloud/image/upload",
            {
                method: "post",
                body: data
            }).then(res => res.json())
            .then(data => setUrl(data.url))
            .catch(err => console.log(err))
    }

    const loadfile = (e) => {
        var output = document.getElementById('output')
        output.src = URL.createObjectURL(e.target.files[0])
        output.onload = function () {
            URL.revokeObjectURL(output.src)
        }
    }

    return (
        <div className='createPost'>
            <div className="post-header">
                <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
                <button id="post-btn" onClick={() => { postDetails() }}>Share</button>
            </div>
            {/* image preview */}
            <div className="main-div">
                <img id='output' src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-1024.png' />
                <input
                    type="file"
                    accept='image/*'
                    onChange={(e) => {
                        loadfile(e);
                        setImage(e.target.files[0])
                    }}
                />
            </div>
            <div className="details">
                <div className="card-header">
                    <div className="card-pic">
                        <img src="https://plus.unsplash.com/premium_photo-1697477565917-fa40026f842d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                    </div>
                    <h5>Aman</h5>
                </div>
                <textarea value={body} onChange={(e) => { setBody(e.target.value) }} type="text" placeholder='Write a caption..'></textarea>
            </div>
        </div>
    )
}
