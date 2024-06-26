const board = document.querySelector('#board');
const cells = document.querySelectorAll('.cell');
const message = document.querySelector('#message');
const restartButton = document.querySelector('#restart');
const newGameButton=document.querySelector('#newgame');
const scoreXElement = document.querySelector('#scoreX');
const scoreOElement = document.querySelector('#scoreO');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (gameBoard[index] !== '' || !gameActive) {
        return;
    }

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        updateScore(currentPlayer);
        gameActive = false;
    } else if (gameBoard.every(cell => cell !== '')) {
        message.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWinner() {
    return winningConditions.some(condition => {
        return condition.every(index => gameBoard[index] === currentPlayer);
    });
}

function updateScore(player) {
    if (player === 'X') {
        scoreX++;
        scoreXElement.textContent = scoreX;
    } else {
        scoreO++;
        scoreOElement.textContent = scoreO;
    }
}

function restartGame() {
    gameBoard.fill('');
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
    });
    message.textContent = '';
}
function newGame() {
   restartGame();
   scoreX = 0;
   scoreO = 0;
   scoreXElement.textContent = scoreX;
   scoreOElement.textContent = scoreO;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
newGameButton.addEventListener('click', newGame);

