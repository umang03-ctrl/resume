// Add js-active class to body if IntersectionObserver is supported (for progressive enhancement scroll reveal)
if ('IntersectionObserver' in window) {
  document.body.classList.add('js-active');
}

// ==========================================================================
// 1. THEME SWITCHER CONTROLLER (SYNCED & LOCALSTORAGE PERSISTENT)
// ==========================================================================
const themeCheckbox = document.getElementById('themeCheckbox');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  themeCheckbox.checked = true;
  document.body.classList.add('light-theme');
} else {
  themeCheckbox.checked = false;
  document.body.classList.remove('light-theme');
}

themeCheckbox.addEventListener('change', () => {
  if (themeCheckbox.checked) {
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  }
  initCanvasThemeColors();
});

// ==========================================================================
// 2. MOBILE NAVIGATION DRAWER
// ==========================================================================
const menuToggle = document.getElementById('menuToggle');
const closeDrawer = document.getElementById('closeDrawer');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerLinks = document.querySelectorAll('.drawer-link');

if (menuToggle && mobileDrawer) {
  menuToggle.addEventListener('click', () => {
    mobileDrawer.classList.add('active');
  });
}

if (closeDrawer && mobileDrawer) {
  closeDrawer.addEventListener('click', () => {
    mobileDrawer.classList.remove('active');
  });
}

drawerLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileDrawer.classList.remove('active');
  });
});

// ==========================================================================
// 3. CERTIFICATE CAROUSEL (UPDATED LIST FOR UMANG RAJ GUPTA)
// ==========================================================================
const pdfList = [
  "assets/ctet_cert.html",
  "assets/nptel_cert.html",
  "assets/nep_sarthi_proof.html",
  "assets/st_johns_intern.html",
  "assets/ba_bed_marksheet.html"
];

let currentIndex = 0;

function updateViewer() {
  const iframe = document.getElementById("pdfFrame");
  const counter = document.getElementById("pdfCount");
  
  if (iframe && counter) {
    iframe.src = pdfList[currentIndex];
    counter.textContent = (currentIndex + 1) + " / " + pdfList.length;
  }
}

function nextPDF() {
  currentIndex = (currentIndex + 1) % pdfList.length;
  updateViewer();
}

function prevPDF() {
  currentIndex = (currentIndex - 1 + pdfList.length) % pdfList.length;
  updateViewer();
}

// ==========================================================================
// 4. GENERAL ASSET DIALOG MODAL
// ==========================================================================
const assetDialog = document.getElementById("assetDialog");
const dialogIframe = document.getElementById("dialogIframe");
const dialogTitle = document.getElementById("dialogTitle");
const closeDialogBtn = document.getElementById("closeDialogBtn");

function openAssetDialog(url, title) {
  if (assetDialog && dialogIframe && dialogTitle) {
    dialogIframe.src = url;
    dialogTitle.textContent = title;
    assetDialog.showModal();
  }
}

if (closeDialogBtn && assetDialog) {
  closeDialogBtn.addEventListener("click", () => {
    assetDialog.close();
    if (dialogIframe) dialogIframe.src = "";
  });
}

// ==========================================================================
// 5. INTERACTIVE NETWORK NODE BACKGROUND CANVAS
// ==========================================================================
const canvas = document.getElementById('canvas-network');
const ctx = canvas.getContext('2d');

let particles = [];
let maxParticles = 80;
let connectionDistance = 110;
let particleColor = 'rgba(13, 148, 136, 0.4)'; 
let lineColor = 'rgba(99, 102, 241, 0.08)';  

function initCanvasThemeColors() {
  const isLight = document.body.classList.contains('light-theme');
  if (isLight) {
    particleColor = 'rgba(15, 118, 110, 0.25)';  
    lineColor = 'rgba(79, 70, 229, 0.05)';      
  } else {
    particleColor = 'rgba(13, 148, 136, 0.45)';
    lineColor = 'rgba(99, 102, 241, 0.09)';
  }
}

let mouse = {
  x: null,
  y: null,
  radius: 150
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (window.innerWidth < 768) {
    maxParticles = 35;
    connectionDistance = 85;
  } else {
    maxParticles = 85;
    connectionDistance = 115;
  }
  initParticles();
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 2.5 + 1.5;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = particleColor;
    ctx.fill();
  }

  update() {
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    
    this.x += this.vx;
    this.y += this.vy;

    this.draw();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1 - (dist / connectionDistance);
        ctx.stroke();
      }
    }

    if (mouse.x !== null && mouse.y !== null) {
      let dx = particles[i].x - mouse.x;
      let dy = particles[i].y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = lineColor.replace('0.09', '0.2').replace('0.05', '0.12');
        ctx.lineWidth = 1 - (dist / mouse.radius);
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.update());
  drawConnections();
  requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', resizeCanvas);
initCanvasThemeColors();
resizeCanvas();
animateCanvas();

// ==========================================================================
// 6. SCROLL REVEAL INTERSECTION OBSERVER
// ==========================================================================
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active-reveal');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: "0px 0px -50px 0px"
});

reveals.forEach(el => revealObserver.observe(el));

// ==========================================================================
// 7. LIVE DATE & TIME CLOCK (FOOTER)
// ==========================================================================
function updateDateTime() {
  const yearSpan = document.getElementById("year");
  const clockDiv = document.getElementById("dateTime");
  const now = new Date();
  
  if (yearSpan) {
    yearSpan.textContent = now.getFullYear();
  }
  
  if (clockDiv) {
    clockDiv.textContent = now.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + "  |  " + now.toLocaleTimeString();
  }
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ==========================================================================
// 8. INTERACTIVE FEEDBACK RATING WIDGET
// ==========================================================================
let rating = 0;
const stars = document.querySelectorAll(".star");

stars.forEach(star => {
  star.addEventListener("click", () => {
    rating = parseInt(star.getAttribute("data-value"));
    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add("active");
    }
  });
});

function submitFeedback() {
  const comment = document.getElementById("comment").value;

  if (rating === 0) {
    alert("Please select a star rating first.");
    return;
  }

  console.log("Feedback Submitted:", { rating, comment });
  alert(`Thank you for your feedback!\nRating: ${rating} Star(s)\nComment: ${comment || 'None'}`);
  
  document.getElementById("comment").value = "";
  stars.forEach(s => s.classList.remove("active"));
  rating = 0;
}

document.addEventListener("DOMContentLoaded", () => {
  updateViewer();
});

window.nextPDF = nextPDF;
window.prevPDF = prevPDF;
window.openAssetDialog = openAssetDialog;
window.submitFeedback = submitFeedback;