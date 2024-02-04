console.log("ver 0.7");
const tq = new TaskQueue(0, 20);

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

  let k = -1;
  if (e.code.substring(0, 3) == "Key") k = KEY.indexOf(e.code);
  else if (e.code.substring(0, 5) == "Arrow") k = ARROW.indexOf(e.code);

  if (k == -1) return;
  move(k);
}

function set() {
  setQuestion();
  reset();
}
function reset() {
  cx = sx;
  cy = sy;
  r = n;

  draw();
  display.innerHTML = r;

  tq.melt();
}
function pushReset() {
  tq.freeze();
  tq.pushForced(reset);
}
function move(k) {
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
  AcAnimation();
  set();
}
