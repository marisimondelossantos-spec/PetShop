document.addEventListener("DOMContentLoaded", () => {
  const navbarDiv = document.getElementById("navbar");
  const footerDiv = document.getElementById("footer");

  if (navbarDiv) {
    fetch("components/navbar.html")
      .then(r => r.text())
      .then(html => navbarDiv.outerHTML = html);
  }
  if (footerDiv) {
    fetch("components/footer.html")
      .then(r => r.text())
      .then(html => footerDiv.outerHTML = html);
  }
});
