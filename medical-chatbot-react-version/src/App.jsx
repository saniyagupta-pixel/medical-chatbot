import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import MainChat from './components/mainchat'
import SideBar from './components/sidebar'

function App() {

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
