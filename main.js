
// /* =========================
//    TERMINAL SYSTEM
// ========================= */

// const input = document.getElementById("terminalInput");
// const terminal = document.getElementById("terminal");

// /* ROUTES */
// const routes = {
//   help: null,
//   about: "pages/about/about.html",
//   resume: "resume.html",
//   games: "pages/games/games.html",
//   irl: "pages/irl/irl.html",
//   clear: null
// };

// const commandList = Object.keys(routes);

// /* =========================
//    COMMAND HISTORY
// ========================= */

// let history = [];
// let historyIndex = -1;

// /* =========================
//    SMOOTH TYPE ANIMATION
// ========================= */

// function typeLine(text, className = "line", callback = null) {
//   const line = document.createElement("div");
//   line.className = className;
//   terminal.insertBefore(line, input.parentElement);

//   let i = 0;
//   const speed = 15;

//   function type() {
//     if (i < text.length) {
//       line.textContent += text.charAt(i);
//       i++;
//       setTimeout(type, speed);
//     } else {
//       if (callback) callback();
//     }
//   }

//   type();
//   terminal.scrollTop = terminal.scrollHeight;
// }

// /* =========================
//    EXECUTE COMMAND
// ========================= */

// function runCommand(value) {
//   if (!value) return;

//   history.push(value);
//   historyIndex = history.length;

//   typeLine("$ " + value);

//   if (value === "clear") {
//     setTimeout(() => location.reload(), 300);
//     return;
//   }

//   if (value === "help") {
//     commandList.forEach(cmd => {
//       const cmdLine = document.createElement("div");
//       cmdLine.className = "line command";
//       cmdLine.textContent = cmd;
//       cmdLine.style.cursor = "pointer";

//       // AUTO-RUN WHEN CLICKED
//       cmdLine.addEventListener("click", () => {
//         runCommand(cmd);
//       });

//       terminal.insertBefore(cmdLine, input.parentElement);
//     });

//     terminal.scrollTop = terminal.scrollHeight;
//     return;
//   }

//   if (routes[value] && routes[value].endsWith(".html")) {
//     setTimeout(() => {
//       window.location.href = routes[value];
//     }, 300);
//     return;
//   }

//   typeLine("Command not found.");
// }

// /* =========================
//    KEYBOARD CONTROLS
// ========================= */

// input.addEventListener("keydown", function (e) {

//   // ENTER
//   if (e.key === "Enter") {
//     const value = input.value.trim().toLowerCase();
//     input.value = "";
//     runCommand(value);
//   }

//   // ARROW UP
//   if (e.key === "ArrowUp") {
//     if (historyIndex > 0) {
//       historyIndex--;
//       input.value = history[historyIndex];
//     }
//     e.preventDefault();
//   }

//   // ARROW DOWN
//   if (e.key === "ArrowDown") {
//     if (historyIndex < history.length - 1) {
//       historyIndex++;
//       input.value = history[historyIndex];
//     } else {
//       historyIndex = history.length;
//       input.value = "";
//     }
//     e.preventDefault();
//   }

//   // TAB AUTOCOMPLETE
//   if (e.key === "Tab") {
//     e.preventDefault();

//     const current = input.value.toLowerCase();
//     const match = commandList.find(cmd => cmd.startsWith(current));

//     if (match) {
//       input.value = match;
//     }
//   }
// });

/* =============================
   MATRIX RAIN BACKGROUND
============================= */

const matrixCanvas = document.getElementById("particles");
const mCtx = matrixCanvas.getContext("2d");

function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
}
resizeMatrix();
window.addEventListener("resize", resizeMatrix);

const letters = "01";
const fontSize = 14;
const columns = () => matrixCanvas.width / fontSize;
let drops = [];

function initMatrix() {
  drops = [];
  for (let i = 0; i < columns(); i++) {
    drops[i] = 1;
  }
}
initMatrix();

function drawMatrix() {
  mCtx.fillStyle = "rgba(0,0,0,0.05)";
  mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  mCtx.fillStyle = "#00ff88";
  mCtx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975)
      drops[i] = 0;

    drops[i]++;
  }
}

setInterval(drawMatrix, 33);

/* =============================
   TERMINAL SYSTEM
============================= */

const input = document.getElementById("terminalInput");
const terminal = document.getElementById("terminal");

const output = terminal;

