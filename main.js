/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    d: Math.random() * 1
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff88";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.y += p.d;
    if (p.y > canvas.height) p.y = 0;
  });
  requestAnimationFrame(animate);
}
animate();

/* TERMINAL ROUTING */
const input = document.getElementById("terminalInput");
const terminal = document.getElementById("terminal");

const routes = {
  help: "Commands: about, resume, games, irl, clear",
  about: "pages/about/about.html",
  resume: "resume.html",
  games: "pages/games/games.html",
  irl: "pages/irl/irl.html"
};

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const value = input.value.trim().toLowerCase();

    const line = document.createElement("div");
    line.className = "line";
    line.textContent = "$ " + value;
    terminal.insertBefore(line, input.parentElement);

    if (value === "clear") {
      location.reload();
      return;
    }

    if (routes[value] && routes[value].endsWith(".html")) {
      window.location.href = routes[value];
      return;
    }

    const response = document.createElement("div");
    response.className = "line";
    response.textContent = routes[value] || "Command not found.";
    terminal.insertBefore(response, input.parentElement);

    input.value = "";
    terminal.scrollTop = terminal.scrollHeight;
  }
});