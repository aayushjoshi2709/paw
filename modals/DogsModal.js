const mongoose = require("mongoose")
const DogsSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});
module.exports = new mongoose.model("Dogs", DogsSchema)
