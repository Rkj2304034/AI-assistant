import React, { useContext, useRef, useState } from 'react'
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/images/img1.jpeg'
import img2 from '../assets/images/img2.jpeg'
import img3 from '../assets/images/img3.jpeg'
import img4 from '../assets/images/img4.jpeg'
import img5 from '../assets/images/img5.jpeg'
import img6 from '../assets/images/img6.jpeg'
import img7 from '../assets/images/img7.jpeg'
import { RiImageAddLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { userDataContext } from '../context/UserProvider';


const Coustomize1 = () => {
  const navigate = useNavigate();

 const {
       serverUrl, userData,setUserData,frontendImg, setFrontendImg,backendImg, setBackendImg,selectedImg,setSelectedImg,assistantName,setAssitantName
    } = useContext(userDataContext)

  const myRef = useRef();


  const handleImg = (e) => {  // in case of add img
    const file = e.target.files[0];
    if (file) {
      setBackendImg(file);
      setFrontendImg(URL.createObjectURL(file))
      console.log("done");
    }
  }


  const handleRemove = (e) => {
    setFrontendImg(null);
  }
  return (
    <div className='bg-gradient-to-t from-black to-blue-900 w-full  flex flex-col justify-center items-center ' >
      <h1 className='text-white text-4xl font-extrabold m-5 ' >Select an image for your <span className='text-blue-500' >AI-assistant</span></h1>
      <div className=' w-full  flex flex-wrap gap-1 justify-center items-center max-w-300   ' >
        <Card img={img1} />
        <Card img={img2} />
        <Card img={img4} />
        <Card img={img6} />
        <Card img={img7} />
       
        {
          frontendImg ? (<div className={`  ${selectedImg === "input" ? "border-white border-4" : ''}  rounded-xl relative shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-white border-4 border-blue-950 w-40 h-65 mx-12 my-5 `} >
            <img className='object-fill  h-full object-center ' src={frontendImg} alt="ai-imag" />
            <IoClose className='text-black w-[30px] h-[30px] absolute top-1 right-1 transition-transform duration-300ms hover:scale-110 ' onClick={handleRemove} />
          </div>) :


            (<div onClick={() => {
              myRef.current.click(),
                setSelectedImg("input")
            }
            } className={`  rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-white  w-40 h-65 mx-12 my-5  flex justify-center items-center border-1 border-white `} >
              <RiImageAddLine className=' w-[50px] h-[30px] text-white ' />
              <input type="file" onChange={handleImg} accept='image/*' ref={myRef} className='hidden ' />
            </div>)



        }

      </div>
      <button onClick={() => navigate("/selName") }  className='btn btn-lg m-5 ' >
        Next
      </button>

    </div>
  )
}

export default Coustomize1;

