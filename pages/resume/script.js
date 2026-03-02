document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('#navbar a');
    const sections = document.querySelectorAll('.section');

    function animateCards(section) {
        const cards = section.querySelectorAll('.project-card, .resume-card');

        cards.forEach((card, index) => {
            card.classList.remove('card-animate');

            // force reflow
            void card.offsetWidth;

            setTimeout(() => {
                card.classList.add('card-animate');
            }, index * 120);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {

            e.preventDefault();
            const target = link.getAttribute('data-section');

            sections.forEach(section => {
                section.classList.remove('active');
            });

            const activeSection = document.getElementById(target + '-section');
            if (!activeSection) return;

            activeSection.classList.add('active');

            // replay section animation
            activeSection.style.animation = "none";
            void activeSection.offsetWidth;
            activeSection.style.animation = null;

            animateCards(activeSection);
        });
    });

});
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey && e.key == "s") {
        e.preventDefault();
    }
});

// ================= Toggle Motions =================

const toggle = document.getElementById("disable-animations");

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        document.body.classList.add("reduce-motion");
    } else {
        document.body.classList.remove("reduce-motion");
    }
});

// ================= TYPING EFFECT =================

const roles = [
    "Web Developer",
    "Java Learner",
    "Future Software Engineer",
    "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector(".typing");

let typingTimeout; // keep track of scheduled timeout

function typeEffect() {
    // Clear any previously scheduled timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    if (toggle.checked) {
        // Reduce motion: show all roles immediately
        typingElement.textContent = roles.join(" | ");
        return; // stop animation
    }

    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        // Typing forward
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            typingTimeout = setTimeout(() => isDeleting = true, 1200);
        }

    } else {
        // Deleting backward
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    // Continue typing
    const speed = isDeleting ? 40 : 80 + Math.random() * 40;
    typingTimeout = setTimeout(typeEffect, speed);
}

// Start typing
typeEffect();

// Watch toggle changes to resume typing
toggle.addEventListener("change", () => {
    if (!toggle.checked) {
        // Resume typing effect
        typeEffect();
    }
});

// ================= SCROLL REVEAL =================

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll(".resume-block").forEach(block => {
    observer.observe(block);
});

// ================= PARALLAX EFFECT =================

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const resumeHeader = document.querySelector(".resume-header");

    if (resumeHeader) {
        resumeHeader.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
});

