import React, { useContext } from 'react'
import instalogo from '../../Images/instagram-logo.png'
import './NavBar.css'
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../../Context/LoginContext';




export default function NavBar({ login }) {
  const navigate = useNavigate()

  const { setModalOpen } = useContext(LoginContext)

  // NavBar for PC
  const loginStatus = () => {

    const token = localStorage.getItem("jwt")
    if (login || token) {
      return [
        <>
          <Link to="/profile"> <li>Profile</li> </Link>
          {/* <Link to="/"> <li>Home</li> </Link> */}
          <Link to="/createpost"> <li>Create Post</li> </Link>
          <Link to="/followingpost"> <li>Following Post</li> </Link>
          <Link to="">
            <button className='primaryBtn' onClick={() => setModalOpen(true)}>LogOut</button>
          </Link>
        </>
      ]

    } else {
      return [
        <>
          <Link to="/signup"><li>SignUp</li> </Link>
          <Link to="/signin"><li>SignIn</li> </Link>
        </>
      ]

    }
  }

  // NavBar for mobile
  const loginStatusMobile = () => {
    const token = localStorage.getItem("jwt")
    if (login || token) {
      return [
        <>

          <Link to="/"><li>  <span class="material-symbols-outlined">
            home
          </span> </li></Link>

          <Link to="/profile"><li><span class="material-symbols-outlined">
            account_circle
          </span></li>  </Link>
          {/* <Link to="/"> <li>Home</li> </Link> */}

          <Link to="/createpost"> <li><span class="material-symbols-outlined">
            add_circle
          </span></li> </Link>

          <Link to="/followingpost"> <li><span class="material-symbols-outlined">
            explore
          </span></li> </Link>

          <Link to="">
            <li onClick={() => setModalOpen(true)}> <span class="material-symbols-outlined">
            LogOut
            </span> </li>
          </Link >
        </>
      ]

    } else {
      return [
        <>
          <Link to="/signup"><li>SignUp</li> </Link>
          <Link to="/signin"><li>SignIn</li> </Link>
        </>
      ]

    }
  }


  return (
    <div className='navbar'>
      <img id='insta-logo' src={instalogo} alt="" onClick={() => { navigate("/") }} />
      <ul className='nav-menu' >
        {loginStatus()}
      </ul>
      

      <ul className='nav-mobile' >
        {loginStatusMobile()}
      </ul>

    </div>
  )
}
