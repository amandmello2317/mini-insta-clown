import React, { useEffect, useState } from 'react'
import cardimg from '../Home/Images/cardimg.jpg'
import './home.css'
import { Link, useNavigate } from 'react-router-dom'


export default function Home() {
  var picLink ="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"


  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [comment, setComment] = useState("")
  const [show, setShow] = useState(false)
  const [item, setItem] = useState([])

  let limit = 10
  let skip = 0


  useEffect(() => {
    const token = localStorage.getItem("jwt")
    if (!token) {
      navigate('./signup')
    }

    // fetch all the post 
    fetchPost()


    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }

  }, [])


  // fetch all post
  const fetchPost = () => {

    fetch(`http://localhost:5000/allposts?limit=${limit}&skip=${skip}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },

    }).then(res => res.json())
      .then(result => {
        console.log(result);
        setData((data) => [...data, ...result])
      })
      .catch(err => console.log(err))
  }


  const handleScroll =() => {
    if(document.documentElement.clientHeight + window.pageXOffset >= document.documentElement.scrollHeight){
      skip = skip + 10
      fetchPost()
    }
  }

  // SHOW AND HIDE ALL COMMENTS
  const toggleComments = (post) => {
    if (show) {
      setShow(false)
    } else {
      setShow(true)
      setItem(post)
      console.log(item);
    }

  }

  // LIKE POST

  const likePost = (id) => {
    console.log(id);
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id == result._id) {
            return result
          } else {
            return post
          }
        })
        setData(newData)
        console.log(result);
      })
  }

  // UnLIKE
  const unLikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id == result._id) {
            return result
          } else {
            return post
          }
        })
        setData(newData)
      })
  }

  // This is a function to make comment

  const makeComment = (text, id) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text: text,
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id == result._id) {
            return result
          } else {
            return post
          }
        })
        setData(newData)
        console.log(result);
        setComment("")
        console.log(result);
      })
  }


  return (
    <div className='home'>

      {/* CARD */}

      {data.map((post) => (
        <div className="card" >
          {/* CARD HEADER */}
          <div className="card-header" >

            <div className="card-pic">
              <img src={post.postedBy.Photo ? post.postedBy.Photo : picLink} alt="" />
            </div>

            <h5>
              <Link to={`/profile/${post.postedBy._id}`}>
                {post.postedBy.name}
              </Link>
            </h5>
            
          </div>

          {/* card image */}
          <div className="card-image">
            <img src={post.photo} alt="" />
          </div>

          {/* CARD CONTAINT */}
          <div className="card-content">

            {
              post.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ? (
                <span className="material-symbols-outlined material-symbols-outlined-red" onClick={() => { unLikePost(post._id) }}>favorite</span>
              ) : (
                <span className="material-symbols-outlined" onClick={() => { likePost(post._id) }}>favorite</span>
              )
            }

            <p>{post.likes.length} Likes</p>
            <p>{post.body}</p>
            <p style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => { toggleComments(post) }}>View all Comments</p>
          </div>

          {/* ADD COMMENT */}
          <div className="add-comment">
            <span className="material-symbols-outlined">
              mood
            </span>
            <input type="text" placeholder='Add a comment' value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="comment" onClick={() => { makeComment(comment, post._id) }}>Post</button>
          </div>

        </div >
      ))
      }


      {/* SHOW COMMENTS */}
      {show && (
        <div className="showComment">
          <div className="container">

            <div className="postPic">
              <img src={item.photo} height="400px" alt="" />
            </div>

            <div className="details">

              {/* CARD HEADER */}
              <div className="card-header" style={{ borderBottom: "1px solid #00000029" }} >
                <div className="card-pic">
                  <img src={cardimg} alt="" />
                </div>
                <h5>{item.postedBy.name} </h5>
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
                <input type="text" placeholder='Add a comment' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                <button className="comment"
                  onClick={() => {
                    makeComment(comment, item._id)
                    toggleComments()
                  }}
                >Post
                </button>
              </div>

            </div>
          </div>
          <div className="close-comment">
            <span className="material-symbols-outlined" onClick={() => setShow(false)}>
              close
            </span>
          </div>
        </div>
      )
      }
    </div >
  )
}
