const express=require('express')

const router=express.Router()
const  authController=require('../controllers/auth.controller')
const authMiddleware=require('../middlewares/auth.middleware')

router.post('/register',authController.registerController)

router.post('/login',authController.loginController)

router.get('/get-me',authMiddleware.authUser,authController.getMe)
router.get('/logout',authMiddleware.authUser,authController.logoutUser)


module.exports=router