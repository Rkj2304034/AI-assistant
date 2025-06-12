import React, { useContext, useEffect, useState,useRef } from 'react'
import { userDataContext } from '../context/userProvider'
import { IoMenu } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';



const Home = () => {
  const menuRef = useRef();
  const [showMenu,setShowMenu] = useState(false);
  const {userData,setUserData} = useContext(userDataContext);
  const navigate = useNavigate();
  const {serverUrl,getGeminiResponse} = useContext(userDataContext);

  const handleSignOut = async() => {
    const res = await axios.get(`${serverUrl}/user/logout`);
    if(res.data.success){
      toast.success(res.data.message);
      setUserData(null);
      navigate("/");
    }
  }

  useEffect(() => {
    const handleClickOutside = async(e) => {
      if(menuRef && !menuRef.current.contains(e.target)){
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown",handleClickOutside);

    return () => {
      document.removeEventListener("mousedown",handleClickOutside);
    }

  },[])


 const synth = window.speechSynthesis;
  let isSpeaking = false;
  let utteranceQueue = [];

  const speak = (text) => {
    if (!text) return;

    utteranceQueue.push(text);

    if (isSpeaking) return;

    const speakNext = () => {
      if (utteranceQueue.length === 0) {
        isSpeaking = false;
        return;
      }

      isSpeaking = true;
      const nextText = utteranceQueue.shift();
      const utterance = new SpeechSynthesisUtterance(nextText);

      const voices = synth.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[0];
      }

      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        speakNext();
      };

      synth.speak(utterance);
      console.log("Speaking:", nextText);
    };

    if (synth.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speakNext();
      };
    } else {
      speakNext();
    }
  };



  const handleCommand = async(data) => {
    const {type,userInput,response} = data;
    speak(response);

    if(type === 'google_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank')
    }

    if(type === 'youtube_search' || type === 'youtube_play' ){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank')
    }

    if(type === 'calculator_open'){
      window.open(`https://www.google.com/search?q=calculator`,'_blank')
    }

    if(type === 'instagram_open'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.instagram.com/search?q=${query}`,'_blank')
    }

    if(type === 'facebook_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.facebook.com/search?q=${query}`,'_blank')
    }

    if(type === 'weather_show'){
      window.open(`https://www.google.com/search?q=weather`,'_blank')
    }
  }



  useEffect(() => {
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!speechRecognition) return;

  const recognition = new speechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';

  // let lastSpokenTime = 0;

  recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();
    console.log(transcript);

    if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
      const data = await getGeminiResponse(transcript);
      console.log(data);
      speak(data.response);
    }
  };

  recognition.start();

  return () => {
    recognition.stop();
  };
}, []);

  
  return (
    <div className=' w-full h-screen flex items-center bg-gradient-to-b from-blue-950 to-black flex-col gap-8 relative ' >
        <div className='w-80 h-80 mt-20  overflow-hidden rounded-full'>
  <img className='w-full h-full object-cover' src={userData?.assistantImg} alt="img" />
      <IoMenu  className=' absolute top-3 right-3  text-white h-[40px] w-[40px] ' onClick={() => setShowMenu(!showMenu)}  />

      <div ref={menuRef} className='bg-white font-semibold text-black border-1 border-gray-500 absolute top-11 right-11  rounded-lg flex flex-col ' hidden={!showMenu} >
        <button className='p-2 rounded hover:bg-gray-200 'onClick={() => navigate("/selImg") }  >Customise your assistant</button>
        <button className='border-t-1 rounded hover:bg-gray-200 border-gray-500 p-2 ' onClick={handleSignOut} >Signout</button>
        

      </div>
</div>

        <h2 className=' text-2xl text-white font-bold ' > Hi {userData?.name}, <span className='text-blue-700' > I'm your assistant {userData?.assistantName} </span> </h2>

        <button className='btn' onClick={() => speak("rahul")}  >jafas</button>
  
    </div>
  )
}

export default Home

// many time it stop speaking whileshow results