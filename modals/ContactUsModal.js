const mongoose = require("mongoose")
const ContactUsSchema = new mongoose.Schema({
    name:String,
    email:String,
    phoneno:Number,
    query:String,
    date:{
        type: Date,
		default: Date.now
    }
})
module.exports = new mongoose.model("ContactUs", ContactUsSchema)