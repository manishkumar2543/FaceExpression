const userModel=require('../models/user.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');
const redis = require('../config/cache');


async function registerController(req,res){
    const {username,email,password}=req.body;

    const isAlreadyRegistered=await userModel.findOne({
        $or:[
            {email:email},
            {username:username}
        ]
    })

    if(isAlreadyRegistered){
        return res.status(400).json({
            message:"User already registered"
        })
    }

    const hashedPassword=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        password:hashedPassword
    })

    const token=jwt.sign({
        id:user._id,
        username:user.username,
       
    },process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie('token',token)

    res.status(201).json({
        message:'User registered successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
        
    

}

async function loginController(req,res){
    const {username,email,password}=req.body;

    const user=await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    }).select('+password')
    if(!user){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        })
    }

    const token=jwt.sign({
        id:user._id,
        username:user.username,
       
    },process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie('token',token)

    res.status(200).json({
        message:'User logged in successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })


}

async function getMe(req,res){
    


    const user=await userModel.findById(req.user.id)
    res.status(200).json({
        message:'User fetched successfully',
        user
    })
}

async function logoutUser(req,res){
    const token=req.cookies.token;


    res.clearCookie('token')
   await redis.set(token, Date.now().toString(), 'EX', 60 * 60 )
    res.status(201).json({
        message:'User logged out successfully'
    })
}


module.exports={
    registerController,
    loginController,
    getMe,
    logoutUser
}