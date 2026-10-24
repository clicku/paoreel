document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById("global-footer");
  if (!footerContainer) return;

  const currentYear = new Date().getFullYear();

  footerContainer.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="assets/images/logo.webp" alt="Paoreel Studios" onerror="this.style.display='none';">
          <p>Cinematic Food, Product &amp; Portrait Photography</p>
        </div>

        <div class="footer-links">
          <span class="footer-col-title">Navigation</span>
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="portfolio.html">Portfolio</a>
          <a href="contact.html">Contact</a>
          <a href="legal.html">Disclaimer</a>
        </div>

        <div class="footer-social">
          <span class="footer-col-title">Connect</span>
          <a href="https://facebook.com/paoreelph" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-facebook-f" aria-hidden="true"></i><span>Facebook</span>
          </a>
          <a href="https://instagram.com/paoreelph" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-instagram" aria-hidden="true"></i><span>Instagram</span>
          </a>
          <a href="https://linkedin.com/in/pao-lee-7467a0384" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-linkedin-in" aria-hidden="true"></i><span>LinkedIn</span>
          </a>
          <a href="viber://chat?number=639260218440" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-viber" aria-hidden="true"></i><span>Viber</span>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        &copy; <span id="footer-year">${currentYear}</span> Paoreel Studios. All Rights Reserved.
      </div>
    </footer>
  `;
});