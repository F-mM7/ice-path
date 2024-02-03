//setting
//  size
const H = 12;
const W = 12;
const L = 40;
const T = 6;
//  color
const piece_color = "lime";
const goal_color = "red";
const rock_color = "black";

//canvas
canvas.height = H * L;
canvas.width = W * L;
const ctx = canvas.getContext("2d");
ctx.lineWidth = T;

function draw() {
  clear(0, 0, H, W);
  for (let x = 0; x < H; ++x)
    for (let y = 0; y < W; ++y) {
      if (rock[x][y]) fill(x, y, rock_color);
      else if (x == cx && y == cy) fill(x, y, piece_color);
      else if (x == tx && y == ty) fill(x, y, goal_color);
      drawFrame(x, y);
    }
}
function drawPasage(x, y, nx, ny) {
  if (!shouldDraw) return;
  drawCell(x, y, x == tx && y == ty ? goal_color : "transparent");
  drawCell(nx, ny, piece_color);
}
function drawCell(x, y, color) {
  clear(x, y);
  fill(x, y, color);
  drawFrame(x, y);
}

function clear(x, y, h = 1, w = 1) {
  ctx.clearRect(y * L, x * L, L * w, L * h);
}
function fill(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(y * L, x * L, L, L);
}
function drawFrame(x, y) {
  ctx.strokeRect(y * L, x * L, L, L);
}
