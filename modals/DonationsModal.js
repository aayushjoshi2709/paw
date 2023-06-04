const mongoose = require("mongoose")
const DonationSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    image:String,
    description:String,
    ammount: Number,
    phone:Number,
    orderId:String,
    email:String,
    status:String,
    paymentId:String,
    signature:String
})
module.exports = mongoose.model("Donations",DonationSchema)
