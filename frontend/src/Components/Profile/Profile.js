import React, { useEffect, useState } from 'react'
import './profile.css'
import PostDetail from '../PostDetail/PostDetail'
import ProfilePic from '../ProfilePic/ProfilePic'


export default function Profile() {
  var picLink ="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
  const [pic, setPic] = useState([])
  const [show, setShow] = useState(false)
  const [post, setPost] = useState([])
  const [user, setUser] = useState("")
  const [changePic, setChangePic] = useState(false)


  const toggleDetails = (posts) => {
    if (show) {
      setShow(false)
    } else {
      setShow(true)
      console.log(show);
      setPost(posts)
      console.log(post);
    }

  }

  const changeProfile = () => {
    if (changePic) {
      setChangePic(false)
    } else {
      setChangePic(true)
    }
  }

  useEffect(() => {
    fetch(`http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
    })
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        setPic(result.posts)
        setUser(result.user)

      })
    console.log(pic);

  }, [])




  return (
    <div className='profile'>
      {/* Profile Frame */}

      <div className="profile-frame">
        <div className="profile-pic">
          <img
            onClick={changeProfile}
            src={user.Photo ? user.Photo : picLink} alt="" />
       
        </div>
        {/* PROFILE-DATA */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{pic ? pic.length: "0"} post</p>
            <p>{ user.followers ? user.followers.length : "0" } followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>

        </div>
      </div>
      <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />
      {/* Gallery */}
      <div className="gallery">
        {pic.map((posts) => (
          <img key={posts._id} src={posts.photo} alt="" onClick={() => { toggleDetails(posts) }} className="item" />

        ))}
      </div>

      {show &&
        <PostDetail item={post} toggleDetails={toggleDetails} />
      }
      {
        changePic &&
        <ProfilePic
          changeProfile={changeProfile}

        />
      }


    </div>
  )
}
