const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer({dest:'upload/images/'})
const DogsModal = require("../../modals/DogsModal")
const DonationsModal = require("../../modals/DonationsModal")

// admin dashboard routes
router.get("/login", (req, res)=>{
    res.render("login", {filename: "login"})
})
router.get("/dashboard", (req,res)=>{
    res.render("admin_dashboard_index", {filename:"index"})
})
router.get("/dashboard/dogs", (req,res)=>{
    DogsModal.find({}).then((dogs)=>{
        res.render("admin_dashboard_master", {filename:"dogs", data:dogs})
    }).catch((ex)=>{
        console.log(ex)
    })
})
router.get("/dashboard/dogs/new", (req,res)=>{
    res.render("admin_add_dog", {filename:"adddog"})
})
router.post("/dashboard/dogs", upload.single("dogavtar") , (req,res,next)=>{
    //code to add new dogs
    const dog = new DogsModal({
        image: req.file.path,
        description:req.body.desc,
        name:req.body.name
    });
    dog.save().then(()=>{
        res.redirect("/admin/dashboard/dogs")
    }).catch(()=>{
        res.redirect("/admin/dashboard/dogs")
    })
})
router.get("/dashboard/donations", (req,res)=>{
    res.render("admin_dashboard_master", {filename:"donations", data:null})
})
router.get("/dashboard/contactus", (req,res)=>{
    res.render("admin_dashboard_master", {filename:"contactus", data:null})
})
router.get("/dashboard/changepass", (req,res)=>{
    res.render("admin_dashboard_changepass", {filename:"changepass"})
})  
module.exports = router;