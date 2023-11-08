// let Game = function () {
let Gameboard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  function Cell() {
    let value;

    const addToken = (player) => {
      value = player;
    };
    const getValue = () => value;

    return {
      addToken,
      getValue,
    };
  }

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    const selectedCell = board[row][column];
    if (!selectedCell) return;
    selectedCell.addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(boardWithCellValues);
  };

  return { getBoard, dropToken, printBoard };
})();

// console.log(Gameboard.getBoard());
// Gameboard.printBoard();

let GameController = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard;

  const players = [
    {
      name: playerOneName,
      token: "x",
    },
    {
      name: playerTwoName,
      token: "o",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    if (board.getBoard()[row][column].getValue()) {
      console.log(`${getActivePlayer().name} please choose an empty cell`);
      return;
    }
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${
        column + 1
      } row ${row + 1}...`
    );
    board.dropToken(row, column, getActivePlayer().token);
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
  };
})("abc", "xyz");

//   return { Gameboard, GameController };
// };

// you can add the game function to event listener  and ....
