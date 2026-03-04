// /* PARTICLES */
// const canvas = document.getElementById("particles");
// const ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let particles = [];
// for (let i = 0; i < 80; i++) {
//   particles.push({
//     x: Math.random() * canvas.width,
//     y: Math.random() * canvas.height,
//     r: Math.random() * 2,
//     d: Math.random() * 1
//   });
// }

// function animate() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "#00ff88";
//   particles.forEach(p => {
//     ctx.beginPath();
//     ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//     ctx.fill();
//     p.y += p.d;
//     if (p.y > canvas.height) p.y = 0;
//   });
//   requestAnimationFrame(animate);
// }
// animate();

// /* TERMINAL ROUTING */
// const input = document.getElementById("terminalInput");
// const terminal = document.getElementById("terminal");

// const routes = {
//   help: "Commands: about, resume, games, irl, clear",
//   about: "pages/about/about.html",
//   resume: "resume.html",
//   games: "pages/games/games.html",
//   irl: "pages/irl/irl.html"
// };

// input.addEventListener("keydown", function (e) {
//   if (e.key === "Enter") {
//     const value = input.value.trim().toLowerCase();

//     const line = document.createElement("div");
//     line.className = "line";
//     line.textContent = "$ " + value;
//     terminal.insertBefore(line, input.parentElement);

//     if (value === "clear") {
//       location.reload();
//       return;
//     }

//     if (routes[value] && routes[value].endsWith(".html")) {
//       window.location.href = routes[value];
//       return;
//     }

//     const response = document.createElement("div");
//     response.className = "line";
//     response.textContent = routes[value] || "Command not found.";
//     terminal.insertBefore(response, input.parentElement);

//     input.value = "";
//     terminal.scrollTop = terminal.scrollHeight;
//   }
// });

/* =========================
   TERMINAL SYSTEM
========================= */

const input = document.getElementById("terminalInput");
const terminal = document.getElementById("terminal");

/* ROUTES */
const routes = {
  help: null,
  about: "pages/about/about.html",
  resume: "resume.html",
  games: "pages/games/games.html",
  irl: "pages/irl/irl.html",
  clear: null
};

const commandList = Object.keys(routes);

/* =========================
   COMMAND HISTORY
========================= */

let history = [];
let historyIndex = -1;

/* =========================
   SMOOTH TYPE ANIMATION
========================= */

function typeLine(text, className = "line", callback = null) {
  const line = document.createElement("div");
  line.className = className;
  terminal.insertBefore(line, input.parentElement);

  let i = 0;
  const speed = 15;

  function type() {
    if (i < text.length) {
      line.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      if (callback) callback();
    }
  }

  type();
  terminal.scrollTop = terminal.scrollHeight;
}

/* =========================
   EXECUTE COMMAND
========================= */

function runCommand(value) {
  if (!value) return;

  history.push(value);
  historyIndex = history.length;

  typeLine("$ " + value);

  if (value === "clear") {
    setTimeout(() => location.reload(), 300);
    return;
  }

  if (value === "help") {
    commandList.forEach(cmd => {
      const cmdLine = document.createElement("div");
      cmdLine.className = "line command";
      cmdLine.textContent = cmd;
      cmdLine.style.cursor = "pointer";

      // AUTO-RUN WHEN CLICKED
      cmdLine.addEventListener("click", () => {
        runCommand(cmd);
      });

      terminal.insertBefore(cmdLine, input.parentElement);
    });

    terminal.scrollTop = terminal.scrollHeight;
    return;
  }

  if (routes[value] && routes[value].endsWith(".html")) {
    setTimeout(() => {
      window.location.href = routes[value];
    }, 300);
    return;
  }

  typeLine("Command not found.");
}

/* =========================
   KEYBOARD CONTROLS
========================= */

input.addEventListener("keydown", function (e) {

  // ENTER
  if (e.key === "Enter") {
    const value = input.value.trim().toLowerCase();
    input.value = "";
    runCommand(value);
  }

  // ARROW UP
  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
    e.preventDefault();
  }

  // ARROW DOWN
  if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      input.value = "";
    }
    e.preventDefault();
  }

  // TAB AUTOCOMPLETE
  if (e.key === "Tab") {
    e.preventDefault();

    const current = input.value.toLowerCase();
    const match = commandList.find(cmd => cmd.startsWith(current));

    if (match) {
      input.value = match;
    }
  }
});