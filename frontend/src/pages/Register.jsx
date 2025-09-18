import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from '../context/ContextProvider';
function Register() {
const{isAuthenticated,setIsAuthenticated,profile,setProfile}=useStore();

const [name, setName] = useState("")
const [email, setEmail] = useState("")
const [phone, setPhone] = useState("")
const [password, setPassword] = useState("")
const [role, setRole] = useState("")
const [education, setEducation] = useState("")
const [photo, setPhoto] = useState("")
const [photoPreview, setPhotoPreview] = useState("")
const Navigateto=useNavigate()

const changePhotoHandler=(e)=>{

  console.log(e)
  const file=e.target.files[0]
  const reader=new FileReader()
  reader.readAsDataURL(file)
  reader.onload=()=>{
    setPhotoPreview(reader.result)
    setPhoto(file)
  }
}

const handleRegister=async(e)=>{

   e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("education", education);
    formData.append("photo", photo);

    try {
      const {data}=await axios.post("http://localhost:8000/api/users/register",
        formData,
        {
          withCredentials:true,
          headers:{
             "Content-Type": "multipart/form-data",
          }
        }
      );
      console.log(data)
      toast.success(data.message || "user registered successfully")
      //Navigateto=('/login')
      setIsAuthenticated(true)
      setProfile(data)
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
      setEducation("");
      setPhoto("");
      setPhotoPreview("");
      Navigateto('/login')
    } catch (error) {
      console.log(error)
      toast.error(error.message || "please fill required details")
    }
}



  return (
    <div>
      <div className='bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] min-h-screen flex items-center justify-center bg-gray-100' >
        <div className='w-full max-w-md bg-slate-800 shadow-md rounded-lg p-8'>
          <form onSubmit={handleRegister} action=''>
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
                   placeholder='Enter Your Name'
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className='w-full p-2 border rounded-md text-black'
                  />
                </div>
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
                <div className='mb-4'>
                  <input type='number'
                   placeholder='Enter Your Phone Number'
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   className='w-full p-2 border rounded-md text-black'
                  />
                </div>
                 <select value={education} 
                 onChange={(e) => setEducation(e.target.value)}
                 className='w-full p-2 mb-4 border rounded-md text-black'>
                    <option value=''>Select Education </option>
                    <option value='BBA'>BBA </option>
                    <option value='BCA'>BCA</option>
                    <option value='BSC'>BSC </option>
                    <option value='B.pharma'>B.Pharma</option>
                    <option value='B.Phil'> B.Phil </option>
                    <option value='BA'>BA</option>
                    <option value='B.Tech'>B.Tech</option>
                    <option value='MBA'>MBA</option>
                    <option value='MCA'>MCA</option>
                    <option value='MSC'>MSC</option>
                    <option value='M.Pharma'>M.Pharma</option>
                    <option value='MA'>MA</option>
                    <option value='M.Phil'>M.Phil</option>
                    <option value='M.Tech'>M.Tech</option>
                </select>
                <div className='flex items-center mb-4'>
                    <div className='photo w-20 h-20 mr-4'>
                      <img src={photoPreview ? `${photoPreview}` : "photo"}
                      alt="photo"/>
                    </div>
                    <input type='file'
                    onChange={changePhotoHandler}
                    className='w-full p-2 border rounded-md'/>
                </div>
                <p className='text-center mb-4'>Already registered?{" "} <Link to='/login'className='text-red-600 '> Login Now</Link> </p>
                <button type="submit" 
                className='w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-red'>Register Now</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
