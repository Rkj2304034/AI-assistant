import React, { useContext } from 'react'
import { userDataContext } from '../context/userProvider';


const Card = ({img}) => {
  const  {
       serverUrl, userData,setUserData,frontendImg, setFrontendImg,backendImg, setBackendImg,selectedImg,setSelectedImg,assistantName,setAssitantName
    } = useContext(userDataContext)
  return (
    <div className={` ${ selectedImg === img? "border-white border-4 " : 'border-blue-950 border-4 ' } rounded-xl shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-white  w-40 h-65 mx-12 my-5 `} onClick={ () => {setSelectedImg(img),
      setFrontendImg(null),
      setBackendImg(null)}
    } >
      <img  className='object-fill  h-full object-center ' src={img} alt="ai-imag" />
    </div>
  )
}

export default Card;
