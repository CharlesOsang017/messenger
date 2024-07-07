import express from 'express'
import { getUser, logOut, loginUser, registerUser, updateUser } from '../controllers/auth/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logOut)
router.get('/user', protect, getUser)
router.patch('/user', protect, updateUser)

export default router