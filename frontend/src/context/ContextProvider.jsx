import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import Cookies from 'js-cookie'
export const AuthContext = createContext();

export const ContextProvider = ({ children }) => {

    const [blogs, setBlogs] = useState();
    const [profile,setProfile]=useState()
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    useEffect(() => {

        const fetchProfile = async () => {
            try {

                //const token=Cookies.get('jwt');
                //const parsedToken=token?JSON.parse(token): undefined
               
                 const {data} = await axios.get("http://localhost:8000/api/users/my-profile",
                    {withCredentials:true,
                    headers:{"Content-Type":"application/json"}}
                )
                console.log(data)
                setProfile(data)                         
                setIsAuthenticated(true)
               
            } catch (error) {
                console.log(error)
            }
        }
        const fetchBlogs = async () => {

            try {

                const res = await axios.get("http://localhost:8000/api/blogs/all-blogs")
                //console.log(res)
                setBlogs(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        
        fetchBlogs();
        fetchProfile();
    }, [])
    return (

        <AuthContext.Provider value={{ blogs,profile,isAuthenticated,setIsAuthenticated,setProfile}}> {children} </AuthContext.Provider>
    )
}

export const useStore = () => useContext(AuthContext)