const gameBoard = (function() {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function getBoard() {
        return board;
    }

    function resetBoard() {
        board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
    }

    function setCell(row, col, token) {
        if (row >= 0 && row < board.length &&
            col >= 0 && col < board[row].length &&
            board[row][col] == '')
            board[row][col] = token;
    }

    return { 
        getBoard,
        setCell,
        resetBoard
    };
})();

function createPlayer(name, token) {
    this.token = token;

    function changeName(newName) {
        this.name = newName;
    }
    return { name, token, changeName };
}

const gameController = (function() {
    let board = [];
    let winnerToken = '';
    let isDraw = false;

    function resetWinnerToken() {
        winnerToken = '';
    }

    function getWinnerToken() {
        return winnerToken;
    }

    function getIsDraw() {
        return isDraw;
    }

    function setBoard(sourceBoard) {
        board = sourceBoard;
        checkResult();
        // If no winner, check if draw.
        if (winnerToken == '') {
            isDraw = checkDraw();
        }
    }

    function displayBoard() {
        console.log(board);
    }

    function checkResult() {
        const winningCombinations = [
            // Rows
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // Columns
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // Diagonals
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        for (let combo of winningCombinations) {
            // assigns by row of the winning combination array. If all are the same, it's a win.
            const [a, b, c] = combo;
            if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                winnerToken = board[a[0]][a[1]];
                return;
            }
        }
    }

    function checkDraw() {
        return board.flat().every(cell => cell !== '');
    }
    
    return {
        setBoard,
        displayBoard,
        getWinnerToken,
        getIsDraw,
        resetWinnerToken
    }
})();

const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");

const cells = document.querySelectorAll(".cell");
const newGameButton = document.getElementById("newGameButton");
const playerTurn = document.getElementById("playerTurn");
const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name");
const changePlayer1 = document.getElementById("changePlayer1");
const changePlayer2 = document.getElementById("changePlayer2");
const nameDialog = document.getElementById("nameDialog");
const saveDialogButton = document.getElementById("saveDialogButton");
const closeDialogButton = document.getElementById("closeDialogButton");
const dialogInput = document.getElementById("dialogInput");
const dialogForm = document.getElementById("dialogForm");

let isChangingPlayer1 = false;

let currentToken = "X";
showTurn();

displayPlayerNames();

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        
        const row = cell.getAttribute("data-row");
        const col = cell.getAttribute("data-col");
        
        let board = gameBoard.getBoard();
        if (board[row][col] === '') {
            gameBoard.setCell(row, col, currentToken);
            cell.textContent = currentToken;

            gameController.setBoard(gameBoard.getBoard());
            //gameController.displayBoard();

            if (gameController.getWinnerToken() != '') {
                if (player1.token === currentToken) {
                    playerTurn.textContent = player1.name + ' wins!';
                }
                else if (player2.token === currentToken) {
                    playerTurn.textContent = player2.name + ' wins!';
                }
                disableCells();
            }
            else if (gameController.getIsDraw()) {
                playerTurn.textContent = "It's a draw!";
                disableCells();
            }
            else {
                currentToken = currentToken === 'X' ? 'O' : 'X';
                showTurn();
            }
        }
    })
})

newGameButton.addEventListener('click', () => {
    gameBoard.resetBoard();
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
    });
    gameController.resetWinnerToken();
    playerTurn.textContent = '';
    currentToken = 'X';
    showTurn();
})

changePlayer1.addEventListener('click', () => {
    isChangingPlayer1 = true;
    dialogInput.value = player1.name;
    nameDialog.showModal();
});

changePlayer2.addEventListener('click', () => {
    isChangingPlayer1 = false;
    dialogInput.value = player2.name;
    nameDialog.showModal();
})

closeDialogButton.addEventListener('click', () => {
    nameDialog.close();
});

saveDialogButton.addEventListener('click', (e) => {
    if (dialogInput.value.trim() !== '') {
        e.preventDefault();
        if (isChangingPlayer1) {
            player1.changeName(dialogInput.value);
        }
        else {
            player2.changeName(dialogInput.value);
        }
        displayPlayerNames();
        showTurn();
        nameDialog.close();
    }
})

function disableCells() {
    cells.forEach(cell => {
        cell.style.pointerEvents = 'none';
    });
}

function showTurn() {
    if (player1.token === currentToken) {
        playerTurn.textContent = player1.name + "'s Turn";
    }
    else if (player2.token === currentToken) {
        playerTurn.textContent = player2.name + "'s Turn";
    }
}

function displayPlayerNames() {
    player1Name.textContent = player1.name + " is X";
    player2Name.textContent = player2.name + " is O";
    console.log(player1.name);
}


