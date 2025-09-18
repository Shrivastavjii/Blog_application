import bcrypt from 'bcryptjs'
import { User } from '../models/userModel.js'
import {v2 as cloudinary} from 'cloudinary'
import createTokenAndSaveCookies from '../jwt/authTokens.js';
export const register = async (req, res) => {

  try {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpeg","image/jpg","image/png","image/webp"];

    if (!allowedFormats.includes(photo.mimetype)) {
      return res
        .status(200)
        .json({ message: "Invalid photo format. Only jpg and png are allowed" });
    }



    const { email, name, password, phone, education, role } = req.body

    if (!email || !name || !password || !phone || !education || !role) {

      return res.status(200).json({ message: "please fill the all details" })

    }

    const user = await User.findOne({ email })

    if (user) {

      return res.status(201).json({ message: "user already exist with this email" })

    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );
    console.log(cloudinaryResponse)
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
    }


    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      email,
      name,
      password: hashPassword,
      phone,
      education,
      role,
      photo: {

        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,

      }
    })

    if (newUser) {
      let token=await createTokenAndSaveCookies(newUser._id, res);
      return res.status(200).json({ message: "user succesfully created",newUser,token:token})
      
    }
  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: "Server error",error });
  }

}

export const login=async(req,res)=>{
try {
  

  const{email,password,role}=req.body

  if(!email||!password||!role){
    return res.status(400).json({ message: "please fill the all details" })
  }

  const user=await User.findOne({email}).select("+password")
  
  if (!user) {
  return res.status(404).json({ message: "User not found , please register first" });
}

  if(!user.password){
     return res.status(400).json({ message: "user password is missing" })
  }

  const isMatch=await bcrypt.compare(password,user.password)

  if(!user||!isMatch){
     return res.status(401).json({ message: "incorrect email or password" })
  }

    if(user.role!==role){
     return res.status(403).json({ message: "invalid role" })
  }
  
 let token=await createTokenAndSaveCookies(user._id, res);

 res.status(200).json({message:"user logged in succesfully",user:{
  _id:user._id,
  name:user.name,
  email:user.email,
  role:user.role,
  photo:user.photo
 },token:token})

} catch (error) {
  return res.status(500).json({message:"internal server error"})
}
}

export const logout = (req, res) => {
  try {
    // JWT cookie clear kar di
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,       // production mein https ke liye
      sameSite: "strict", // CSRF ke liye
    });

    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfile = async (req, res) => {
  const user = await req.user;
  res.status(200).json({ user });
};

export const getAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" });
  res.status(200).json({ admins });
};
