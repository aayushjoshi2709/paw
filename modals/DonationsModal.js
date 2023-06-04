const mongoose = require("mongoose")
const DonationSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    image:String,
    description:String,
    ammount: mongoose.Types.Decimal128,
    phone:Number,
    orderId:String,
    email:String,
    status:String,
    custId:String
})
module.exports = mongoose.model("Donations",DonationSchema)
