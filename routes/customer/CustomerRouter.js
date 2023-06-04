const express=  require("express")
const router = express.Router()
require('dotenv').config()
const multer = require("multer")
const PaytmChecksum = require('./Paytm/checksum')
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
        let body = ''

        const orderId = 'TEST_' + new Date().getTime()
            let data = qs.parse(body)
            const paytmParams = {}
            paytmParams.body = {
                "requestType": "Payment",
                "mid": PAYTM_MERCHANT_ID,
                "websiteName": PAYTM_WEBSITE,
                "orderId": donation.orderId,
                "callbackUrl": PAYTM_CALLBACK_URL,
                "txnAmount": {
                    "value": donation.ammount,
                    "currency": "INR",
                },
                "userInfo": {
                    "custId": donation.email,
                },
            };

            PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), PAYTM_MERCHANT_KEY).then(function (checksum) {
                paytmParams.head = {
                    "signature": checksum
                };
                 var post_data = JSON.stringify(paytmParams);
                var options = {
                    hostname: (ENVIRONMENT=="STAGING")?'securegw-stage.paytm.in':'securegw.paytm.in',
                    port: 443,
                    path: `/theia/api/v1/initiateTransaction?mid=${PAYTM_MERCHANT_ID}&orderId=${donation.orderId}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };
                var response = "";
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });
                    post_res.on('end', function () {
                        response = JSON.parse(response)
                        console.log('txnToken:', response);
                        res.writeHead(200, { 'Content-Type': 'text/html' })
                        res.write(`<html>
                            <head>
                                <title>Show Payment Page</title>
                            </head>
                            <body>
                                <center>
                                    <h1>Please do not refresh this page...</h1>
                                </center>
                                <form method="post" action="https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=${PAYTM_MERCHANT_ID}&orderId=${donation.orderId}" name="paytm">
                                    <table border="1">
                                        <tbody>
                                            <input type="hidden" name="mid" value="${PAYTM_MERCHANT_ID}">
                                                <input type="hidden" name="orderId" value="${donation.orderId}">
                                                <input type="hidden" name="txnToken" value="${response.body.txnToken}">
                                        </tbody>
                                  </table>
                                  <script type="text/javascript"> document.paytm.submit(); </script>
                               </form>
                            </body>
                         </html>`)
                        res.end()
                    });
                });
                post_req.write(post_data);
                post_req.end();
            });
    })
    
})

router.post("/donate/makepayout/processpayment", (req, res)=>{
    console.log(req.body)
})
module.exports = router;