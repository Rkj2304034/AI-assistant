import React, { useContext, useEffect, useState, useRef } from 'react'
import { userDataContext } from '../context/UserProvider'
import { IoMenu } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import aiGif from '../assets/images/ai.gif'
import listenGif from '../assets/images/listen.gif'



const Home = () => {
  const menuRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const { userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const { serverUrl, getGeminiResponse } = useContext(userDataContext);
  const [Speaking, setSpeaking] = useState(false);
  const [Listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");



  const handleSignOut = async () => {
    const res = await axios.get(`${serverUrl}/user/logout`);
    if (res.data.success) {
      toast.success(res.data.message);
      setUserData(null);
      navigate("/");
    }
  }

  useEffect(() => {
    const handleClickOutside = async (e) => {
      if (menuRef && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }

  }, [])


  const handleCommand = async (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const query = encodeURIComponent(userInput);

    if (type === 'google_search') {
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === 'youtube_search' || type === 'youtube_play') {
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

    if (type === 'calculator_open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }

    if (type === 'instagram_open') {
      window.open(`https://www.instagram.com/${query}`, '_blank'); // Or use direct username
    }

    if (type === 'facebook_search') {
      window.open(`https://www.facebook.com/search/top/?q=${query}`, '_blank');
    }

    if (type === 'weather_show') {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
  };



  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.warn("SpeechSynthesis is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    if (recognitionRef.current) recognitionRef.current.stop();

    const speakNow = () => {
      window.speechSynthesis.cancel(); // stop ongoing
      setListening(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    };

    // If voices are not loaded yet, wait for them
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        speakNow();
      };
    } else {
      speakNow();
    }

    utterance.onend = () => {
      setSpeaking(false);
      setListening(true);
      if (recognitionRef.current) recognitionRef.current.start();
      setAiText("");
    }
  };


  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);





  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setListening(true);
    }

    recognition.onend = () => {
      setListening(false);
      setUserText("");
    }

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard : " + transcript);
      setUserText(transcript);

      const data = await getGeminiResponse(transcript);
      console.log(data);

      speak(data.response);
      setAiText(data.response);
      handleCommand(data);
    }
  }, [])


  const stopAll = () => {
    recognitionRef.current.stop();
    setListening(false);

    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }



  return (
    <div className=' w-screen min-h-screen flex items-center bg-gradient-to-b from-blue-950 to-black flex-col gap-8 relative p-5 justify-start overflow-y-auto overflow-x-hidden  ' >
      <div className='w-50 sm:w-72 md:w-80 
      max-w-screen aspect-square overflow-hidden rounded-full mt-5 '>
        <img className='w-full h-full object-cover' src={userData?.assistantImg} alt="img" />
        <IoMenu className=' absolute top-3 right-3  text-white h-[40px] w-[40px] ' onClick={() => setShowMenu(!showMenu)} />

        <div ref={menuRef} className='bg-white font-semibold text-black border-1 border-gray-500 absolute top-11 right-11  rounded-lg flex flex-col ' hidden={!showMenu} >
          <button className='p-2 rounded hover:bg-gray-200 ' onClick={() => navigate("/selImg")}  >Customise your assistant</button>
          <button className='border-t-1 rounded hover:bg-gray-200 border-gray-500 p-2 ' onClick={handleSignOut} >Signout</button>




        </div>
      </div>

      <h2 className=' text-2xl text-white font-bold ' > Hi {userData?.name}, <span className='text-blue-700' > I'm your assistant {userData?.assistantName} </span> </h2>

      <div className='w-[200px] flex flex-col justify-center items-center ' >

        {Listening ? (
          <>
            <img src={listenGif} alt="Listening" />
            <button className='mt-5 bg-white btn btn-md ' onClick={() => stopAll()} >
              Stop
            </button>
          </>
        ) : Speaking ? (
          <div>
            <img src={aiGif} alt="Speaking" />
            <button onClick={() => stopAll()} >
              Stop
            </button>
          </div>
        ) : (
          <button className='bg-white px-4 py-2 rounded shadow' onClick={() => recognitionRef.current.start()}>
            Start
          </button>
        )}



      </div>
      <p className=' font-semibold text-lg text-white p-5 ' >
        {!aiText ? (userText) : (aiText)}
      </p>
    </div>
  )
}

export default Home

// many time it stop speaking whileshow results