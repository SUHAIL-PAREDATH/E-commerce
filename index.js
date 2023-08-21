const express = require('express')
const path=require('path')
const ejs=require('ejs')
const logger=require('morgan')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const session=require('express-session')
const crypto=require('crypto')
const PORT =process.env.PORT|| 3000
dotenv.config({path:'.env'})

const app = express()

// ====================
// const generateRandomString = (length) => {
//     return crypto.randomBytes(length).toString('hex');
//   };
  
//   const sessionSecretKey = generateRandomString(32); // 32 bytes (256 bits) is a common length for a session secret key
//   console.log('Session Secret Key:', sessionSecretKey);
// =================

const db = require('./config/connection')
db.dbConnect()


const userRouter=require('./routes/user')
const adminRouter=require('./routes/admin')
 
app.set('views',path.join(__dirname,'views'))
app.set('view engine',"ejs")

const oneDay=1000*60*60*24
app.use(session({
    secret:process.env.Session_Secret,
    saveUninitialized:true,
    cookie:{maxAge:oneDay},
    resave:false
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/public',express.static(path.join(__dirname,"public")))



// Routes
app.use('/',userRouter)
app.use('/admin',adminRouter)


app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))