require('dotenv').config()
const mongoose = require("mongoose")
const UserModal = require("./modals/UserModal")
const DATABASE_URL = process.env.DATABASE_URL
mongoose.connect(DATABASE_URL).then(()=>{
    console.log("Successfully connected to the database")
}).catch((err)=>{
    console.log("Error connecting to the database")
})
const newUser =new UserModal({username:"admin"});
UserModal.register(newUser,process.env.DEFAULT_PASSWORD,function(error,user){
    if(error){
        console.log("error creating user")
        process.exit()
    }else{
        console.log("user created successfully")
        process.exit()
    }
})