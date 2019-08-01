const express = require("express");
const router = express.Router();
const User = require('../models/user')
const Category = require('../models/category')
const {requireSignin,isAuth,isAdmin} = require("../middleware/auth")
const { check } = require("express-validator/check");

router.get('/category/:categoryId',(req,res)=>{
    return res.json(req.category)
})

router.post("/category/create/:userId",
[
    check("name", "Category name is required")
    .not()
    .isEmpty(),
],

requireSignin,isAuth,isAdmin,async(req,res)=>{
    const errors = req.validationErrors();
    if (errors) {
      const firsterror = errors.map(i => i.msg)[0]
      return res.status(400).json({ msg: firsterror });
    }
    const {name} = req.body
 
let category = await Category.findOne({ name });

      if (category) {
        return res.status(400).json({ msg: "Category already exists" });
      }

      category = new Category(req.body)

category.save((err,data)=>{
    if(err){
        return res.status(400).json({
            error:"Unable to save category"
        })
    }
    res.json({data});
})
})

router.put("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,(req,res) => {
    const category = req.category;
    category.name = req.body.name
    category.save((err,data) => {
        if(err){
            return res.status(400).json({
                error:"error in upating the category"
            }) 
        }
        res.json(data)
    })
})

router.delete("/category/:categoryId/:userId",

requireSignin,isAuth,isAdmin,(req,res) => {
    

    const category = req.category;
    category.remove((err,data) => {
        if(err){
            return res.status(400).json({
                error:"error in deleting the category"
            })   
        }
        res.json({
            message:"Category Deleted"
        })
    })
})

router.get("/categories",(req,res)=>{
    Category.find().exec((err,data) => {
        if(err){
            return res.status(400).json({
                error:"error in getting categories list"
            })
        }
        res.json(data)
    })
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

router.param('categoryId',(req,res,next,id)=>{

    Category.findById(id).exec((err,category) =>{
        if(err || !category){
            return res.status(400).json({
                error:"category not found"
            })
        }
        req.category = category;
        next()
    })
})

module.exports = router