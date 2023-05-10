const dogAdoptionHeading = document.getElementById("dogAdoption")
const contactUsHeading = document.getElementById("contactUs")
const dogAdoptionSpan = document.getElementById("dogAdoptionSpan")
const contactUsSpan = document.getElementById("contactUsSpan")
contactUsSpan.style.display = 'none'
function dogAdoption(e){
    contactUsHeading.classList.remove("active")
    dogAdoptionHeading.classList.add("active")
    contactUsSpan.style.display = 'none'
    dogAdoptionSpan.style.display = 'flex'
}
function contactUs(e){
    dogAdoptionHeading.classList.remove("active")
    contactUsHeading.classList.add("active")
    dogAdoptionSpan.style.display = 'none'
    contactUsSpan.style.display = 'flex'
}