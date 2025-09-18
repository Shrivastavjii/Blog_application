import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import { useStore } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Login() {
<Navbar/>
const{setIsAuthenticated,setProfile}=useStore();
const [role, setRole] = useState("");
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
console.log(useStore());
const navigate = useNavigate();

const handleLogin=async(e)=>{

   e.preventDefault();
 
   if(!email || !password || !role){
    toast.error("please fill all fields")
   }
    try {
      const {data}=await axios.post(`${BACKEND_URL}/api/users/login`,
        {email,password,role},
        {
          withCredentials:true,
          headers:{
             "Content-Type": "application/json",
          }
        }
      );
      localStorage.setItem("token", data.token);
      console.log("LOGIN RESPONSE", data);
      setIsAuthenticated(true);
      setProfile(data);
      console.log("Profile Set:", data);
      toast.success(data.message ||"user Loggedin successfully")
     // setIsAuthenticated(true)
     // console.log(isAuthenticated)
      navigate('/');
      setEmail("");
      setPassword("");
      setRole("");
    } catch (error) {
      toast.error(error.response.data.message || "please fill all the required fields" ,
        { 
          duration:3000
      });
      console.error("Login error:", error);
    }
}

  return (
    <div>
      <div className='min-h-screen flex items-center justify-center' >
        <div className='w-full max-w-md bg-slate-800 shadow-md rounded-lg p-8'>
          <form onSubmit={handleLogin} action=''>
              <div className="font-semibold text-xl items-center text-center">
                    <Link to="/">
                        Blog<span className="text-red-500">Nest</span>
                    </Link>
                </div>
                <h1 className='text-xl font-semibold mb-6'></h1>
                <select value={role} 
                onChange={(e) => setRole(e.target.value)}
                className='w-full p-2 mb-4 border rounded-md text-black'>
                    <option value=''>Select Role </option>
                    <option value='user'>user </option>
                    <option value='admin'>admin</option>
                </select>
                <div className='mb-4'>
                  <input type='text'
                   placeholder='Enter Your Email'
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className='w-full p-2 border rounded-md text-black'
                  />
                </div>
                <div className='mb-4'>
                  <input type='text'
                   placeholder='Enter Your password'
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className='w-full p-2 border rounded-md text-black'
                  />
                  </div>
                <p className='text-center mb-4'>New User?{" "} <Link to='/register'className='text-red-600 '> Register Now</Link> </p>
                <button type="submit" 
                className='w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-red-500'>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
