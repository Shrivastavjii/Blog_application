import express from 'express'
//import { login, register } from '../controllers/userController.js'
import { createBlog, deleteBlog, getAllBlogs, getMyBlogs, getSingleBlogs, updateBlog,addComment,getComments,updateComment,deleteComment} from '../controllers/blogController.js'
import { isAdmin, isAuthenticated } from '../middlewares/authUser.js'

const router=express.Router()

router.post('/create',isAuthenticated,isAdmin("admin"),createBlog)
// router.post(
//   "/create",
//   isAuthenticated,
//   isAdmin("admin"),
//   (req, res, next) => {
//     console.log("Reached create route ✅, user:", req.user);
//     next();
//   },
//   createBlog
// );

router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog);
router.get("/all-blogs", getAllBlogs);
router.get("/single-blog/:id", isAuthenticated, getSingleBlogs);
router.get("/my-blog", isAuthenticated, isAdmin("admin"), getMyBlogs);
router.put("/update/:id", isAuthenticated, isAdmin("admin"), updateBlog);
router.post('/comment/:blogId', isAuthenticated, addComment);
router.get('/comments/:blogId', isAuthenticated, getComments);
router.put('/comments/:id', isAuthenticated, updateComment);   
router.delete('/comments/:id', isAuthenticated, deleteComment); 

export default router