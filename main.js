console.log("ver 0.2");

//setting
const H = 12;
const W = 12;
const L = 40;
const T = 6;

//grid
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
function inner(x, y) {
  return 0 <= x && x < H && 0 <= y && y < W;
}

//state
//question
let sx, sy, tx, ty, n;
let rock = [];
for (let i = 0; i < H; ++i) rock[i] = [];
//current
let cx, cy, r;

//canvas
canvas.height = H * L;
canvas.width = W * L;
const ctx = canvas.getContext("2d");
ctx.lineWidth = T;
ctx.strokeStyle = "black";

//event
window.onload = set;
display.onclick = set;
resetButton.onclick = reset;
down.onclick = function () {
  move(0);
};
right.onclick = function () {
  move(1);
};
up.onclick = function () {
  move(2);
};
left.onclick = function () {
  move(3);
};
//question
function set() {
  for (let i = 0; i < H; ++i) rock[i].fill(false);

  //岩の配置を作成
  putRocks();

  //直径の算出
  sx = 0;
  sy = 0;
  tx = 11;
  ty = 11;
  n = 12;
  //直径経路のうち一つを算出
  //ダミー岩の配置
  //  ※盤面が難しくなることを期待しているため、簡単になるようなら廃止
  //  ※選択肢の複雑性を計算できるのがベスト
  //描画
  reset();
}

const N = 12;
function putRocks() {
  if (true) {
    //案1 : ランダム配置
    for (let _ = 0; _ < N; ++_) {
      const id = Math.floor(Math.random() * H * W);
      const x = (id - (id % W)) / W;
      const y = id % W;
      rock[x][y] = true;
    }
  } else {
    //案2 : 想定パスを作成し、岩を配置
    genPath();
  }
}

function calcDiameter() {
  //Dijkstra
  //  ※重かったらdouble sweepによる近似に切り替える
  let d = new Array(H);
  for (let x = 0; x < H; ++x)
    for (let y = 0; y < W; ++y) for (let nx = 0; nx < H; ++nx);
}

//generate path
let x_min;
let y_min;
let x_max;
let y_max;
let visited;
let passed;
let p = [];
function add() {
  return false;
  const x = p[p.length - 1][0];
  const y = p[p.length - 1][1];
  let legal = [];
  for (let k = 0; k < 4; ++k) {
    const nx = x + dx[k];
    const ny = y + dy[k];

    if (
      nx - x_min >= H ||
      ny - y_min >= W ||
      x_max - nx >= H ||
      y_max - ny >= W
    )
      continue;
    if (visited[[nx, ny]]) continue;

    legal.push(k);
  }

  if (legal.length == 0) return false;

  const k = legal[Math.floor(Math.random() * legal.length)];
  const nx = x + dx[k];
  const ny = y + dy[k];

  visited[[nx, ny]] = true;
  p.push([nx, ny]);
  x_min = Math.min(x_min, x);
  y_min = Math.min(y_min, y);
  x_max = Math.max(x_max, x);
  y_max = Math.max(y_max, y);

  return true;
}
function genPath() {
  p.splice(0);
  p.push([0, 0]);
  x_min = 0;
  y_min = 0;
  x_max = 0;
  y_max = 0;
  visited = {};
  visited[[0, 0]] = true;

  while (add(p)) {}
  p = [...p].reverse();
  while (add(p)) {}

  p.forEach((e) => {
    e[0] -= x_min;
    e[1] -= y_min;
  });
}

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function move(k) {
  if (r <= 0) return;
  const px = cx;
  const py = cy;
  while (true) {
    const nx = cx + dx[k];
    const ny = cy + dy[k];
    if (inner(nx, ny) && !rock[nx][ny]) {
      cx = nx;
      cy = ny;
      await sleep(10);
      draw();
    } else break;
  }
  if (cx == px && cy == py) return;
  --r;
  display.innerHTML = r;
  judge();
}

function judge() {
  if (isCorrect()) {
    canvas.classList.remove("correct");
    canvas.offsetWidth;
    canvas.classList.add("correct");
    set();
  }
}
function isCorrect() {
  return cx == tx && cy == ty;
}

//draw
function reset() {
  cx = sx;
  cy = sy;
  r = n;
  display.innerHTML = r;
  draw();
}
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
function drawPath() {
  let N = p.length;
  for (let i = 0; i < N - 1; ++i) {
    ctx.strokeStyle = color(i / (N - 2));
    ctx.beginPath();
    ctx.moveTo(p[i][1] * L + L / 2, p[i][0] * L + L / 2);
    ctx.lineTo(p[i + 1][1] * L + L / 2, p[i + 1][0] * L + L / 2);
    ctx.stroke();
  }
}
