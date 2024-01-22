import './App.css';
import React, { createContext, useEffect, useState } from 'react';
import NavBar from './Components/NavBar/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import SignUp from './Components/SignUp/SignUp';
import Signin from './Components/SignIn/Signin';
import Profile from './Components/Profile/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './Components/CreatePost/CreatePost';
import { LoginContext } from './Context/LoginContext';
import Modal from './Components/Modal/Modal';
import UserProfile from './Components/UserProfile/UserProfile';
import MyfollowingPost from './Components/MyFollowingPost/MyFollowingPost';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [userLogin, setUserLogin] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="App">
        <GoogleOAuthProvider clientId="545065883290-6uncfuogh4glb6gkupnv297063naugg3.apps.googleusercontent.com">

          <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>

            <NavBar login={userLogin} />
            <Routes>

              <Route path='/' element={<Home />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/signin' element={<Signin />} />
              <Route exact path='/profile' element={<Profile />} />
              <Route path='/createpost' element={<CreatePost />} />
              <Route path='/profile/:userid' element={<UserProfile />} />
              <Route path='/followingpost' element={<MyfollowingPost />} />

            </Routes>
            <ToastContainer
              theme='dark'
            />
            {modalOpen && <Modal setModalOpen={setModalOpen} />}


          </LoginContext.Provider>

        </GoogleOAuthProvider>
      </div>
    </BrowserRouter>

  );
}

export default App;
