import React, { useState } from "react";
import { useStore } from "../context/ContextProvider";
import { Link,useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from 'axios'
//import { FaHome, FaBlog, FaUsers, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";


function Navbar() {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    //const [show, setShow] = useState(false);
    const {  profile, isAuthenticated, setIsAuthenticated } = useStore();
    const { blogs } = useStore();
    const [show, setShow] = useState(false)
    console.log(blogs);
    const navigateTo = useNavigate();

    const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      console.log(data);
      localStorage.removeItem("jwt"); // deleting token in localStorage so that if user logged out it will goes to login page
      toast.success(data.message);
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };
    return (
        <nav className="sticky top-0 z-50 rounded-3xl px-4 py-3 bg-[#0a0a19]/80 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.6)] w-full">
            <div className="flex items-center justify-between container mx-auto">
                {/* Logo */}
                <div className="font-semibold text-xl items-center text-center">
                    <Link to="/">
                        Blog<span className="text-red-500">Nest</span>
                    </Link>
                </div>

                {/* Navbar Links */}
                <div className="mx-6">
                    <ul className="hidden md:flex space-x-6">
                        <li>
                            <Link to="/" className="hover:text-blue-500">HOME</Link>
                        </li>
                        <li>
                            <Link to="/blogs" className="hover:text-blue-500">BLOGS</Link>
                        </li>
                        <li>
                            <Link to="/creators" className="hover:text-blue-500">CREATORS</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-blue-500">ABOUT</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-blue-500">CONTACT</Link>
                        </li>
                    </ul>

                    <div className="md:hidden" onClick={() => setShow(!show)}>
                        {show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
                    </div>
                </div>

                {/* Right side buttons */}
                <div className="flex space-x-2">
                  {isAuthenticated && profile?.user?.role === "admin" ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white font-semibold hover:bg-blue-800 duration-300 px-4 py-2 rounded"
              >
                DASHBOARD
              </Link>
            ) : (
              ""
            )}

            {!isAuthenticated ? (
              <Link
                to="/Login"
                className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
              >
                LOGIN
              </Link>
            ) : (
              <div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        </div>
            {/*mobile view*/}
            {show && (
                <div className="bg-white">
                    <ul className="flex flex-col h-screen items-center justify-center space-y-3 md:hidden text-xl">
                        <li>
                            <Link to="/" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">HOME</Link>
                        </li>
                        <li>
                            <Link to="/blogs" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">BLOGS</Link>
                        </li>
                        <li>
                            <Link to="/creators" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">CREATORS</Link>
                        </li>
                        <li>
                            <Link to="/about" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">ABOUT</Link>
                        </li>
                        <li>
                            <Link to="/contact" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">CONTACT</Link>
                        </li>
                    </ul>
                </div>
            )}

        </nav>
    );
}

export default Navbar;
