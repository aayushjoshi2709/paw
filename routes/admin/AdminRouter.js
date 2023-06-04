const express = require("express")
const router = express.Router()
const multer = require("multer")
const upload = multer({dest:'upload/images/'})
const DogsModal = require("../../modals/DogsModal")
const DonationsModal = require("../../modals/DonationsModal")
const DogAdoptionModal = require("../../modals/DogAdoptionModal")
const ContactUsModal = require("../../modals/ContactUsModal")

// admin dashboard routes
router.get("/login", (req, res)=>{
    res.render("admin/login", {filename: "login"})
})
router.get("/dashboard", (req,res)=>{
    res.render("admin/dashboard_index", {filename:"index"})
})
router.get("/dashboard/dogs", (req,res)=>{
    DogsModal.find({}).then((dogs)=>{
        res.render("admin/dashboard_master", {filename:"dogs", data:dogs})
    }).catch((ex)=>{
        console.log(ex)
    })
})
router.get("/dashboard/dogs/new", (req,res)=>{
    res.render("admin/add_dog", {filename:"adddog"})
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
    DonationsModal.find({}).then((response)=>{
        res.render("admin/dashboard_master", {filename:"donations", data:response})
    }).catch((err)=>{
        console.log(err)
        res.render("donate", {filename:"donate", data:null})
    })
})

router.get("/dashboard/contactus", (req,res)=>{
    ContactUsModal.find({}).then((data)=>{
        res.render("admin/contact_us", {filename:"Contact Us", data:data})
    }).catch((err)=>{
        console.log(err)
        res.render("admin/contact_us", {filename:"Contact Us", data:none})
    })
})
router.get("/dashboard/dogadoption", (req,res)=>{
    DogAdoptionModal.find({}).then((data)=>{
        res.render("admin/dog_adoption", {filename:"Dog Adoption", data:data})
    }).catch((err)=>{
        console.log(err)
        res.render("admin/dog_adoption", {filename:"Dog Adoption", data:none})
    })
})
router.get("/dashboard/changepass", (req,res)=>{
    res.render("admin/dashboard_changepass", {filename:"changepass"})
})  
module.exports = router;