let board = Array(9).fill(null);
let currentPlayer = 'X';
let isGameActive = true;
let againstComputer = false;

const statusDisplay = document.getElementById('status');
const cells = Array.from(document.getElementsByClassName('cell'));
const newGameButton = document.getElementById('newGame');
const twoPlayerButton = document.getElementById('twoPlayer');
const onePlayerButton = document.getElementById('onePlayer');


const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];


function updateStatus(message) {
  statusDisplay.innerText = message;
}


function handleCellClick(event) {
  const index = event.target.getAttribute('data-index');
  
  if (board[index] || !isGameActive) return;

  board[index] = currentPlayer;
  event.target.innerText = currentPlayer;

  if (checkWin()) {
    updateStatus(`${currentPlayer} játékos nyert!`);
    isGameActive = false;
  } else if (board.every(cell => cell)) {
    updateStatus("A játék döntetlen.");
    isGameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (againstComputer && currentPlayer === 'O' && isGameActive) {
      computerMove();
    }
  }
}


function checkWin() {
  return winningConditions.some(combination =>
    combination.every(index => board[index] === currentPlayer)
  );
}


function computerMove() {
  let emptyCells = board.map((value, index) => value === null ? index : null).filter(v => v !== null);
  

  let move = findBestMove('O') || findBestMove('X') || emptyCells[Math.floor(Math.random() * emptyCells.length)];
  
  board[move] = 'O';
  cells[move].innerText = 'O';

  if (checkWin()) {
    updateStatus("O (Számítógép) nyert!");
    isGameActive = false;
  } else if (board.every(cell => cell)) {
    updateStatus("A játék döntetlen.");
    isGameActive = false;
  } else {
    currentPlayer = 'X';
  }
}


function findBestMove(player) {
  for (let [a, b, c] of winningConditions) {
    if (board[a] === player && board[b] === player && board[c] === null) return c;
    if (board[a] === player && board[c] === player && board[b] === null) return b;
    if (board[b] === player && board[c] === player && board[a] === null) return a;
  }
  return null;
}


function startNewGame() {
  board.fill(null);
  cells.forEach(cell => (cell.innerText = ''));
  currentPlayer = 'X';
  isGameActive = true;
  updateStatus('');
}


twoPlayerButton.addEventListener('click', () => {
  againstComputer = false;
  startNewGame();
});

onePlayerButton.addEventListener('click', () => {
  againstComputer = true;
  startNewGame();
});

newGameButton.addEventListener('click', startNewGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
