document.addEventListener("DOMContentLoaded", function () {

  const button = document.querySelector(".language-block-desktop");
  const dropdown = document.querySelector(".language-picker-main");

  if (!button || !dropdown) return;

  /* Toggle dropdown */
  button.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  /* Close when clicking outside */
  document.addEventListener("click", function (e) {
    if (!dropdown.contains(e.target) && !button.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

});
