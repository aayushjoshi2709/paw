const express = require("express")
const app = express()
const ejs = require("ejs")
const mongoose = require("mongoose")
const AdminRouter = require("./routes/admin/AdminRouter")
const CustomerRouter = require("./routes/customer/CustomerRouter")
const bodyParser = require('body-parser')
require('dotenv').config()
const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
app.set("view engine", 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/upload'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
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