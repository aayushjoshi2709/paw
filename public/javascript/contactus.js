const dogAdoptionHeading = document.getElementById("dogAdoption")
const contactUsHeading = document.getElementById("contactUs")
const contactUsForm = document.getElementById('contactUsForm')
const dogAdoptionForm = document.getElementById('dogAdoptionForm')
contactUsForm.style.display = 'none'
function dogAdoption(e){
    contactUsHeading.classList.remove("active")
    dogAdoptionHeading.classList.add("active")
    contactUsForm.style.display = 'none'
    dogAdoptionForm.style.display = 'flex'
}
function contactUs(e){
    dogAdoptionHeading.classList.remove("active")
    contactUsHeading.classList.add("active")
    dogAdoptionForm.style.display = 'none'
    contactUsForm.style.display = 'flex'
}