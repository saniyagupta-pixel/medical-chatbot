import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css"
import {createBrowserRouter} from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import Login, { loginAction } from './pages/Login.jsx';
import SignUp, { signupAction } from './pages/signup.jsx';
import DashBoard from './pages/dashboard.jsx';
import ChatPage from './pages/chatpage.jsx';
//import { Children } from 'react';


const router=createBrowserRouter([{
  path: "/", element:<Login/>,action: loginAction},{
  path: "/signup", element:<SignUp/>,action: signupAction},
  {path:"/App" , element:<App/>, children:[{
  path: "dashboard", element:<DashBoard/>},{
  path: "chat/:chatId",element:<ChatPage/>}]}
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
