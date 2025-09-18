import React from 'react'
import { useStore } from '../context/ContextProvider'
import { useState } from 'react'
import SideBar from '../dashboard/SideBar'
import MyProfile from '../dashboard/MyProfile'
import MyBlogs from '../dashboard/MyBlogs'
import CreateBlog from '../dashboard/CreateBlog'
import UpdateBlog from '../dashboard/UpdateBlog'
import { Navigate } from 'react-router-dom'


function DashBoard() {
   const{profile,isAuthenticated}=useStore()
   console.log(profile)
   console.log(isAuthenticated)
   const [component,setComponent]=useState('MyBlogs');

   if(!isAuthenticated){
    return <Navigate to={'/'}/>
   }
  return (
    <div className='flex'>

      <SideBar component={component} setComponent={setComponent}/>

      <div className='flex-1 ml-64 p-6'>
        
        {
          component === 'MyProfile' ? (<MyProfile/>) :
          component === 'CreateBlog' ? (<CreateBlog/>) :
          component === 'UpdateBlog' ? (<UpdateBlog/>) :
          (<MyBlogs/>)          
        }
      </div>
    </div>
  )
}

export default DashBoard

