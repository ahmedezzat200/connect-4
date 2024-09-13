document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const whosturnElement = document.getElementById('whosturn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    let currentPlayer = 'red';
    const rows = 6;
    const cols = 7;
    let gameBoard = Array(cols).fill(null).map(() => Array(rows).fill(null));
    let gameActive = true;

    function createBoard() {
        boardElement.innerHTML = '';
        for (let col = 0; col < cols; col++) {
            const columnElement = document.createElement('div');
            columnElement.classList.add('column');
            columnElement.dataset.col = col;
            boardElement.appendChild(columnElement);

            for (let row = 0; row < rows; row++) {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.col = col;
                cellElement.dataset.row = row;
                columnElement.appendChild(cellElement);
            }
        }
    }

    createBoard();

    function addColumnEventListeners() {
        const columns = document.querySelectorAll('.column');
        columns.forEach(column => {
            column.addEventListener('click', handleColumnClick);
        });
    }

    addColumnEventListeners();

    function handleColumnClick(event) {
        if (!gameActive) return;

        const col = parseInt(event.currentTarget.dataset.col);
        placeDisc(col);
    }

    function placeDisc(col) {
        for (let row = rows - 1; row >= 0; row--) {
            if (!gameBoard[col][row]) {
                gameBoard[col][row] = currentPlayer;
                updateCellUI(col, row);
                if (checkWin(col, row)) {
                    gameActive = false;
                    setTimeout(() => {
                        alert(`${capitalize(currentPlayer)} wins!`);
                        playAgainBtn.style.display = 'block';
                    }, 50);
                } else if (isBoardFull()) {
                    gameActive = false;
                    setTimeout(() => {
                        alert("It's a draw!");
                        playAgainBtn.style.display = 'block';
                    }, 50);
                } else {
                    switchPlayer();
                }
                return;
            }
        }
        alert('Column is full!');
    }

    function updateCellUI(col, row) {
        const cell = document.querySelector(`.cell[data-col='${col}'][data-row='${row}']`);
        cell.style.backgroundColor = currentPlayer;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        whosturnElement.textContent = `${capitalize(currentPlayer)}'s Turn`;
    }

    function checkWin(col, row) {
        return (
            checkDirection(col, row, 0, 1) ||
            checkDirection(col, row, 1, 0) ||
            checkDirection(col, row, 1, 1) ||
            checkDirection(col, row, 1, -1)
        );
    }

    function checkDirection(col, row, colStep, rowStep) {
        let count = 1;
        count += countDiscs(col, row, colStep, rowStep);
        count += countDiscs(col, row, -colStep, -rowStep);
        return count >= 4;
    }

    function countDiscs(col, row, colStep, rowStep) {
        let count = 0;
        let c = col + colStep;
        let r = row + rowStep;
        while (c >= 0 && c < cols && r >= 0 && r < rows && gameBoard[c][r] === currentPlayer) {
            count++;
            c += colStep;
            r += rowStep;
        }
        return count;
    }

    function isBoardFull() {
        return gameBoard.every(column => column.every(cell => cell !== null));
    }

    function resetGame() {
        gameBoard = Array(cols).fill(null).map(() => Array(rows).fill(null));
        currentPlayer = 'red';
        whosturnElement.textContent = "Red's Turn";
        gameActive = true;
        createBoard();
        addColumnEventListeners();
        playAgainBtn.style.display = 'none';
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    playAgainBtn.addEventListener('click', resetGame);

    playAgainBtn.style.display = 'none';
});
