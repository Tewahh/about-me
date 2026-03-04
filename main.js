/* =====================================================
   DRakeOS ULTIMATE (Merged System)
===================================================== */

/* ================= MATRIX BACKGROUND ================= */

const matrix = document.getElementById("particles");
const mctx = matrix.getContext("2d");

function resize() {
  matrix.width = window.innerWidth;
  matrix.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const chars = "01";
const fontSize = 14;
let drops = [];

function initMatrix() {
  drops = Array(Math.floor(matrix.width / fontSize)).fill(1);
}
initMatrix();

setInterval(() => {
  mctx.fillStyle = "rgba(0,0,0,0.05)";
  mctx.fillRect(0,0,matrix.width,matrix.height);

  mctx.fillStyle = "#00ff88";
  mctx.font = fontSize + "px monospace";

  for (let i=0;i<drops.length;i++){
    const text = chars[Math.floor(Math.random()*chars.length)];
    mctx.fillText(text,i*fontSize,drops[i]*fontSize);

    if(drops[i]*fontSize>matrix.height && Math.random()>0.975)
      drops[i]=0;

    drops[i]++;
  }
},33);

/* ================= TERMINAL CORE ================= */

const input = document.getElementById("terminalInput");
const terminal = document.getElementById("terminal");

let history = [];
let historyIndex = -1;

/* ================= PERSISTENT FILE SYSTEM ================= */

let fs = JSON.parse(localStorage.getItem("drakeFS")) || {
  "/": ["pages/about/about.html","pages/irl/irl.html","pages/games/games.html"],
  "/games": ["snake"]
};

function saveFS(){
  localStorage.setItem("drakeFS", JSON.stringify(fs));
}

/* ================= BOOT SEQUENCE ================= */

const bootMessages = [
  "Booting DrakeOS...",
  "Loading modules...",
  "Mounting filesystem...",
  "Starting services...",
  "System Ready."
];

bootMessages.forEach((msg,i)=>{
  setTimeout(()=>{
    const div=document.createElement("div");
    div.textContent=msg;
    terminal.insertBefore(div,input.parentElement);
  },i*600);
});

/* ================= SOUND ================= */

const beep = new Audio("https://www.soundjay.com/buttons/sounds/button-09.mp3");

/* ================= UTIL ================= */

function print(text){
  const div=document.createElement("div");
  div.textContent=text;
  terminal.insertBefore(div,input.parentElement);
  terminal.scrollTop=terminal.scrollHeight;
}

/* ================= SNAKE GAME ================= */

function startSnake(){
  const canvas=document.createElement("canvas");
  canvas.width=400;
  canvas.height=400;
  terminal.appendChild(canvas);

  const ctx=canvas.getContext("2d");

  let snake=[{x:200,y:200}];
  let dx=20, dy=0;
  let food={x:100,y:100};

  document.onkeydown=(e)=>{
    if(e.key==="ArrowUp"){dx=0;dy=-20;}
    if(e.key==="ArrowDown"){dx=0;dy=20;}
    if(e.key==="ArrowLeft"){dx=-20;dy=0;}
    if(e.key==="ArrowRight"){dx=20;dy=0;}
  };

  function loop(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,400,400);

    snake.unshift({x:snake[0].x+dx,y:snake[0].y+dy});

    if(snake[0].x===food.x && snake[0].y===food.y){
      food.x=Math.floor(Math.random()*20)*20;
      food.y=Math.floor(Math.random()*20)*20;
    } else {
      snake.pop();
    }

    ctx.fillStyle="lime";
    snake.forEach(p=>ctx.fillRect(p.x,p.y,20,20));

    ctx.fillStyle="red";
    ctx.fillRect(food.x,food.y,20,20);

    requestAnimationFrame(loop);
  }
  loop();
}

/* ================= COMMAND EXECUTOR ================= */

let currentPath="/";

const baseCommands = [
  "help","clear","ls","cd","pwd",
  "snake","ask","install"
];

function runCommand(cmd){

  if(!cmd) return;

  history.push(cmd);
  historyIndex = history.length;

  print("$ "+cmd);

  const parts = cmd.split(" ");
  const base = parts[0];

  if(base==="clear"){
    location.reload();
    return;
  }

  if(base==="help"){
    print("Commands:");
    print(baseCommands.join(" | "));
    return;
  }

  if(base==="pwd"){
    print(currentPath);
    return;
  }

  if(base==="ls"){
    print((fs[currentPath]||[]).join("  "));
    return;
  }

  if(base==="cd"){
    const target=parts[1];
    if(target==="..") currentPath="/";
    else if(fs[currentPath+"/"+target])
      currentPath=currentPath+"/"+target;

    saveFS();
    return;
  }

  if(fs[currentPath]?.includes(cmd)){
    print("Opening "+cmd);
    window.open(cmd,"_blank");
    return;
  }

  if(base==="snake"){
    startSnake();
    return;
  }

  if(base==="ask"){
    print("AI: "+parts.slice(1).join(" "));
    return;
  }

  if(base==="install"){
    print("Installing...");
    setTimeout(()=>print("Installed."),1000);
    return;
  }

  print("Command not found.");
}

/* ================= INPUT CONTROLS ================= */

input.addEventListener("keydown", e=>{

  if(e.key==="Enter"){
    beep.currentTime=0;
    beep.play();
    runCommand(input.value.trim());
    input.value="";
  }

  if(e.key==="ArrowUp"){
    if(historyIndex>0){
      historyIndex--;
      input.value=history[historyIndex];
    }
  }

  if(e.key==="ArrowDown"){
    if(historyIndex<history.length-1){
      historyIndex++;
      input.value=history[historyIndex];
    } else input.value="";
  }

  if(e.key==="Tab"){
    e.preventDefault();
    const match=baseCommands.find(c=>c.startsWith(input.value));
    if(match) input.value=match;
  }

});