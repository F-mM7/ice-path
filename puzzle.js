//grid
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
function reachable(x, y) {
  return 0 <= x && x < H && 0 <= y && y < W && !rock[x][y];
}

//state
//  q
let sx, sy, tx, ty, n;
let rock = [];
for (let i = 0; i < H; ++i) rock[i] = [];
//  current
let cx, cy, r;

//question
function set() {
  for (let i = 0; i < H; ++i) rock[i].fill(false);
  putRocks();
  setStartGoal();
}
function reset() {
  cx = sx;
  cy = sy;
  r = n;
  display.innerHTML = r;
  tq.before = delay;
  shouldDraw = true;
  draw();
}

function putRocks() {
  const N = 8 + Math.random() * 8;
  for (let _ = 0; _ < N; ++_) {
    const id = Math.floor(Math.random() * H * W);
    const x = (id - (id % W)) / W;
    const y = id % W;
    rock[x][y] = true;
  }
}

function setStartGoal() {
  //Dijkstra
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
  let m = 1;
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

  const k = Math.floor(Math.random() * v.length);
  sx = v[k][0];
  sy = v[k][1];
  tx = v[k][2];
  ty = v[k][3];
  console.log(d[sx][sy]);
  n = m;
}

function judge(x, y) {
  if (x == tx && y == ty) {
    shouldDraw = false;
    set();
    correctAnimation();
    reset();
  }
}
function correctAnimation() {
  canvas.classList.remove("correct");
  canvas.offsetWidth;
  canvas.classList.add("correct");
}
