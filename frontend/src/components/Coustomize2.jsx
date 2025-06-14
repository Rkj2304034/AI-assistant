import React, { useContext, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userDataContext } from '../context/UserProvider';
// import { getAuthUser } from '../../../backend/services/auth';


const Coustomize2 = () => {

  const {
    serverUrl, userData, setUserData, frontendImg, setFrontendImg, backendImg, setBackendImg, selectedImg, setSelectedImg, assistantName, setAssitantName, getAuthUser
  } = useContext(userDataContext)

  const navigate = useNavigate();


  const handleAssistant = async (e) => {
    e.preventDefault();
    // update the user model in db
    try {
      const form = new FormData();
      form.append("assistantName", assistantName)
      if (backendImg) { // in case of  img added
        form.append("img", backendImg)
      }
      else {
        form.append("img", selectedImg)
      }

      const res = await axios.post(`${serverUrl}/user/update`, form, {
        withCredentials: true
      })
      console.log(res.data)
      getAuthUser();

      navigate("/");
    }
    catch (error) {
      console.log(error);
    }
  }



  return (
    <div className='w-full h-screen bg-gradient-to-t from-black to-blue-950 flex justify-center items-center  flex-col p-5  ' >
      <h2 className='text-white text-4xl m-10 ' >Enter a name for your <span className='text-blue-800' >AI-assitant</span></h2>
      <div className='flex justify-center items-center  ' >
        <input type="text" value={assistantName} onChange={(e) => setAssitantName(e.target.value)} className='  p-5 m-10 text-2xl w-full max-w-md rounded-full bg-opacity-5 border-4 border-white text-white italic  ' placeholder='eg. Sifra' />
        <button onClick={handleAssistant} className='btn font-bold  btn-lg rounded-lg bg-white' >
          Save
        </button>
      </div>
    </div>
  )
}

export default Coustomize2;
