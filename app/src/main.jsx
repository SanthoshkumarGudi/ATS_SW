import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './utils/axiosConfig'  
import GoBackButton from './GoBack.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>    <GoBackButton/></BrowserRouter>

   
    <App />
  </StrictMode>,
)
