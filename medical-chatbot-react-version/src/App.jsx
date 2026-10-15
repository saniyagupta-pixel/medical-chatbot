import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
//import MainChat from './components/mainchat'
import SideBar from './components/sidebar'

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔥 IMPORTANT: prevent broken UI on refresh
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Header></Header>
      <div className="mainchat">
      <SideBar></SideBar>
      <Outlet/>
      </div>
    </>
  )
}

export default App
