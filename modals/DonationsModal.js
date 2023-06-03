const mongoose = require("mongoose")
const DonationSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    ammount: mongoose.Types.Decimal128,
    TransactionId:String,
    status:String
})
module.exports = mongoose.model("Donations",DonationSchema)
