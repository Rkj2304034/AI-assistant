import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext();

const UserProvider = ({ children }) => {
    const serverUrl = "http://localhost:8000";
    const [userData, setUserData] = useState(null);
    const [frontendImg, setFrontendImg] = useState(null);
      const [backendImg, setBackendImg] = useState(null);
      const [selectedImg,setSelectedImg] = useState(null);
      const [assistantName,setAssitantName] = useState("");

     const getAuthUser = async () => {
        try {
            const res = await axios.get(`${serverUrl}/auth/auth-user`, {
                withCredentials: true
            })

            console.log(res.data);
            setUserData(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAuthUser();
    },[])


    const getGeminiResponse = async(command) => {
        try{
            const res = await axios.post(`${serverUrl}/user/command`,{command},{withCredentials : true})

            console.log(command);
            console.log(res.data);
            return res.data;
        }
        catch (error) {
            console.log(error);
        }
    }


    const value = {
       serverUrl, userData,setUserData,frontendImg, setFrontendImg,backendImg, setBackendImg,selectedImg,setSelectedImg,assistantName,setAssitantName,getAuthUser,getGeminiResponse
    }
    return (
        <div>
            <userDataContext.Provider value={value} >
                {children}
            </userDataContext.Provider>
        </div>
    )
}

export default UserProvider
