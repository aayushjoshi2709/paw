const express=  require("express")
const router = express.Router()
require('dotenv').config()
const multer = require("multer")
const crypto = require("crypto")
const upload = multer({dest:'upload/donatorimages/'})
const DogsModal = require("../../modals/DogsModal")
const DonationsModal = require("../../modals/DonationsModal")
const DogAdoptionModal = require("../../modals/DogAdoptionModal")
const ContactUsModal = require("../../modals/ContactUsModal")

const Razorpay = require("razorpay")
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET
const RAZORPAY_CALLBACK_URL = process.env.HOST + "/donate/makepayment/success"
const instance =  new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET
})
router.get("/", (req, res)  =>{
    DogsModal.find({}).then((dogs)=>{
        res.render("index", {filename:"index",data:dogs})
    }).catch((ex)=>{
        console.log(ex)
    })
})
router.get("/contactus", (req, res)=>{
    res.render("contactus", {filename:"contactus"})
})
router.post("/dogadoption", (req, res)=>{
    const DogAdoption = new DogAdoptionModal({
        name:req.body.name,
        email:req.body.email,
        phoneno:req.body.phone,
        why:req.body.why,
        gender:req.body.gender
    })
    DogAdoption.save().then((DogAdoptionObj)=>{
        res.redirect("/contactus")
    }).catch((err)=>{
        res.redirect("/contactus")
    })
})
router.post("/contactus", (req, res)=>{
    const ContactUs = new ContactUsModal({
        name:req.body.name,
        email:req.body.email,
        phoneno:req.body.phone,
        query:req.body.query
    })
    ContactUs.save().then((ContactUsObj)=>{
        res.redirect("/contactus")
    }).catch((err)=>{
        res.redirect("/contactus")
    })
})
router.get("/donate", (req, res)=>{
    DonationsModal.find({status:"SUCCESS"}).then((response)=>{
        res.render("donate", {filename:"donate", data:response})
    }).catch((err)=>{
        console.log(err)
        res.render("donate", {filename:"donate", data:null})
    })
})
router.post("/donate/makepayment",upload.single("donateavatar"), (req, res, next)=>{
    let val = ""+Math.floor(Math.random() * 1000)+Math.floor(Math.random() * 1000)
    const orderId = "PAW_"+val
    const custId = "CUST"+val
    const Donations = new DonationsModal({
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        image:req.file.path,
        custId:custId,
        description:req.body.why,
        ammount: req.body.ammount,
        phone:req.body.phone,
        orderId:orderId,
        status:"WAITING"
    })
    Donations.save().then((donation)=>{
        var options = {
            amount: donation.ammount,  
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        instance.orders.create(options, function(err, order) {
        if(!err){
            donation.orderId = order.id;
            donation.save().then((donate)=>{
                res.status(200).send({
                    "orderId": donate.orderId,
                    "callBackUrl":RAZORPAY_CALLBACK_URL,
                    "ammount":donation.ammount.toString() +"00",
                    "key":process.env.RAZORPAY_KEY,
                    "name":donation.fname + " " + donation.lname,
                    "email":donation.email,
                    "phone":donation.phone.toString()
                })
            })
          }  
        });
    })
})
router.post("/donate/makepayment/success", (req, res)=>{
    generated_signature = crypto.createHmac('sha256', RAZORPAY_SECRET).update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id).digest("HEX")
    if (generated_signature == req.body.razorpay_signature) {
        DonationsModal.findOne({orderId: req.body.razorpay_order_id}).then((donation)=>{
            donation.signature = req.body.razorpay_signature
            donation.paymentId = req.body.razorpay_payment_id
            donation.status = "SUCCESS"
            donation.save().then((donation)=>{
                res.redirect("/donate")
            })
        })
    }
})
 
module.exports = router;