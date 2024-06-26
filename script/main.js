document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let currentPlayer = 'X';
    let gameOver = false;

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

    // Computer move
    function computerMove() {
        let emptyCells = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    emptyCells.push({ row, col });
                }
            }
        }
        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[row][col] = 'O';
            const cell = boardElement.querySelector(`td[data-row='${row}'][data-col='${col}']`);
            cell.textContent = 'O';
            if (checkWin('O')) {
                statusElement.textContent = 'O wins!';
                gameOver = true;
            } else if (checkDraw()) {
                statusElement.textContent = `It's a draw!`;
                gameOver = true;
            } else {
                currentPlayer = 'X';
            }
        }
    }

    // Initialize the game
    initializeBoard();
});
