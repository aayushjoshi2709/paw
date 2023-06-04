const express=  require("express")
const router = express.Router()
require('dotenv').config()
const multer = require("multer")
const checksum_lib = require('./Paytm/checksum')
const { response } = require('express')
const https = require('https');
const upload = multer({dest:'upload/donatorimages/'})
const DogsModal = require("../../modals/DogsModal")
const DonationsModal = require("../../modals/DonationsModal")
const ENVIRONMENT = process.env.ENVIRONMENT;
const PAYTM_CALLBACK_URL = process.env.HOST + "/donate/makepayout/processpayment";
const PAYTM_MERCHANT_ID = process.env.PAYTM_MERCHANT_ID;
const PAYTM_MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY;
const PAYTM_WEBSITE = process.env.PAYTM_WEBSITE;

const path = require('path')
const qs = require('querystring')



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
router.post("/donate/makepayment",upload.single("donateavatar"), (req, res, next)=>{
    const orderId = "PAW"+Math.floor(Math.random() * 1000)+Date.now()
    const custId = "CUST"+Math.floor(Math.random() * 1000)+Date.now()
    const Donations = new DonationsModal({
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        image:req.file.path,
        custId:custId,
        description:req.body.why,
        ammount: parseFloat(req.body.ammount),
        phone:req.body.phone,
        orderId:orderId,
        status:"Waiting"
    })
    Donations.save().then((donation)=>{
        var params = {};
        console.log(PAYTM_MERCHANT_ID)
        params['MID'] = PAYTM_MERCHANT_ID;
        params['WEBSITE'] = PAYTM_WEBSITE;
        params['CHANNEL_ID'] = 'WEB';
        params['INDUSTRY_TYPE_ID'] = 'Retail';
        params['ORDER_ID'] = donation.orderId;
        params['CUST_ID'] = donation.custId;
        params['TXN_AMOUNT'] = donation.ammount.toString();
        params['CALLBACK_URL'] = PAYTM_CALLBACK_URL;
        params['EMAIL'] = donation.email;
        params['MOBILE_NO'] = donation.phone.toString(); 
        params_copy={
            ...params
        }
        checksum_lib.genchecksum(params, PAYTM_MERCHANT_KEY, function (err, checksum) {
          var txn_url =(ENVIRONMENT == "STAGING")?"https://securegw-stage.paytm.in/theia/processTransaction":"https://securegw.paytm.in/theia/processTransaction";
          var form_fields = "";
          for (var x in params_copy) {
            console.log(x, params_copy[x])
            form_fields += `<input type='hidden' name="${x}" value= "${params_copy[x]}" >`;
          }
          form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
          console.log(form_fields)
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
          res.end();
        });
    })
    
})

router.post("/donate/makepayout/processpayment", (req, res)=>{
    console.log(req.body)
})
module.exports = router;