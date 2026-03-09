document.addEventListener("DOMContentLoaded", function () {

  const button = document.querySelector(".language-block-desktop");
  const dropdown = document.querySelector(".language-picker-main");

  if (!button || !dropdown) return;

  /* OPEN / CLOSE DROPDOWN */

  button.addEventListener("click", function (e) {
    e.stopPropagation();

    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  });

  /* CLOSE WHEN CLICK OUTSIDE */

  document.addEventListener("click", function (e) {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

});
