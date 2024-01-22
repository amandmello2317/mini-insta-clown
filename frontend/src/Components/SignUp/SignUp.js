import React, { useEffect, useState, useContext } from 'react'
import logo from '../../Images/instagram-logo.png'
import './Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { LoginContext } from '../../Context/LoginContext';





export default function SignUp() {



  const {setUserLogin} = useContext(LoginContext)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
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
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  // SENDING THE DATA
  const postData = () => {
    //CHECKING EMAIL
    if (!emailRegex.test(email)) {
      notifyA("Invaile email")
      return
    } else if (!passRegex.test(password)) {
      notifyA("password must contain at kleast 1 upper case , 1 lower case, special character")
      return
    }

    fetch("http://localhost:5000/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        userName: userName,
        password: password
      })
    }).then(res => res.json())
      .then(data => {


        if (data.error) {
          notifyA(data.error)
        } else {
          notifyB(data.message)
          navigate("http://localhost:5000/signin")
        }

        console.log(data)
      })
  }

  // GOOGLE OAUTH
  const continueWithGoogle = (credentialResponse) => {
    console.log(credentialResponse);
    const jwtDetail = jwtDecode(credentialResponse.credential)
    console.log(jwtDetail);

    fetch("http://localhost:5000/googleLogin", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: jwtDetail.name,
        email: jwtDetail.email,
        userName: jwtDetail.name,
        email_verified: jwtDetail.email_verified,
        clientId: credentialResponse.clientId,
        Photo:jwtDetail.pi

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
    <div className='signup'>
      <div className="form-container">
        <div className="form">


          <img src={logo} alt="" className='signuplogo' />
          <p className='loginPara'>
            Sign Up to see photos and videos <br />from your friends
          </p>
          <div>
            <input type="email" name='email' id='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <input type="text" name='name' id='name' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <input type="text" name='username' id='username' placeholder='User Name' value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div>
            <input type="password" name='password' id='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <p className='loginPara' style={{ font: "12px", margin: "3px opx" }}>
            By signing up , your agree to out Tearms,<br /> privacy policy and cookies
          </p>
          <input type="submit" id='submit-btn' value="signUp" onClick={() => { postData() }} />

          {/* google OAuth */}

          <hr />
          <GoogleLogin
            onSuccess={credentialResponse => {
              continueWithGoogle(credentialResponse)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />;

        </div>

        <div className="form2">
          Already Have an Account? <Link to="/signin"><span style={{ color: "blue", cursor: "pointer" }}>Sign In</span></Link>
        </div>

      </div>

    </div>
  )
}
