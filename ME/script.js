// Loader
window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
});

// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
});

// Mobile Menu
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Money Counter Animation
let money = 0;
const moneyDisplay = document.getElementById("moneyCounter");

setInterval(() => {
    money += Math.floor(Math.random() * 200);
    moneyDisplay.textContent = "$" + money.toLocaleString();
}, 150);

// Scroll Reveal
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);

// Mouse Gradient Follow
document.addEventListener("mousemove", (e) => {
    const bg = document.querySelector(".gradient-bg");
    bg.style.background =
        `radial-gradient(circle at ${e.clientX}px ${e.clientY}px,
        rgba(37,99,235,0.15), transparent 40%)`;
});

// Collapsible Cards
document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest(".guide-card").classList.toggle("active");
    });
});

// Animated Counters
const counters = document.querySelectorAll(".counter");

const animateCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const increment = target / 100;

    const update = () => {
        count += increment;
        if (count < target) {
            counter.innerText = Math.floor(count).toLocaleString();
            requestAnimationFrame(update);
        } else {
            counter.innerText = target.toLocaleString();
        }
    };

    update();
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.7 });

counters.forEach(counter => observer.observe(counter));

// Mini Demo Logic
let stockValue = 0;
document.getElementById("stockDemoBtn").onclick = () => {
    stockValue += Math.floor(Math.random() * 5000);
    document.getElementById("stockDemoValue").innerText =
        "$" + stockValue.toLocaleString();
};

let businessValue = 0;
document.getElementById("businessDemoBtn").onclick = () => {
    businessValue += 25000;
    document.getElementById("businessDemoValue").innerText =
        "$" + businessValue.toLocaleString();
};

let clickBalance = 0;
document.getElementById("clickDemoBtn").onclick = () => {
    clickBalance += 100;
    document.getElementById("clickDemoValue").innerText =
        "$" + clickBalance.toLocaleString();
};