import React from "react";
import Navbar from "../src/components/Navbar";
import Home from "../src/components/Home";
import Footer from "../src/components/Footer";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Blogs from "../src/pages/Blogs";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/DashBoard";
import Detail from "../src/pages/Detail";
import { useStore } from "./context/ContextProvider";
import Creators from "./pages/Creators";
import {Toaster} from 'react-hot-toast'
import UpdateBlog from "./dashboard/UpdateBlog";
import NotFound from "../pages/NotFound";
function App() {
  const location=useLocation();
  const {blogs,isAuthenticated}=useStore()
   
  //console.log(blogs)
  
  const hideNavBarAndFooter=['/login','/register','/dashboard'].includes(
    location.pathname
  )
  return (
    <div>
     { !hideNavBarAndFooter && <Navbar />}
      {/* Defining routes */}
      <Routes>
        <Route exact path="/" element={ isAuthenticated===true ?<Home /> : <Navigate to ={'/login'}/>} />
        <Route exact path="/blogs" element={<Blogs />} />
        <Route exact path="/creators" element={<Creators />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/dashboard" element={<Dashboard />} />

        {/*update blog*/}
        <Route exact path="/blog/update/:id" element={<UpdateBlog/>} />

        {/* single-blog */}
        <Route exact path="/blog/:id" element={<Detail/>} />
        
        
         {/* Universal route */}
        <Route path="*" element={<NotFound/>} />


          </Routes>
      <Toaster/>               
      {!hideNavBarAndFooter && <Footer />}
    </div>
  );
}

export default App;
