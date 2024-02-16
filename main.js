console.log("ver 0.12");
const tq = new TaskQueue(0, 20);

window.onload = set;

//button
resetButton.onclick = pushReset;
const key_dom = [down, right, up, left];
for (let k = 0; k < 4; ++k) key_dom[k].onclick = move.bind(0, k);

//keyboard
document.addEventListener("keydown", keydownEvent);
function keydownEvent(e) {
  if (!e.ctrlKey && keyBind[e.code]) keyBind[e.code]();
}
const keyBind = {
  KeyW: move.bind(0, 2),
  KeyA: move.bind(0, 3),
  KeyS: move.bind(0, 0),
  KeyD: move.bind(0, 1),
  ArrowUp: move.bind(0, 2),
  ArrowLeft: move.bind(0, 3),
  ArrowDown: move.bind(0, 0),
  ArrowRight: move.bind(0, 1),
  KeyR: pushReset,
};

function set() {
  // for (let i = 0; i < 10000; ++i)
  setQuestion();
  // console.log(list);
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
