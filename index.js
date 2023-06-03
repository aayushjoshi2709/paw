const express = require("express")
const ejs = require("ejs")
app = express()
require('dotenv').config()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
app.use(express.static(__dirname + '/public'))
app.set("view engine", 'ejs')

app.get("/", (req, res)=>{
    res.render("index", {filename:"index"})
})
app.get("/contactus", (req, res)=>{
    res.render("contactus", {filename:"contactus"})
})
app.get("/donate", (req, res)=>{
    res.render("donate", {filename:"donate"})
})
app.get("/login", (req, res)=>{
    res.render("login", {filename: "login"})
})
app.get("/admin/dashboard", (req,res)=>{
    res.render("admin_dashboard_index", {filename:"index"})
})
app.get("*", (req, res)=>{
    res.redirect("/")
})
app.listen(PORT, (err)=>{
    if(err)
        console.log("error starting server")
    else   
        console.log(`server started successfully in port ${PORT}`)
})