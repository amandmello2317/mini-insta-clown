import React from 'react'
import "./postDetail.css"
import { useNavigate } from 'react-router-dom'


export default function PostDetail({ item, toggleDetails }) {
    const navigate = useNavigate()

    const removePost = (postId) => {
        if(window.confirm("Do you want to delete this post")){

            fetch(`http://localhost:5000/deletePost/${postId}` ,{
                method:"delete",
                headers: {
                  "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
              })
                .then(res => res.json())
                .then((result) =>{ 
                    console.log(result)
                    toggleDetails()
                    navigate("/")
                })
        }
    }

    return (
        <div className="showComment">
            <div className="container">

                <div className="postPic">
                    <img src={item.photo} height="400px" alt="" />
                </div>

                <div className="details">

                    {/* CARD HEADER */}
                    <div className="card-header" style={{ borderBottom: "1px solid #00000029" }} >
                        <div className="card-pic">
                            <img src="http://res.cloudinary.com/fitfusioncloud/image/upload/v1700032727/rnzvpjo8lyjs1u96furj.jpg" />
                        </div>
                        <h5>{item.postedBy.name} </h5>

                        <div className="deletePost" onClick={() => removePost(item._id)}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                        </div>

                    </div>

                    {/* comment section */}
                    <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>

                        {item.comments.map((comment) => (

                            <p className='comm'>
                                <span className='commenter' style={{ fontWeight: "bolder" }}> {comment.postedBy.name}  </span>
                                <span className='commentText'> {comment.comment} </span>
                            </p>

                        ))}




                    </div>

                    {/* CARD CONTAINT */}
                    <div className="card-content" >
                        {/* <span className="material-symbols-outlined material-symbols-outlined-red" >favorite</span>
                <span className="material-symbols-outlined">favorite</span> */}
                        <p>{item.likes.length} Likes</p>
                        <p>{item.body}</p>
                    </div>

                    {/* ADD COMMENT */}
                    <div className="add-comment" >
                        <span className="material-symbols-outlined">
                            mood
                        </span>
                        <input type="text" placeholder='Add a comment'
                        // value={comment} 
                        // onChange={(e) => { setComment(e.target.value) }}
                        />
                        <button className="comment"
                        //   onClick={() => {
                        //     makeComment(comment, item._id)
                        //     toggleComments()
                        //   }}
                        >Post
                        </button>
                    </div>

                </div>
            </div>
            <div className="close-comment"
                onClick={() => {
                    toggleDetails()
                }}
            >
                <span className="material-symbols-outlined">
                    close
                </span>
            </div>
        </div>
    )
}
