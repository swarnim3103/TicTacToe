document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const newGameButton=document.querySelector('#newgame');
    const scoreXElement = document.querySelector('#scoreX');
    const scoreOElement = document.querySelector('#scoreO');
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let currentPlayer = 'X';
    let gameOver = false;
    let scoreX = 0;
    let scoreO = 0;
    // Initialize the board
    function initializeBoard() {
        boardElement.innerHTML = '';
        for (let row = 0; row < 3; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < 3; col++) {
                const td = document.createElement('td');
                td.dataset.row = row;
                td.dataset.col = col;
                td.addEventListener('click', handleCellClick);
                tr.appendChild(td);
            }
            boardElement.appendChild(tr);
        }
    }

    // Handle cell click
    function handleCellClick(event) {
        if (gameOver) return;
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;

        if (board[row][col] === '') {
            board[row][col] = currentPlayer;
            event.target.textContent = currentPlayer;
            if (checkWin(currentPlayer)) {
                statusElement.textContent = `${currentPlayer} wins!`;
                updateScore(currentPlayer);
                gameOver = true;
            } else if (checkDraw()) {
                statusElement.textContent = `It's a draw!`;
                gameOver = true;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                if (currentPlayer === 'O') {
                    computerMove();
                }
            }
        }
    }

    // Check for a win
    function checkWin(player) {
        for (let row = 0; row < 3; row++) {
            if (board[row].every(cell => cell === player)) return true;
        }
        for (let col = 0; col < 3; col++) {
            if (board.every(row => row[col] === player)) return true;
        }
        if ([0, 1, 2].every(idx => board[idx][idx] === player)) return true;
        if ([0, 1, 2].every(idx => board[idx][2 - idx] === player)) return true;
        return false;
    }

    // Check for a draw
    function checkDraw() {
        return board.flat().every(cell => cell !== '');
    }

    // Computer move using Minimax
    function computerMove() {
        if (gameOver) return;
        const bestMove = findBestMove(board);
        if (bestMove.row !== -1 && bestMove.col !== -1) {
            board[bestMove.row][bestMove.col] = 'O';
            const cell = boardElement.querySelector(`td[data-row='${bestMove.row}'][data-col='${bestMove.col}']`);
            cell.textContent = 'O';
            if (checkWin('O')) {
                statusElement.textContent = 'O wins!';
                updateScore(currentPlayer);
                gameOver = true;
            } else if (checkDraw()) {
                statusElement.textContent = `It's a draw!`;
                gameOver = true;
            } else {
                currentPlayer = 'X';
            }
        }
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

    // Restart the game
    function restartGame() {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        currentPlayer = 'X';
        gameOver = false;
        statusElement.textContent = '';
        initializeBoard();
    }
    function newGame() {
        restartGame();
        scoreX = 0;
        scoreO = 0;
        scoreXElement.textContent = scoreX;
        scoreOElement.textContent = scoreO;
     }
     
    
     restartButton.addEventListener('click', restartGame);
     newGameButton.addEventListener('click', newGame);

    // Initialize the game
    initializeBoard();
});

// Evaluate board and return a score
function evaluateBoard(board) {
    for (let row = 0; row < 3; row++) {
        if (board[row].every(cell => cell === 'O')) return 10;
        if (board[row].every(cell => cell === 'X')) return -10;
    }
    for (let col = 0; col < 3; col++) {
        if (board.every(row => row[col] === 'O')) return 10;
        if (board.every(row => row[col] === 'X')) return -10;
    }
    if ([0, 1, 2].every(idx => board[idx][idx] === 'O')) return 10;
    if ([0, 1, 2].every(idx => board[idx][idx] === 'X')) return -10;
    if ([0, 1, 2].every(idx => board[idx][2 - idx] === 'O')) return 10;
    if ([0, 1, 2].every(idx => board[idx][2 - idx] === 'X')) return -10;
    return 0;
}

// Check if there are any moves left
function isMovesLeft(board) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') return true;
        }
    }
    return false;
}

// Minimax algorithm
function minimax(board, depth, isMax) {
    const score = evaluateBoard(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!isMovesLeft(board)) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = 'O';
                    best = Math.max(best, minimax(board, depth + 1, false));
                    board[row][col] = '';
                }
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = 'X';
                    best = Math.min(best, minimax(board, depth + 1, true));
                    board[row][col] = '';
                }
            }
        }
        return best;
    }
}

// Find the best move for the computer
function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = { row: -1, col: -1 };

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                board[row][col] = 'O';
                const moveVal = minimax(board, 0, false);
                board[row][col] = '';
                if (moveVal > bestVal) {
                    bestMove = { row, col };
                    bestVal = moveVal;
                }
            }
        }
    }

    return bestMove;
}
