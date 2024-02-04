console.log("ver 0.6");
const delay = 20;
const tq = new TaskQueue(delay);
let freeze;

window.onload = set;

//button
resetButton.onclick = pushReset;
const key_dom = [down, right, up, left];
for (let k = 0; k < 4; ++k) key_dom[k].onclick = move.bind(0, k);

//keyboard
document.addEventListener("keydown", keydownEvent);
const KEY = ["KeyS", "KeyD", "KeyW", "KeyA"];
const ARROW = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
function keydownEvent(e) {
  if (e.ctrlKey) return;
  if (e.code == "KeyR") pushReset();

  let k;
  if (e.code.substring(0, 3) == "Key") k = KEY.indexOf(e.code);
  else if (e.code.substring(0, 5) == "Arrow") k = ARROW.indexOf(e.code);

  if (k == -1) return;
  move(k);
}

function set() {
  for (let i = 0; i < H; ++i) rock[i].fill(false);
  putRocks();
  setStartGoal();
  reset();
}
function reset() {
  cx = sx;
  cy = sy;
  r = n;

  draw();
  display.innerHTML = r;

  freeze = false;
  tq.before = delay;
}
function pushReset() {
  freeze = true;
  tq.before = 0;
  tq.push(reset);
}
function move(k) {
  if (freeze) return;
  if (r < 1) return;
  if (!reachable(cx + dx[k], cy + dy[k])) return;
  --r;
  display.innerHTML = r;
  while (reachable(cx + dx[k], cy + dy[k])) {
    tq.pushWithDelay(drawPasage.bind(0, cx, cy, cx + dx[k], cy + dy[k]));
    cx += dx[k];
    cy += dy[k];
  }
  if (cx == tx && cy == ty) tq.push(AcHandling);
}
function AcHandling() {
  if (freeze) return;
  AcAnimation();
  set();
}

function AcAnimation() {
  canvas.classList.remove("correct");
  canvas.offsetWidth;
  canvas.classList.add("correct");
}
