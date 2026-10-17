/* ==========================================================
   PAOREEL V2
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("%cPAOREEL V2",
        "font-size:18px;font-weight:bold;color:#c8a96a;");
        fetch('/content.json')
        .then(response => response.json())
        .then(data => {
            if (document.getElementById('cms-hero-subtitle')) {
                document.getElementById('cms-hero-subtitle').textContent = data.about.hero_subtitle;
                document.getElementById('cms-hero-title').textContent = data.about.hero_title;
                document.getElementById('cms-hero-desc').textContent = data.about.hero_desc;
            }
        })
        .catch(error => console.error('Error loading content:', error));

});