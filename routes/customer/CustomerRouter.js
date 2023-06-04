const express=  require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer({dest:'upload/images/'})
const DogsModal = require("../../modals/DogsModal")
const DonationsModal = require("../../modals/DonationsModal")

router.get("/", (req, res)=>{
    DogsModal.find({}).then((dogs)=>{
        res.render("index", {filename:"index",data:dogs})
    }).catch((ex)=>{
        console.log(ex)
    })
})
router.get("/contactus", (req, res)=>{
    res.render("contactus", {filename:"contactus"})
})
router.get("/donate", (req, res)=>{
    res.render("donate", {filename:"donate"})
})
router.post("/donate/makepayment", (req, res)=>{
    res.render("donate", {filename:"donate"})
})
module.exports = router;