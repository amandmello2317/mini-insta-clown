import React, { useEffect, useState } from 'react'
import './userProfile.css'
import { useParams } from 'react-router-dom'


export default function UserProfile() {

    var picLink ="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"


    const { userid } = useParams()
    const [isFollow, setIsFollow] = useState(false)

    console.log(userid);

    const [user, setUser] = useState("")
    const [post, setPost] = useState([])



    const findFromLocal = JSON.parse(localStorage.getItem("user"))._id
    console.log(findFromLocal);


    // TO FOLLOW USER
    const followUser = (userId) => {
        fetch("http://localhost:5000/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setIsFollow(true)
            })
    }

    // TO UNFOLLOW USER

    const unfollowUser = (userId) => {
        fetch("http://localhost:5000/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        })
            .then((res) =>  res.json() )
            .then((data) => {
                console.log(data);
                setIsFollow(false)

            })
    }

    const toggleDetails = (posts) => {
        //     if (show) {
        //         setShow(false)
        //     } else {
        //         setShow(true)
        //         console.log(show);
        //         setPost(posts)
        //         console.log(post);
        //     }

    }
    useEffect(() => {
        fetch(`http://localhost:5000/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        })
            .then(res => res.json())
            .then((result) => {
                console.log(result);
                setUser(result.user)
                setPost(result.posts)
                if (result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)) {
                    setIsFollow(true)
                }
            })
    }, [isFollow])




    return (
        <div className='profile'>
            {/* Profile Frame */}

            <div className="profile-frame">
                <div className="profile-pic">
                    <img src={user.Photo ? user.Photo : picLink} alt="" />
                </div>
                {/* PROFILE-DATA */}
                <div className="profile-data">

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                        <h1>{user.name}</h1>
                        

                        {findFromLocal === userid ? "" : (

                        <button className='follow-btn'
                            onClick={() => {
                                if(isFollow){
                                    unfollowUser(user._id)
                                }else{
                                    followUser(user._id)
                                }
                            }}>
                            {isFollow ? "Unfollow" : " follow"}
                        </button>
                        )}
                        
                    

                    </div>
                    <div className="profile-info" style={{ display: "flex" }}>
                        <p>{post.length} Posts</p>
                        <p>{user.followers && user.followers.length  } followers</p>
                        <p>{user.following && user.following.length } following</p>
                    </div>

                </div>
            </div>
            <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />
            {/* Gallery */}
            <div className="gallery">
                {post && post.map((pic) => (
                    <img key={pic._id}
                        src={pic.photo} alt=""
                        // onClick={() => { toggleDetails(pic) }}
                        className="item" />

                ))}
            </div>
            {/* 
      {show &&
        <PostDetail item={post} toggleDetails={toggleDetails}/>

      } */}


        </div>
    )
}
