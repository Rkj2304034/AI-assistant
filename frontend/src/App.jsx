import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import './App.css'
import VerifyCode from './components/VerifyCode'

import Coustomize1 from './components/Coustomize1'
import { useContext } from 'react'
import { userDataContext } from './context/UserProvider'
import Coustomize2 from './components/coustomize2'



function App() {

  const {
       serverUrl, userData,setUserData,frontendImg, setFrontendImg,backendImg, setBackendImg,selectedImg,setSelectedImg,assistantName,setAssitantName
    } = useContext(userDataContext);
  

  const router = createBrowserRouter([
    {
      path : '/',
      element : userData? <Home/> : <Login/>
    },
    {
      path : '/register',
      element : <Signup/>
    },
    {
      path : '/login',
      element : <Login/>
    },{
      path : '/verify',
      element : <VerifyCode/>
    },
    {
      path :   '/selImg' ,
      element : userData? <Coustomize1/> : <Login/>
    },
    {
      path : '/selName',
      element : userData? <Coustomize2/> : <Login/>
    }
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
