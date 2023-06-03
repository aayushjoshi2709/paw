const express = require("express")
const ejs = require("ejs")
const mongoose = require("mongoose")
const multer = require("multer")
const DogsModal = require("./modals/DogsModal")
const DonationsModal = require("./modals/DonationsModal")
const bodyParser = require('body-parser')
app = express()
require('dotenv').config()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/upload'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.set("view engine", 'ejs')

mongoose.connect(DATABASE_URL).then(()=>{
    console.log("Successfully connected to the database")
}).catch((err)=>{
    console.log("Error connecting to the database")
})

const upload = multer({dest:'upload/images/'})

app.get("/", (req, res)=>{
    DogsModal.find({}).then((dogs)=>{
        res.render("index", {filename:"index",data:dogs})
    }).catch((ex)=>{
        console.log(ex)
    })
})
app.get("/contactus", (req, res)=>{
    res.render("contactus", {filename:"contactus"})
})
app.get("/donate", (req, res)=>{
    res.render("donate", {filename:"donate"})
})
// admin login routes
app.get("/login", (req, res)=>{
    res.render("login", {filename: "login"})
})
// admin dashboard routes
app.get("/admin/dashboard", (req,res)=>{
    res.render("admin_dashboard_index", {filename:"index"})
})
app.get("/admin/dashboard/dogs", (req,res)=>{
    DogsModal.find({}).then((dogs)=>{
        res.render("admin_dashboard_master", {filename:"dogs", data:dogs})
    }).catch((ex)=>{
        console.log(ex)
    })
})
app.get("/admin/dashboard/dogs/new", (req,res)=>{
    res.render("admin_add_dog", {filename:"adddog"})
})
app.post("/admin/dashboard/dogs", upload.single("dogavtar") , (req,res,next)=>{
    //code to add new dogs
    const dog = new DogsModal({
        image: req.file.path,
        description:req.body.desc,
        name:req.body.name
    });
    dog.save().then(()=>{
        res.redirect("/admin/dashboard/dogs")
    }).catch(()=>{
        res.redirect("/admin/dashboard/dogs")
    })
})
app.get("/admin/dashboard/donations", (req,res)=>{
    res.render("admin_dashboard_master", {filename:"donations"})
})
app.get("/admin/dashboard/contactus", (req,res)=>{
    res.render("admin_dashboard_master", {filename:"contactus"})
})
app.get("/admin/dashboard/changepass", (req,res)=>{
    res.render("admin_dashboard_changepass", {filename:"changepass"})
})  
// app.get("*", (req, res)=>{
//     res.redirect("/")
// })
app.listen(PORT, (err)=>{
    if(err)
        console.log("error starting server")
    else   
        console.log(`server started successfully in port ${PORT}`)
})