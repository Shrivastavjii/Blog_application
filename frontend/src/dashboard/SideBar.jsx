import React, { useState } from 'react'
import { useStore } from '../context/ContextProvider'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";

const SideBar = ({ setComponent }) => {

  const navigateto = useNavigate();
  const { profile, isAuthenticated, setIsAuthenticated } = useStore()
  const handleComponents = (value) => {

    setComponent(value)
  }

  const [show, setShow] = useState(false)

  const gotoHome = () => {
    navigateto('/')
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:8000/api/users/logout',
        {},
        { withCredentials: true }
      );
      toast.success(data.message)
      localStorage.removeItem('jwt')
      setIsAuthenticated(false)
      navigateto('/login')
    } catch (error) {
      console.log(error)
      toast.error(error?.respnse?.message || "Failed to logout");
    }
  }
  return (
    <>
      <div
        className='sm:hidden fixed top-4 left-4 z-50'
        onClick={() => setShow(!show)}>

        <BsFillMenuButtonWideFill className="text-2xl" />
      </div>
      <div className={`w-64 h-full shadow-lg fixed top-0 left-0 bg-slate-800 transition-transform duration-300 transform sm:translate-x-0 ${
        show ? "translate-x-0" : "-translate-x-full"
        }`}
        >
        <div className='sm:hidden absolute top-4 right-4 text-xl cursor-pointer' 
        onClick={() => setShow(!show)}
        >

          <FaArrowLeftLong className='text-2xl' />
        </div>
        <div className='text-center'>
          <img className='w-24 h-24 rounded-full mx-auto mb-2 mt-4 object-cover'
            src={profile?.user?.photo?.url} alt="" />
          <p>{profile?.user?.name}</p>
        </div>

        <ul className="space-y-6 mx-4 mt-5">
          <button
            onClick={() => handleComponents("MyBlogs")}
            className="w-full px-4 py-2 bg-blue-900 rounded-lg hover:bg-green-700 transition duration-300"
          >
            MY BLOGS
          </button>
          <button
            onClick={() => handleComponents("CreateBlog")}
            className="w-full px-4 py-2 bg-blue-900 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            CREATE BLOG
          </button>
          <button
            onClick={() => handleComponents("MyProfile")}
            className="w-full px-4 py-2 bg-blue-900 rounded-lg hover:bg-pink-700 transition duration-300"
          >
            MY PROFILE
          </button>
          <button
            onClick={gotoHome}
            className="w-full px-4 py-2 bg-blue-900 rounded-lg hover:bg-red-700 transition duration-300"
          >
            HOME
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-blue-900 rounded-lg hover:bg-yellow-700 transition duration-300"
          >
            LOGOUT
          </button>
        </ul>
      </div>
    </>
  )
}

export default SideBar
// import React from 'react'

// const SideBar = () => {
//   return (
//     <div>
//       SideBar
//     </div>
//   )
// }

// export default SideBar
