const express = require("express")
const app = express()
const ejs = require("ejs")
const mongoose = require("mongoose")
const passport = require("passport")
const localStrategy = require("passport-local")
const UserModal = require("./modals/UserModal")
var methodOverride = require('method-override')
const AdminRouter = require("./routes/admin/AdminRouter")
const CustomerRouter = require("./routes/customer/CustomerRouter")
const bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
app.set("view engine", 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/upload'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(methodOverride('_method'))
app.use(bodyParser.json())

app.use(session({
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(UserModal.authenticate()))
passport.serializeUser(UserModal.serializeUser())
passport.deserializeUser(UserModal.deserializeUser())

app.use((req,res, next)=>{
    res.locals.currentUser = req.user;
    next()
})

mongoose.connect(DATABASE_URL).then(()=>{
    console.log("Successfully connected to the database")
}).catch((err)=>{
    console.log("Error connecting to the database")
})
app.use("/admin", AdminRouter);
app.use("/", CustomerRouter);
// app.get("*", (req, res)=>{
//     res.redirect("/")
// })
app.listen(PORT, (err)=>{
    if(err)
        console.log("error starting server")
    else   
        console.log(`server started successfully in port ${PORT}`)
})