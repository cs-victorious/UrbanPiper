/* ======================================
URBANPIPER LANGUAGE PICKER UI CONTROLLER
====================================== */

document.addEventListener("DOMContentLoaded", function () {

/* ================================
ELEMENT SELECTORS
================================ */

const picker = document.querySelector(".language-picker-main");
const button = document.querySelector(".language-block-desktop");

/* ================================
DROPDOWN TOGGLE
================================ */

if (button && picker) {

button.addEventListener("click", function (e) {

e.preventDefault();
e.stopPropagation();

picker.classList.toggle("active");

});

}

/* ================================
CLICK OUTSIDE CLOSE
================================ */

document.addEventListener("click", function (e) {

if (
picker &&
!picker.contains(e.target) &&
button &&
!button.contains(e.target)
) {
picker.classList.remove("active");
}

});

/* ================================
COUNTRY HOVER → SHOW LANGUAGES
================================ */

document.querySelectorAll(".language-picker-list li").forEach(function (country) {

country.addEventListener("mouseenter", function () {

const code = this.getAttribute("country");

/* hide all language lists */

document.querySelectorAll(".language-col-right ul").forEach(function (el) {
el.style.display = "none";
});

/* show correct language list */

const list = document.querySelector(".language-picker-list-" + code);

if (list) {
list.style.display = "block";
}

});

});

/* ================================
COUNTRY CLICK (DEFAULT ENGLISH)
================================ */

document.querySelectorAll(".language-picker-list li").forEach(function (country) {

country.addEventListener("click", function () {

const code = this.getAttribute("country");

/* if country does NOT have language submenu */

if (!this.classList.contains("lpl-haschildren")) {

localStorage.setItem("source", "drpdwn");
localStorage.setItem("country", code);
localStorage.setItem("lang", "en");

/* trigger redirect engine */

if (typeof RedirectbyLoc === "function") {
RedirectbyLoc("drpdwn", code, "en");
}

}

});

});

/* ================================
LANGUAGE CLICK
================================ */

document.querySelectorAll(
".language-picker-list-ae li,\
.language-picker-list-sa li,\
.language-picker-list-es li,\
.language-picker-list-kw li,\
.language-picker-list-qa li,\
.language-picker-list-bh li,\
.language-picker-list-eg li"
).forEach(function (el) {

el.addEventListener("click", function (e) {

e.stopPropagation();

const country = this.getAttribute("country");
const lang = this.getAttribute("lang");

localStorage.setItem("source", "drpdwn");
localStorage.setItem("country", country);
localStorage.setItem("lang", lang);

/* redirect */

if (typeof RedirectbyLoc === "function") {
RedirectbyLoc("drpdwn", country, lang);
}

});

});

});
