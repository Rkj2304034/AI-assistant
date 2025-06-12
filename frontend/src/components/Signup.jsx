import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { userDataContext } from '../context/userProvider';

const Signup = () => {
  const {serverUrl,getAuthUser} = useContext(userDataContext);
  const navigate = useNavigate();
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({});

  const isValidate = () => {
    const temp = {};

    if (!formData.name || !formData.name.trim()) {
      temp.name = 'Fullname is required';
    }

    if (!formData.email || !formData.email.trim()) {
      temp.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      temp.email = 'Email is invalid';
    }

    if (!formData.password || !formData.password.trim()) {
      temp.password = 'Password is required';
    } else if (formData.password.length < 6) {
      temp.password = 'Password must be at least 6 characters';
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  }

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }


  const submitHandler = async(e) => {
    e.preventDefault();
    if (isValidate()) {
      setLoading(true);
      try {
        const res1 = await axios.post(`${serverUrl}/user/send-code`, {email : formData.email}, {
          headers: {
            "Content-Type": 'application/json'
          },
          withCredentials: true
        });

        console.log(res1);
        if (res1.data.success) {
          navigate("/verify",{state : formData});
          setLoading(false);
        }
      }
      catch (error) {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    }
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center ' >

      <form onSubmit={submitHandler} className=' rounded-md  shadow-2xl drop-shadow-stone-800 relative z-10 flex flex-col w-full max-w-md p-10 border-1 border-gray-300 bg-white gap-12' action="">
        <h1 className='text-2xl font-bold text-center' >Register</h1>
        <div className='flex flex-col gap-4  w-full' >
          <div className='flex flex-col' >
            <label htmlFor='name' className='label font-medium p-2 ' >Fullname</label>
            <input type="text" id='name' value={formData.name} onChange={changeHandler} className='input w-full input-bordered border-black  focus:outline-none focus:ring-2 focus:ring-blue-400  ' />
            {errors.name && <p className='text-sm text-red-600' >*{errors.name}</p>}
          </div>
          <div className='flex flex-col' >
            <label htmlFor='email' className='label font-medium p-2 ' >Email</label>
            <input type="text" id='email' value={formData.email} onChange={changeHandler} className='input w-full input-bordered border-black  focus:outline-none focus:ring-2 focus:ring-blue-400 ' />
            {errors.email && <p className='text-sm text-red-600' >*{errors.email}</p>}
          </div>
          <div className='flex flex-col' >
            <label htmlFor='password' className='label font-medium p-2 ' >Password</label>
            <div className='relative w-full' >
                          <input type={showPassword ? "text" : "password"} id='password' value={formData.password} onChange={changeHandler} className='border-1  p-2 rounded  w-full input-bordered border-black  focus:outline-none focus:ring-2 focus:ring-blue-400 ' />
                          <button type='button' className='absolute top-0 bottom-0 right-1.5 '  onClick={() => setShowPassword(!showPassword)} >
                              {showPassword?  <IoEyeOff/> : <IoEye/> }
                          </button>
                        </div>
            {errors.password && <p className='text-sm text-red-600' >*{errors.password}</p>}
          </div>
          <button type='submit' className={`btn w-full mt-7 hover:bg-[#4bc125]  ${loading? "bg-neutral-500 " : " bg-[#60f132]" } `} disabled={loading}
           >
            {loading? "Registering..." : "Register" }
          </button>
          <div className='flex justify-center' >
            <p className='text-sm text-neutral-500 ' >Have an account &nbsp; 
            <Link className='hover:text-[blue]' to="/login" >Login</Link>
             </p>
          </div>
        </div>

      </form>
    </div>
  )
}

export default Signup
