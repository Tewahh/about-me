function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }) }
function openTerminal() { document.getElementById('terminalModal').style.display = 'flex' }

const term = document.getElementById('terminal');
const input = document.getElementById('input');

function print(t) { const d = document.createElement('div'); d.textContent = t; term.appendChild(d); term.scrollTop = term.scrollHeight }

const cmds = ['help', 'projects', 'services', 'pricing', 'contact', 'snake', 'exit'];

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    let cmd = input.value.trim();
    print('> ' + cmd);

    if (cmd === 'help') print(cmds.join(', '));

    else if (cmd === 'projects') { scrollToSection('projects'); closeTerm() }
    else if (cmd === 'services') { scrollToSection('services'); closeTerm() }
    else if (cmd === 'pricing') { scrollToSection('pricing'); closeTerm() }
    else if (cmd === 'contact') { scrollToSection('contact'); closeTerm() }

    else if (cmd === 'snake') { startSnake() }

    else if (cmd === 'exit') { closeTerm() }
    else print('Command not found');

    input.value = '';
  }
});

function closeTerm() { document.getElementById('terminalModal').style.display = 'none' }

/* SNAKE GAME */
function startSnake() {
  const c = document.createElement('canvas');
  c.width = 300; c.height = 300; term.appendChild(c);
  const ctx = c.getContext('2d');
  let s = [{ x: 150, y: 150 }], dx = 10, dy = 0, f = { x: 50, y: 50 };

  document.onkeydown = e => {
    if (e.key === 'ArrowUp') { dx = 0; dy = -10 }
    if (e.key === 'ArrowDown') { dx = 0; dy = 10 }
    if (e.key === 'ArrowLeft') { dx = -10; dy = 0 }
    if (e.key === 'ArrowRight') { dx = 10; dy = 0 }
  }

  function loop() {
    ctx.fillStyle = 'black'; ctx.fillRect(0, 0, 300, 300);
    s.unshift({ x: s[0].x + dx, y: s[0].y + dy });
    if (s[0].x === f.x && s[0].y === f.y) { f.x = Math.random() * 300; f.y = Math.random() * 300 } else s.pop();
    ctx.fillStyle = 'lime'; s.forEach(p => ctx.fillRect(p.x, p.y, 10, 10));
    ctx.fillStyle = 'red'; ctx.fillRect(f.x, f.y, 10, 10);
    requestAnimationFrame(loop);
  }
  loop();
}