const express = require("express")
const router = express.Router()
const multer = require("multer")
const passport = require("passport")
const upload = multer({dest:'upload/images/'})
const fs = require("fs")
const DogsModal = require("../../modals/DogsModal")
const DonationsModal = require("../../modals/DonationsModal")
const DogAdoptionModal = require("../../modals/DogAdoptionModal")
const ContactUsModal = require("../../modals/ContactUsModal")
const UserModal = require("../../modals/UserModal")

const isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/admin/login");
    }
}

router.get("/login", (req, res)=>{
    res.render("admin/login", {filename: "login"})
})
router.post("/login", passport.authenticate("local",{
    successRedirect:"/admin/dashboard",
    failureRedirect:"/admin/login"
}), (req, res)=>{})

router.get("/logout", (req, res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
})

router.post("/changepassword", (req, res)=>{
    UserModal.findByUsername(req.user.username).then((user)=>{

        user.changePassword(req.body.opass, 
            req.body.npass, function (err) {
                if (err) {
                    res.redirect("/admin/dashboard/changepass")
                } else {
                    res.redirect("/admin/login")
                }
            })
    })
})

router.get("/dashboard",isLoggedIn, (req,res)=>{
    res.render("admin/dashboard_index", {filename:"index"})
})
router.get("/dashboard/dogs",isLoggedIn, (req,res)=>{
    DogsModal.find({}).then((dogs)=>{
        res.render("admin/dashboard_master", {filename:"dogs", data:dogs})
    }).catch((ex)=>{
        console.log(ex)
    })
})
router.put("/dashboard/dogs",isLoggedIn, upload.single("dogavtar"), (req,res)=>{
    const id = req.body.id;
    DogsModal.findById(id).then((dog)=>{
        if(req.body.name != undefined)
        dog.name = req.body.name;
        if(req.body.desc != undefined)
        dog.description = req.body.desc;
        if(req.file != undefined){
            if(fs.existsSync('./'+dog.image)){
                fs.unlinkSync('./'+dog.image, (err)=>{
                    console.log(err)
                })
            }
            dog.image = req.file.path;
        }
        dog.save().then((count)=>{
            res.redirect("/admin/dashboard/dogs")
        }).catch((ex)=>{console.log(ex)})
    }).catch((ex)=>{
        console.log(ex)
    })
})
router.delete("/dashboard/dogs/:id",isLoggedIn, (req,res)=>{
    const id = req.params.id;
    DogsModal.findByIdAndRemove(id).then((count)=>{
        res.status(200).send("dog deleted")
    }).catch((ex)=>{
        console.log(ex)
    })
})
router.get("/dashboard/dogs/new",isLoggedIn, (req,res)=>{
    res.render("admin/add_dog", {filename:"adddog"})
})

router.get("/dashboard/dogs/edit/:id",isLoggedIn, (req,res)=>{
    const id = req.params.id;
    DogsModal.findById(id).then((dogData)=>{   
        res.render("admin/add_dog", {filename:"updatedog", data:dogData, id:id})
    }).catch((ex)=>{console.log(ex)})
})

router.post("/dashboard/dogs",isLoggedIn, upload.single("dogavtar") , (req,res,next)=>{
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
router.get("/dashboard/donations",isLoggedIn, (req,res)=>{
    DonationsModal.find({}).then((response)=>{
        res.render("admin/dashboard_master", {filename:"donations", data:response})
    }).catch((err)=>{
        console.log(err)
        res.render("donate", {filename:"donate", data:null})
    })
})

router.get("/dashboard/contactus",isLoggedIn, (req,res)=>{
    ContactUsModal.find({}).then((data)=>{
        res.render("admin/contact_us", {filename:"Contact Us", data:data})
    }).catch((err)=>{
        console.log(err)
        res.render("admin/contact_us", {filename:"Contact Us", data:none})
    })
})
router.get("/dashboard/dogadoption",isLoggedIn, (req,res)=>{
    DogAdoptionModal.find({}).then((data)=>{
        res.render("admin/dog_adoption", {filename:"Dog Adoption", data:data})
    }).catch((err)=>{
        console.log(err)
        res.render("admin/dog_adoption", {filename:"Dog Adoption", data:none})
    })
})
router.get("/dashboard/changepass",isLoggedIn, (req,res)=>{
    res.render("admin/dashboard_changepass", {filename:"changepass"})
})  
module.exports = router;