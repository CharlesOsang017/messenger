import express from 'express'
import { getUser, logOut, loginUser, registerUser, updateUser } from '../controllers/auth/userController.js'
import { adminMiddleware, creatorMiddleware, protect } from '../middleware/authMiddleware.js'
import { deleteUser, getAllUsers } from '../controllers/auth/adminController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logOut)
router.get('/user', protect, getUser)
router.patch('/user', protect, updateUser)

// admin routes
router.delete('/admin/users/:id', protect, adminMiddleware, deleteUser)
router.get('/admin/users', protect, creatorMiddleware, getAllUsers)
export default router