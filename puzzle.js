//setting
const H = 12;
const W = 12;

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
for (let i = 0; i < H; ++i) rock[i] = new Array(W);
//  current
let cx, cy, r;

function setQuestion() {
  putRocks(8 + Math.random() * 8);
  setStartGoal();
}

function putRocks(N) {
  for (let i = 0; i < H; ++i) rock[i].fill(false);

  for (let _ = 0; _ < N; ++_) {
    const id = Math.floor(Math.random() * H * W);
    const x = (id - (id % W)) / W;
    const y = id % W;
    rock[x][y] = true;
  }
}

let d = [];
for (let x = 0; x < H; ++x) {
  d[x] = [];
  for (let y = 0; y < W; ++y) {
    d[x][y] = [];
    for (let nx = 0; nx < H; ++nx) d[x][y][nx] = new Array(W);
  }
}

function setStartGoal() {
  Dijkstra();

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
  n = m;

  console.log(d[sx][sy]);
}
function Dijkstra() {
  //initialize
  for (let x = 0; x < H; ++x)
    for (let y = 0; y < W; ++y)
      for (let nx = 0; nx < H; ++nx) d[x][y][nx].fill(Infinity);

  //edge
  for (let x = 0; x < H; ++x)
    for (let y = 0; y < W; ++y) {
      if (!reachable(x, y)) continue;
      d[x][y][x][y] = 0;
      for (let k = 0; k < 4; ++k) {
        if (!reachable(x + dx[k], y + dy[k])) continue;
        let nx = x + dx[k];
        let ny = y + dy[k];
        while (reachable(nx + dx[k], ny + dy[k])) {
          nx += dx[k];
          ny += dy[k];
        }
        d[x][y][nx][ny] = 1;
      }
    }

  //main
  for (let mx = 0; mx < H; ++mx)
    for (let my = 0; my < W; ++my)
      for (let x = 0; x < H; ++x)
        for (let y = 0; y < W; ++y)
          for (let nx = 0; nx < H; ++nx)
            for (let ny = 0; ny < W; ++ny)
              if (d[x][y][mx][my] + d[mx][my][nx][ny] < d[x][y][nx][ny])
                d[x][y][nx][ny] = d[x][y][mx][my] + d[mx][my][nx][ny];
}
