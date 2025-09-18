import express from 'express'
import { getAdmins, getMyProfile, login, logout, register } from '../controllers/userController.js'
import { isAuthenticated } from '../middlewares/authUser.js'

const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',isAuthenticated,logout)
router.get("/my-profile", isAuthenticated, getMyProfile);
router.get("/admins", getAdmins);
export default router