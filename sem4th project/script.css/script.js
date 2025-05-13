let grid = [], start = [0, 0], end = [], numRows = 10, numCols = 10;

function generateMaze() {
  numRows = Math.min(50, parseInt(document.getElementById("rows").value));
  numCols = Math.min(50, parseInt(document.getElementById("cols").value));
  document.documentElement.style.setProperty('--rows', numRows);
  document.documentElement.style.setProperty('--cols', numCols);

  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = '';
  grid = [];

  for (let r = 0; r < numRows; r++) {
    const row = [];
    for (let c = 0; c < numCols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.onclick = () => toggleWall(r, c);
      gridContainer.appendChild(cell);
      row.push(cell);
    }
    grid.push(row);
  }

  start = [0, 0];
  end = [numRows - 1, numCols - 1];
  setPoint(start, "start", "🧍");
  setPoint(end, "end", "🚪");

  for (let r = 1; r < numRows; r++) {
    for (let c = 1; c < numCols; c++) {
      if (Math.random() < 0.3 && !(r === end[0] && c === end[1])) {
        grid[r][c].classList.add("wall");
      }
    }
  }

  document.getElementById("status").textContent = "";
}

function setPoint([r, c], className, emoji) {
  const cell = grid[r][c];
  cell.classList.add(className);
  cell.textContent = emoji;
}

function isStart(r, c) {
  return r === start[0] && c === start[1];
}

function isEnd(r, c) {
  return r === end[0] && c === end[1];
}

function toggleWall(r, c) {
  if (isStart(r, c) || isEnd(r, c)) return;
  const cell = grid[r][c];
  cell.classList.toggle("wall");
  cell.textContent = "";
}

function resetGrid() {
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      grid[r][c].className = "cell";
      grid[r][c].textContent = "";
    }
  }
  setPoint(start, "start", "🧍");
  setPoint(end, "end", "🚪");
  document.getElementById("status").textContent = "";
}

async function runDijkstra() {
  const visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
  const prev = Array.from({ length: numRows }, () => Array(numCols).fill(null));
  const queue = [start];
  const delay = 80;

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (isEnd(r, c)) break;

    const neighbors = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];

    for (let [nr, nc] of neighbors) {
      if (
        nr >= 0 && nr < numRows &&
        nc >= 0 && nc < numCols &&
        !visited[nr][nc] &&
        !grid[nr][nc].classList.contains("wall")
      ) {
        visited[nr][nc] = true;
        prev[nr][nc] = [r, c];
        queue.push([nr, nc]);
        if (!isEnd(nr, nc)) {
          grid[nr][nc].classList.add("visited");
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }
  }

  let curr = end;
  if (!prev[curr[0]][curr[1]]) {
    document.getElementById("status").textContent = "🚫 No path found!";
    return;
  }

  const beep = document.getElementById("beep");
  while (prev[curr[0]][curr[1]]) {
    curr = prev[curr[0]][curr[1]];
    if (isStart(curr[0], curr[1])) break;
    grid[curr[0]][curr[1]].classList.add("path");
    await new Promise(res => setTimeout(res, delay));
  }

  beep.play();
  document.getElementById("status").textContent = "✅ Escaped the Maze!";
}

generateMaze();
