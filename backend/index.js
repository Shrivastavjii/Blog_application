import express from 'express'
import dotenv from 'dotenv'
import connectToDb from './config/config.js'
import userRoute from './Routes/userRoutes.js'
import fileUpload from 'express-fileupload'
import {v2 as cloudinary} from 'cloudinary'
import blogRoute from './Routes/blogRoutes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()
dotenv.config()
const port=process.env.PORT || 8000

app.get('/',(req,res)=>{
    res.send("server is running")
})
//middlewares
app.use(express.json());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'

})
)
app.use(cookieParser())
app.use(cors({

    origin:process.env.FRONTEND_URL,
    credentials:true,
    //allowedHeaders:["Origin","X-Requested-With", "Content-Type","Authorization"],
    methods:["GET","POST","PUT","DELETE"],
    //optionsSuccessStatus:200 
}));


//registering routes
app.use('/api/users',userRoute)
app.use('/api/blogs',blogRoute)
connectToDb();

//
 cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_SECRET_KEY // Click 'View API Keys' above to copy your API secret
    });

app.listen(port,()=>(console.log(`server running successfully on port number ${port}`)))

