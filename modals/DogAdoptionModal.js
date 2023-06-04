const mongoose = require("mongoose")
const DogAdoptionSchema = new mongoose.Schema({
    name:String,
    email:String,
    phoneno:Number,
    why:String,
    gender:String,
    date:{
        type: Date,
		default: Date.now
    }
})
module.exports = new mongoose.model("DogAdoption", DogAdoptionSchema)