import React, { useState, useEffect, useRef } from 'react'
import './profilePic.css'


export default function ProfilePic({ changeProfile }) {
    const hiddenFileInput = useRef(null)

    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")



    // UPLOADING TO CLOUDINARY
    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "fitfusioncloud")
        fetch("https://api.cloudinary.com/v1_1/fitfusioncloud/image/upload",
            {
                method: "post",
                body: data
            }).then(res => res.json())
            .then(data => {
                setUrl(data.url)

            })
            .catch(err => console.log(err))
    }

    const postPic = async () => {


        // SAVING POST TO MONGODB
        await fetch("http://localhost:5000/uploadProfilePic", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                changeProfile()
                window.location.reload()
            })
            .catch(err => console.log(err))
    }


    const handleClick = () => {
        hiddenFileInput.current.click()
    }

    useEffect(() => {
        if (image) {
            postDetails()
        }
    }, [image])

    useEffect(() => {
        if (url) {
            postPic()
        }
    }, [url])


    return (
        <div className='profilepic darkBg'>
            <div className="changePic centered">
                <div>
                    <h2>Change Profile Photo</h2>
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button onClick={handleClick} className='upload-btn' style={{ color: "#0095f6" }}> Upload Photo</button>

                    <input type="file"
                        ref={hiddenFileInput}
                        accept='image/*'
                        style={{ display: "none" }}
                        onChange={(e) => { setImage(e.target.files[0]) }} />
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button className='upload-btn' onClick={() => {
                        setUrl(null)
                        postPic()
                    }} style={{ color: "#ed4956" }}>Remove Current Photo</button>
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button onClick={changeProfile} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px" }}>Cancle</button>
                </div>
            </div>
        </div>
    )
}
