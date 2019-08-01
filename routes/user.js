const express = require("express")
const router = express.Router()
const User = require('../models/user')
const {requireSignin,isAuth,isAdmin} = require("../middleware/auth")

router.get('/secret/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
        user:req.profile
    })
})


router.get('/user/:userId',requireSignin,isAuth,(req,res) => {
        req.profile.password = undefined
        return res.json(req.profile)
})

router.put('/user/:userId',requireSignin,isAuth,(req,res)=>{
        User.findOneAndUpdate(
            {_id:req.profile._id},
            {$set:req.body},
            {new:true},
            (err,user) => {
                if(err){
                    return res.status(400).json({
                        error:"You are not authorized to perform this action"
                    })
                }
                user.password = undefined
                res.json(user)
            }
        )
})

router.param('userId',(req,res,next,id)=>{

    User.findById(id).exec((err,user) =>{
        if(err || !user){
            return res.status(400).json({
                error:"User not found"
            })
        }
        req.profile = user;
        next()
    })
})





module.exports = router