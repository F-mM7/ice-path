console.log("ver 0.5");
const delay = 20;
const tq = new TaskQueue(delay);
let shouldDraw;

window.onload = function () {
  set();
  reset();
};

//button
resetButton.onclick = pushReset;
let key_dom = [down, right, up, left];
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

function pushReset() {
  tq.before = 0;
  shouldDraw = false;
  tq.close(reset);
}
function move(k) {
  if (r < 1) return;
  if (!reachable(cx + dx[k], cy + dy[k])) return;
  --r;
  display.innerHTML = r;
  while (true) {
    const nx = cx + dx[k];
    const ny = cy + dy[k];
    if (!reachable(nx, ny)) break;
    tq.pushWithDelay(drawPasage.bind(0, cx, cy, nx, ny));
    cx = nx;
    cy = ny;
  }
  tq.push(judge.bind(0, cx, cy));
}
