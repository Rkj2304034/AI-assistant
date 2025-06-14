import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Toaster} from "react-hot-toast"
import App from './App.jsx'
import UserProvider from './context/UserProvider'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      
      <UserProvider>
        <App/>
      </UserProvider>
      <Toaster/>
  </StrictMode>,
)
