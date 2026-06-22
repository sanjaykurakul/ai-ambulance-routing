const API_BASE_URL = "https://jsonplaceholder.typicode.com";
const INSIGHTS_ENDPOINT = "/posts";
const INSIGHTS_LIMIT = 6;

const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("ambulanceai-theme", theme);
}
const savedTheme = localStorage.getItem("ambulanceai-theme") || "light";
applyTheme(savedTheme);

themeToggleBtn.addEventListener("click", function () {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", function () {
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  });
});

const watchDemoBtn = document.getElementById("watchDemoBtn");

watchDemoBtn.addEventListener("click", function () {
  const howItWorksSection = document.getElementById("how-it-works");
  howItWorksSection.scrollIntoView({ behavior: "smooth" });
});


const revealTargets = document.querySelectorAll(
  ".feature-card, .pricing-card, .step-card, .testimonial-card, .stat-box, .insight-card"
);

revealTargets.forEach(function (el) {
  el.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach(function (el) {
  revealObserver.observe(el);
});

const statBoxes = document.querySelectorAll(".stat-box");
let statsHaveAnimated = false; // run the count-up only once

function animateCount(statBox) {
  const numberEl = statBox.querySelector(".stat-number");
  const target = parseInt(statBox.getAttribute("data-target"), 10);
  const suffix = statBox.getAttribute("data-suffix") || "";

  let current = 0;
  // Roughly 60 steps gives a smooth count-up without being slow
  const steps = 60;
  const increment = target / steps;

  const counter = setInterval(function () {
    current += increment;

    if (current >= target) {
      numberEl.textContent = target.toLocaleString() + suffix;
      clearInterval(counter);
    } else {
      numberEl.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 25);
}

const statsObserver = new IntersectionObserver(
  function (entries) {
    if (statsHaveAnimated) return;

    const statsAreVisible = entries.some(function (entry) {
      return entry.isIntersecting;
    });

    if (statsAreVisible) {
      statBoxes.forEach(animateCount);
      statsHaveAnimated = true;
    }
  },
  { threshold: 0.3 }
);

if (statBoxes.length > 0) {
  statsObserver.observe(statBoxes[0].closest(".stats-section"));
}

const insightsGrid = document.getElementById("insightsGrid");
const insightsError = document.getElementById("insightsError");

function makeShortDescription(fullBody) {
  const maxLength = 90;
  if (fullBody.length <= maxLength) return fullBody;
  return fullBody.slice(0, maxLength).trim() + "...";
}

function buildInsightCardHTML(post) {
  const shortDescription = makeShortDescription(post.body);

  return (
    '<div class="insight-card reveal">' +
      '<span class="insight-id">Article #' + post.id + "</span>" +
      "<h3>" + post.title + "</h3>" +
      "<p>" + shortDescription + "</p>" +
      '<a href="https://jsonplaceholder.typicode.com/posts/' + post.id + '" target="_blank" rel="noopener" class="read-more">Read More →</a>' +
    "</div>"
  );
}

async function loadHealthcareInsights() {
  try {
    const response = await fetch(API_BASE_URL + INSIGHTS_ENDPOINT);

    if (!response.ok) {
      throw new Error("API responded with status " + response.status);
    }

    const allPosts = await response.json();
    const posts = allPosts.slice(0, INSIGHTS_LIMIT);

    insightsGrid.innerHTML = "";

    posts.forEach(function (post) {
      insightsGrid.innerHTML += buildInsightCardHTML(post);
    });
    const newCards = insightsGrid.querySelectorAll(".insight-card");
    newCards.forEach(function (card) {
      revealObserver.observe(card);
    });
  } catch (error) {
    console.error("Failed to load Healthcare Insights:", error);
    insightsGrid.innerHTML = "";
    insightsError.hidden = false;
  }
}

loadHealthcareInsights();

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

function showFieldError(fieldName, message) {
  const errorEl = contactForm.querySelector('[data-for="' + fieldName + '"]');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldErrors() {
  contactForm.querySelectorAll(".form-error").forEach(function (el) {
    el.textContent = "";
  });
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearFieldErrors();

  const nameValue = document.getElementById("name").value.trim();
  const emailValue = document.getElementById("email").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let formIsValid = true;

  if (nameValue.length < 2) {
    showFieldError("name", "Please enter your full name.");
    formIsValid = false;
  }

  if (!emailPattern.test(emailValue)) {
    showFieldError("email", "Please enter a valid email address.");
    formIsValid = false;
  }

  if (!formIsValid) return;

  formSuccess.hidden = false;
  contactForm.reset();

  setTimeout(function () {
    formSuccess.hidden = true;
  }, 5000);
});


const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = "0 4px 20px var(--shadow-color)";
  } else {
    navbar.style.boxShadow = "none";
  }
});
