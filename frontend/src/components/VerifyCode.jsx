import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"
import axios from 'axios';
import { userDataContext } from '../context/UserProvider';

const VerifyCode = () => {
    const {serverUrl,getAuthUser} = useContext(userDataContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [code ,setCode] = useState("");
    const formData = location.state;

    const changeHandler = (e) => {
        setCode(e.target.value);
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        setLoading(true);
            try {
                const res2 = await axios.post(`${serverUrl}/user/verify-code`, {email : formData.email,code : code}, {
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    withCredentials: true
                })

                if (!res2.data.success) {
                    toast.error(res2.data.message);
                    setLoading(false);
                    return;
                }

                console.log(res2);


                const res = await axios.post(`${serverUrl}/user/register`, {name : formData.name,email : formData.email,password : formData.password}, {
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    withCredentials: true
                });

                if (res.data.success) {
                    toast.success(res.data.message);
                    setLoading(false);
                }
                else{
                    return;
                }

                console.log(res);


                const loginRes = await axios.post(`${serverUrl}/user/login`,{email:formData.email,password : formData.password}, {
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    withCredentials: true
                })

                console.log(loginRes);

                if(loginRes.data.success){
                    navigate("/selImg");
                    getAuthUser();
                    setLoading(false);
                }
            }
            catch (error) {
                toast.error(error.response.data.message);
            }
    }
    return (
        <div className='w-screen h-screen flex justify-center items-center ' >

            <form onSubmit={submitHandler} className=' rounded-md  shadow-2xl drop-shadow-stone-800 relative z-10 flex flex-col w-full max-w-md p-10 border-1 border-gray-300 bg-white gap-12' action="">
                <h1 className='text-2xl font-bold text-center' >Verify Email</h1>
                <div className='flex flex-col gap-4  w-full' >
                    <div className='flex flex-col' >
                        <label htmlFor='name' className='label font-medium p-2 ' >Enter OTP</label>
                        <input type="text" id='name' value={code} onChange={changeHandler} className='input font-mono tracking-wider w-full input-bordered border-black  focus:outline-none focus:ring-2 focus:ring-blue-400  ' />
                    </div>

                    <button type='submit' className={`btn w-full mt-7  hover:bg-[#4bc125]  ${loading? "bg-neutral-500" : "bg-[#60f132]" }  ` } disabled={loading}
           >
                       {loading? "Verifying..." : "Verify" }
                    </button>
                </div>

            </form>
        </div>
    )
}

export default VerifyCode
