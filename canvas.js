//setting
const H = 12;
const W = 12;
const L = 40;
const T = 6;

//canvas
canvas.height = H * L;
canvas.width = W * L;
const ctx = canvas.getContext("2d");
ctx.lineWidth = T;

function drawPasage(x, y, nx, ny) {
  if (!shouldDraw) return;
  drawCell(x, y, x == tx && y == ty ? "red" : "transparent");
  drawCell(nx, ny, "lime");
}
function drawCell(x, y, color) {
  ctx.clearRect(y * L, x * L, L, L);
  fillRect(x, y, color)
  ctx.strokeRect(y * L, x * L, L, L);
}

function draw() {
  ctx.clearRect(0, 0, L * W, L * H);
  for (let x = 0; x < H; ++x) for (let y = 0; y < W; ++y) {
    if (rock[x][y]) fillRect(x, y, "black")
    else if (x == cx && y == cy) fillRect(x, y, "lime");
    else if (x == tx && y == ty) fillRect(x, y, "red")
    ctx.strokeRect(y * L, x * L, L, L);
  }
}

function fillRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(y * L, x * L, L, L);
}