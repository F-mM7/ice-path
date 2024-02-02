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
  drawCellWithConfig(x, y, x == tx && y == ty ? "red" : "transparent");
  drawCellWithConfig(nx, ny, shouldDraw ? "lime" : "transparent");
}
function drawCellWithConfig(x, y, color) {
  ctx.clearRect(y * L, x * L, L, L);
  ctx.fillStyle = color;
  ctx.fillRect(y * L, x * L, L, L);
  ctx.strokeRect(y * L, x * L, L, L);
}

//draw
function draw() {
  for (let i = 0; i < H; ++i) for (let j = 0; j < W; ++j) drawCell(i, j);
}
function drawCell(x, y) {
  ctx.clearRect(y * L, x * L, L, L);
  if (rock[x][y]) {
    ctx.fillStyle = "black";
    ctx.fillRect(y * L, x * L, L, L);
  }
  if (x == tx && y == ty) {
    ctx.fillStyle = "red";
    ctx.fillRect(y * L, x * L, L, L);
  }
  if (x == cx && y == cy) {
    ctx.fillStyle = "lime";
    ctx.fillRect(y * L, x * L, L, L);
  }
  ctx.strokeRect(y * L, x * L, L, L);
}
