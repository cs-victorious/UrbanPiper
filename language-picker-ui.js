document.addEventListener("DOMContentLoaded", function () {

  const button = document.querySelector(".language-block-desktop");
  const dropdown = document.querySelector(".language-picker-main");

  if (!button || !dropdown) return;

  /* toggle dropdown */
  button.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  });

  /* close if clicked outside */
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target) && !button.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

});
