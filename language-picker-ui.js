/* ================================
LANGUAGE PICKER UI CONTROLLER
================================ */

document.addEventListener("DOMContentLoaded", function(){

const picker = document.querySelector(".language-picker-main");
const button = document.querySelector(".language-block-desktop");

/* Toggle dropdown */

if(button && picker){

button.addEventListener("click", function(e){

e.stopPropagation();
picker.classList.toggle("active");

});

}


/* Close dropdown */

document.addEventListener("click", function(e){

if(picker && !picker.contains(e.target) && !button.contains(e.target)){
picker.classList.remove("active");
}

});


/* Country hover */

document.querySelectorAll(".language-picker-list li").forEach(function(country){

country.addEventListener("mouseenter", function(){

const code = this.getAttribute("country");

document.querySelectorAll(".language-col-right ul")
.forEach(el => el.style.display="none");

const list = document.querySelector(".language-picker-list-"+code);

if(list){
list.style.display="block";
}

});

});


/* Language click */

document.querySelectorAll(
".language-picker-list-ae li,\
.language-picker-list-sa li,\
.language-picker-list-es li,\
.language-picker-list-kw li,\
.language-picker-list-qa li,\
.language-picker-list-bh li,\
.language-picker-list-eg li"
).forEach(function(el){

el.addEventListener("click", function(){

const country = this.getAttribute("country");
const lang = this.getAttribute("lang");

localStorage.setItem("source","drpdwn");
localStorage.setItem("country",country);
localStorage.setItem("lang",lang);

RedirectbyLoc("drpdwn", country, lang);

});

});

});
