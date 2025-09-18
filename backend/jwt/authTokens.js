import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

export const createTokenAndSaveCookies= async(userId,res)=>{

    const token=jwt.sign({userId},process.env.JWT_SECRET_KEY,{
         expiresIn: "7d"
    })
   
  res.cookie('jwt', token, {
  httpOnly: false,
  secure: false,
  sameSite: "none",
  //maxAge: 7 * 24 * 60 * 60 * 1000,
});

    await User.findByIdAndUpdate(userId,{token})
    return token;
}

export default createTokenAndSaveCookies;