let history = [];
let historyIndex = -1;

/* =============================
   VIRTUAL FILE SYSTEM
============================= */

let fs = {
  "/": ["home", "games", "about.txt"],
  "/home": ["user.txt"],
  "/games": ["snake", "guess"]
};

let currentPath = "/";

/* =============================
   BOOT SEQUENCE
============================= */

const bootLines = [
  "DrakeOS v3.0 booting...",
  "Loading kernel modules...",
  "Mounting virtual filesystem...",
  "Starting services...",
  "System ready."
];

let bootDelay = 0;
bootLines.forEach(line => {
  setTimeout(() => {
    const div = document.createElement("div");
    div.className = "line";
    div.textContent = line;
    terminal.insertBefore(div, input.parentElement);
  }, bootDelay);
  bootDelay += 600;
});

/* =============================
   SOUND EFFECT
============================= */

const beep = new Audio("https://www.soundjay.com/buttons/sounds/button-09.mp3");

/* =============================
   COMMAND EXECUTION
============================= */

function print(text) {
  const div = document.createElement("div");
  div.className = "line";
  div.textContent = text;
  terminal.insertBefore(div, input.parentElement);
  terminal.scrollTop = terminal.scrollHeight;
}

function runCommand(cmd) {
  if (!cmd) return;

  history.push(cmd);
  historyIndex = history.length;

  print("$ " + cmd);

  const parts = cmd.split(" ");
  const base = parts[0];

  if (base === "clear") {
    location.reload();
    return;
  }

  if (base === "help") {
    print("Commands:");
    print("ls | cd | pwd | clear | snake | guess");
    return;
  }

  if (base === "pwd") {
    print(currentPath);
    return;
  }

  if (base === "ls") {
    print((fs[currentPath] || []).join("  "));
    return;
  }

  if (base === "cd") {
    const target = parts[1];
    if (!target) return;

    if (target === "..") {
      currentPath = "/";
    } else if (fs[currentPath + target]) {
      currentPath = currentPath + target;
    }
    return;
  }

  /* =============================
     BUILT-IN GAMES
  ============================= */

  if (base === "guess") {
    const number = Math.floor(Math.random() * 10) + 1;
    const guess = prompt("Guess a number (1-10):");
    if (parseInt(guess) === number) {
      print("Correct!");
    } else {
      print("Wrong! It was " + number);
    }
    return;
  }

  if (base === "snake") {
    print("Snake game loading...");
    print("Game placeholder (expandable).");
    return;
  }

  print("Command not found.");
}

/* =============================
   AUTOCOMPLETE DROPDOWN
============================= */

const suggestionBox = document.createElement("div");
suggestionBox.style.position = "absolute";
suggestionBox.style.background = "#111";
suggestionBox.style.border = "1px solid #00ff88";
suggestionBox.style.display = "none";
suggestionBox.style.zIndex = "999";
document.body.appendChild(suggestionBox);

const commands = ["help","clear","ls","cd","pwd","snake","guess"];

input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  suggestionBox.innerHTML = "";

  if (!value) {
    suggestionBox.style.display = "none";
    return;
  }

  const matches = commands.filter(c => c.startsWith(value));

  if (matches.length === 0) {
    suggestionBox.style.display = "none";
    return;
  }

  matches.forEach(match => {
    const div = document.createElement("div");
    div.textContent = match;
    div.style.padding = "5px";
    div.style.cursor = "pointer";

    div.onclick = () => {
      runCommand(match); // AUTO RUN
      input.value = "";
      suggestionBox.style.display = "none";
      input.focus();
    };

    suggestionBox.appendChild(div);
  });

  const rect = input.getBoundingClientRect();
  suggestionBox.style.left = rect.left + "px";
  suggestionBox.style.top = rect.bottom + "px";
  suggestionBox.style.display = "block";
});

/* =============================
   KEY CONTROLS
============================= */

input.addEventListener("keydown", e => {

  if (e.key === "Enter") {
    beep.currentTime = 0;
    beep.play();
    runCommand(input.value.trim());
    input.value = "";
    suggestionBox.style.display = "none";
  }

  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
  }

  if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      input.value = "";
    }
  }

  if (e.key === "Tab") {
    e.preventDefault();
    const match = commands.find(c => c.startsWith(input.value));
    if (match) input.value = match;
  }
});