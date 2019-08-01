const express = require("express")
const app = express()
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require("express-validator")
const cors = require('cors')
require('dotenv').config;

// Connect Database
connectDB();

//middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())
// routes middleware
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)

const Port = process.env.PORT || 8000;

app.listen(Port,()=>{
    console.log(`server is started on port ${Port}`)
})






  