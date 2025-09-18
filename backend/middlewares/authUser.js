import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'
//Authentication


export const isAuthenticated=async(req,res,next)=>{
   try {
     const token =req?.cookies?.jwt
     console.log("middleware :" ,token)
    if(!token){
      return  res.status(400).json({message:"user not authenticated"})
    }

    const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
    const user=await User.findById(decode.userId)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
     req.user=user
    next()
   } catch (error) {
    console.log("error occured in authentication",error)
    return res.status(500).json({message:"server error"})
   }
}

//Authorization

export const isAdmin=(...roles)=>{

    return(req,res,next)=>{

        if(!roles.includes(req.user.role)){

            return res.status(403).json({error:`User with given role ${req.user.role} not allowed`})
        }

        next();
    }
}