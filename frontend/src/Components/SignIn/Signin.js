import React, { useState, useContext } from 'react'
import './signin.css'
import logo from '../../Images/instagram-logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { LoginContext } from '../../Context/LoginContext';


export default function Signin() {

  const {setUserLogin} = useContext(LoginContext)


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  // Toast Functions
  const notifyA = (msg) => {
    toast.error(msg)
  }

  const notifyB = (msg) => {
    toast.success(msg)
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const postData = () => {
    //CHECKING EMAIL
    if (!emailRegex.test(email)) {
      notifyA("Invaile email")
      return
    }

    fetch("http://localhost:5000/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(res => res.json())
      .then(data => {


        if (data.error) {
          notifyA(data.error)
        } else {
          notifyB("Signed in Successful")
          console.log(data);
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          setUserLogin(true)
          navigate("/")
        }
        console.log(data)
      })

  }

  return (
    <div className='signIn'>
      <div>
        <div className="loginForm">
          <img src={logo} alt="" className='signuplogo' />
          <div>
            <input type="email" name='email' id='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />

          </div>
          <div>
            <input type="password" name='password' id='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <input type="submit" value="Sign In" id='login-btn' onClick={() => { postData() }} />
          </div>
        </div>
        <div className="loginForm2">
          Dont have an account?
          <Link to="/signup"><span style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
          </Link>
        </div>
      </div>

    </div>
  )
}
