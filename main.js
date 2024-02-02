console.log("ver 0.4.1");
var delay = 20;
var tq = new TaskQueue(delay);

var shouldDraw = true;

//grid
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
function inner(x, y) {
  return 0 <= x && x < H && 0 <= y && y < W;
}
function reachable(x, y) {
  return inner(x, y) && !rock[x][y];
}

//state
//q
let sx, sy, tx, ty, n;
let rock = [];
for (let i = 0; i < H; ++i) rock[i] = [];
//current
let cx, cy, r, cleared;

//event
window.onload = function () {
  set();
  reset();
};
// resetButton.onclick = function () {
//   promise = promise.then(resetNew, null);
// };
let key_dom = [down, right, up, left];
for (let k = 0; k < 4; ++k) key_dom[k].onclick = move.bind(0, k);

//key board
document.addEventListener("keydown", downKey);
const WASD = ["S", "D", "W", "A"];
const PAD = ["D", "R", "U", "L"];
function downKey(e) {
  if (e.ctrlKey) return;
  if (e.code == "KeyR") {
    tq.before = 0;
    shouldDraw = false;
    tq.close(reset);
  }
  let k;
  if (e.code.substring(0, 3) == "Key") k = WASD.indexOf(e.code[3]);
  else if (e.code.substring(0, 5) == "Arrow") k = PAD.indexOf(e.code[5]);

  if (k == -1) return;
  move(k);
}

//question
function set() {
  for (let i = 0; i < H; ++i) rock[i].fill(false);
  putRocks();
  setStartGoal();
  //ダミー岩の配置
  //  経路の計算
  //  ※盤面が難しくなることを期待しているため、簡単になるようなら廃止
  //  ※選択肢の複雑性を計算できるのがベスト
}

function putRocks() {
  if (true) {
    //ランダム配置
    const N = 8 + Math.random() * 8;
    for (let _ = 0; _ < N; ++_) {
      const id = Math.floor(Math.random() * H * W);
      const x = (id - (id % W)) / W;
      const y = id % W;
      rock[x][y] = true;
    }
  } else {
    //想定パスを作成し、岩を配置
    //※未実装
    genPath();
  }
}

function setStartGoal() {
  //Dijkstra
  //  ※代案 : double sweepによる近似アルゴリズム
  let d = [];
  for (let x = 0; x < H; ++x) {
    d[x] = [];
    for (let y = 0; y < W; ++y) {
      d[x][y] = [];
      for (let nx = 0; nx < H; ++nx) d[x][y][nx] = new Array(W).fill(Infinity);
      if (reachable(x, y)) d[x][y][x][y] = 0;
    }
  }
  for (let x = 0; x < H; ++x)
    for (let y = 0; y < W; ++y) {
      if (!reachable(x, y)) continue;
      for (let k = 0; k < 4; ++k) {
        let nx = x;
        let ny = y;
        while (reachable(nx + dx[k], ny + dy[k])) {
          nx += dx[k];
          ny += dy[k];
        }
        if (nx == x && ny == y) continue;
        d[x][y][nx][ny] = 1;
      }
    }

  for (let mx = 0; mx < H; ++mx)
    for (let my = 0; my < W; ++my)
      for (let x = 0; x < H; ++x)
        for (let y = 0; y < W; ++y)
          for (let nx = 0; nx < H; ++nx)
            for (let ny = 0; ny < W; ++ny)
              if (d[x][y][mx][my] + d[mx][my][nx][ny] < d[x][y][nx][ny])
                d[x][y][nx][ny] = d[x][y][mx][my] + d[mx][my][nx][ny];

  //最長経路
  let m = -1;
  let v = [];

  for (let x = 0; x < H; ++x)
    for (let y = 0; y < W; ++y)
      for (let nx = 0; nx < H; ++nx)
        for (let ny = 0; ny < W; ++ny) {
          if (d[x][y][nx][ny] == Infinity) continue;
          if (d[x][y][nx][ny] == m) v.push([x, y, nx, ny]);
          else if (d[x][y][nx][ny] > m) {
            m = d[x][y][nx][ny];
            v = [[x, y, nx, ny]];
          }
        }

  //random choice
  const k = Math.floor(Math.random() * v.length);
  sx = v[k][0];
  sy = v[k][1];
  tx = v[k][2];
  ty = v[k][3];
  n = m;
}

//generate path
//  *not in use
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

function judge(x, y) {
  if (cleared) return;
  if (x == tx && y == ty) {
    cleared = true;
    // tq.before = 0;
    set();
    // correctAnimation();
    shouldDraw = false;
    tq.close(function () {
      correctAnimation();
      reset();
    });
  }
}
function correctAnimation() {
  canvas.classList.remove("correct");
  canvas.offsetWidth;
  canvas.classList.add("correct");
}

function reset() {
  cx = sx;
  cy = sy;
  r = n;
  display.innerHTML = r;
  cleared = false;
  tq.before = delay;
  shouldDraw = true;
  draw();
}
