const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const { requireSignin, isAuth, isAdmin } = require("../middleware/auth");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { check, validationResult } = require("express-validator/check");

//Read a product
router.get("/product/:productId", (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
});

//Create a Product

router.post(
  "/product/create/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  (req, res) => {
   
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be updated"
        });
      }

 
      //check for all fields
      const { name, description, price, category, quantity, shipping } = fields;

      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !quantity ||
        !shipping
      ) {
        return res.status(400).json({
          msg: "All fields are required"
        });
      }

      let product = new Product(fields);

      //1kb = 1000
      //imb = 100000

      if (files.photo) {
        console.log("Files", files.photo);

        if (files.photo.size > 100000) {
          return res.status(400).json({
            error: "Image should be less than 1MB in size"
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }

      product.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: "unable to upload product"
          });
        }
        res.json(result);
      });
    });
  }
);

//Update a product
router.put('/product/:productId/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be updated"
        });
      }

      
      //check for all fields
      const { name, description, price, category, quantity, shipping } = fields;

      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !quantity ||
        !shipping
      ) {
        return res.status(400).json({
          error: "All fields are required"
        });
      }

      let product = req.product;
      product = _.extend(product,fields)

      //1kb = 1000
      //imb = 100000

      if (files.photo) {
        

        if (files.photo.size > 100000) {
          return res.status(400).json({
            error: "Image should be less than 1MB in size"
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }

      product.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: "unable to upload product"
          });
        }
        res.json(result);
      });
    });

})

//Delete a product
router.delete('/product/:productId/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    let product = req.product
    product.remove((err,deletedProduct) =>{
        if(err){
            return res.status(400).json({
                error:"Error in deleting the product"
            })
        }
        res.json({
            message:"Product deleted successfully"
        })
    })
})


//Get products list
/**
 * sell/arrival
 * by sell = /products?sortBy=sold&order=desc&limit=3
 * by arrival = /products?sortBy=createdAt&order=desc&limit=3
 * if no params are sent , then all products are returned
 */


router.get('/products',(req,res) =>{
  let order  = req.query.order ? req.query.order :"asc"
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
  let limit = req.query.limit ? parseInt(req.query.limit) : 6

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,products) => {
      if(err){
        return res.status(400).json({
          msg:"Products not found"
      }) 
      }
      res.send(products)
    })
})


//Get Related Products based upon the selected product category
router.get('/products/related/:productId',(req,res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6

  Product.find({_id:{$ne:req.product},category:req.product.category})
      .limit(limit)
      .populate('category','_id name')
      .exec((err,products) => {
        if(err){
            return res.status(400).json({
              error:"Products not found"
            })
        }
        res.json(products)
      })
})

//get categories
router.get('/products/categories',(req,res) => {
  Product.distinct("category",{},(err,categories) => {
    if(err){
      return res.status(400).json({
        error:"Categories not found"
      })
    }
    res.json(categories)
  })
})

//Search Products
router.post('/products/by/search', (req, res) =>{
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  console.log(order, sortBy, limit, skip, req.body.filters);
  console.log("findArgs", findArgs);
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
        if (key === "price") {
            // gte -  greater than price [0-10]
            // lte - less than
            findArgs[key] = {
                $gte: req.body.filters[key][0],
                $lte: req.body.filters[key][1]
            };
        } else {
            findArgs[key] = req.body.filters[key];
        }
    }
}

Product.find(findArgs)
.select("-photo")
.populate("category")
.sort([[sortBy, order]])
.skip(skip)
.limit(limit)
.exec((err, data) => {
    if (err) {
        return res.status(400).json({
            error: "Products not found"
        });
    }
    res.json({
        size: data.length,
        data
    });
});
})

//Product Photo
router.get('/product/photo/:productId',(req,res,next)=>{
  if(req.product.photo.data){
      res.set("Content-Type",req.product.photo.contentType);
      return res.send(req.product.photo.data)
  }
  next()
})

//user param
router.param("userId", (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    req.profile = user;
    next();
  });
});

//product param
router.param("productId", (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "product not found"
      });
    }
    req.product = product;
    next();
  });
});

//Products searcg

router.get('/products/search',(req,res) => {
  // Create query object to hold search value and category value
  const query = {}
  //assign search value to query.name
  if(req.query.search){
      query.name = {$regex:req.query.search,$options:'i'}
      //assign category value to query.category
      if(req.query.category && req.query.category != 'All'){
          query.category = req.query.category
      }
      //find the object based on query object with 2 properties
      //search and category
      Product.find(query,(err,products) => {
          if(err){
            return res.status(400).json({
                error:"No Products Found"
            })
          }
          res.json(products)
      }).select('-photo')
  }
})

module.exports = router;
