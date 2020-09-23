const CELL_S = 10;
const CANVAS_S = 50;
const INTERVAL = 100;
const COLOR = {
  canvas: '#f1d1b5',
  cell: '#305f72',
};

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let tickInterval;
let level = [];
let cellsToBeAlive = [];

c.canvas.width = CELL_S * CANVAS_S;
c.canvas.height = CELL_S * CANVAS_S;
canvas.style.backgroundColor = COLOR.canvas;

function getCursorPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  selectCellByCoordinates(Math.floor(x/CELL_S), Math.floor(y/CELL_S));
}

function generateLevelData() {
  for (let i = 0; i < CANVAS_S; i++) {
    level.push(new Array(CANVAS_S));
    for (let j = 0; j < CANVAS_S; j++) {
      level[i][j] = {
        x: j,
        y: i,
        alive: false,
      };
    }
  }
}

function selectCellByCoordinates(x, y) {
  level[y][x].alive = !level[y][x].alive;
  renderCell(x, y);
}

function renderCell(x, y) {
  c.fillStyle = COLOR.cell;
  level[y][x].alive
    ? c.fillRect(x * CELL_S, y * CELL_S, CELL_S, CELL_S)
    : c.clearRect(x * CELL_S, y * CELL_S, CELL_S, CELL_S);
}

function restart() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = undefined;
  }
  clearCanvas();
  level = [];
  generateLevelData();
}

function clearCanvas() {
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
}

function start() {
  tickInterval = setInterval(tick, INTERVAL);
}
function pause() {
  if (tickInterval) {
    clearInterval(tickInterval);  
  }
}

function tick() {
  level.forEach((row, y) => {
    row.forEach((cell, x) => {
      scanNeighbors(x, y);
    });
  });
  purgeCells();
}

function scanNeighbors(x, y) {
  let totalNeighbors = 0;
  /*
  [x][ ][ ]
  [ ][ ][ ]
  [ ][ ][ ]
   */
  if (x > 0 && y > 0 && level[y - 1][x - 1].alive) {
    totalNeighbors++;
  }
  /*
  [ ][x][ ]
  [ ][ ][ ]
  [ ][ ][ ]
   */
  if (y > 0 && level[y - 1][x].alive) {
    totalNeighbors++;
  }
  /*
  [ ][ ][x]
  [ ][ ][ ]
  [ ][ ][ ]
   */
  if (x < CANVAS_S - 1 && y > 0 && level[y - 1][x + 1].alive) {
    totalNeighbors++;
  }
  /*
  [ ][ ][ ]
  [ ][ ][x]
  [ ][ ][ ]
   */
  if (x < CANVAS_S - 1 && level[y][x + 1].alive) {
    totalNeighbors++;
  }
  /*
  [ ][ ][ ]
  [ ][ ][ ]
  [ ][ ][x]
   */
  if (x < CANVAS_S - 1 && y < CANVAS_S - 1 && level[y + 1][x + 1].alive) {
    totalNeighbors++;
  }
  /*
  [ ][ ][ ]
  [ ][ ][ ]
  [ ][x][ ]
   */
  if (y < CANVAS_S - 1 && level[y + 1][x].alive) {
    totalNeighbors++;
  }
  /*
  [ ][ ][ ]
  [ ][ ][ ]
  [x][ ][ ]
   */
  if (x > 0 && y < CANVAS_S - 1 && level[y + 1][x - 1].alive) {
    totalNeighbors++;
  }
  /*
  [ ][ ][ ]
  [x][ ][ ]
  [ ][ ][ ]
   */
  if (x > 0 && level[y][x - 1].alive) {
    totalNeighbors++;
  }

  // Any dead cell with three live neighbours becomes a live cell.
  // Any live cell with two or three live neighbours survives.
  if ((totalNeighbors === 3 && !level[y][x].alive)
    || (totalNeighbors >= 2 && totalNeighbors <= 3 && level[y][x].alive)) {
    cellsToBeAlive.push({x, y});
  }
}

function purgeCells() {
  level.forEach((row, y) => {
    row.forEach((cell, x) => {
      level[y][x].alive = false;
    });
  });
  cellsToBeAlive.forEach(({x, y}) => {
    level[y][x].alive = true;
  });
  level.forEach((row, y) => {
    row.forEach((cell, x) => {
      renderCell(x, y);
    });
  });

  cellsToBeAlive = [];
}

generateLevelData();

canvas.onmousedown = getCursorPosition;
