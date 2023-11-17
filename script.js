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
  const getBoardValues = () => {
    return board.map((row) => row.map((cell) => cell.getValue()));
  };

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

  return { getBoard, dropToken, printBoard, getBoardValues };
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
    //win logic
    // console.log(WinnerTokenChecker(board.getBoard()));
    let winnerToken = WinnerTokenChecker(board.getBoardValues()).getWinner();
    console.log(`WinnerToken is ${winnerToken}`);
    let winnerPlayer = WinnerPlayerChecker(winnerToken, players);
    console.log(`WinnerPlayer is ${winnerPlayer}`);

    if (!winnerToken || !winnerPlayer) {
      let TieStatus = TieChecker(board.getBoardValues()).getTie();
      console.log(`Tie is ${TieStatus}`);
      if (TieStatus) {
        let exitOrNot = prompt(
          "It's a Tie!!! enter 'c' to continue or other key to exit"
        );
        if (exitOrNot === "c") {
          RestartGame(board.getBoard());
        } else {
          console.log("Game Over!");
          return;
        }
      }
    } else {
      console.log(`Winner is ${winnerPlayer}!!!`);
    }

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

let WinnerTokenChecker = function (gameboardArray) {
  let winnerPlayer;
  let gameboard = gameboardArray;

  let straightChecker = function (enableColumn = 0) {
    for (
      let row = 0;
      row < (enableColumn ? gameboard[0].length : gameboard.length);
      row++
    ) {
      let elements = [];
      for (
        let column = 0;
        column < (enableColumn ? gameboard.length : gameboard[0].length);
        column++
      ) {
        elements.push(
          gameboard[enableColumn ? column : row][enableColumn ? row : column]
        );
      }

      let equalElements = elements.every((element) => element === elements[0]);
      if (equalElements) {
        return elements[0];
      }
    }
  };

  let leftDiagonalChecker = function () {
    let elements = [];
    for (let row = 0; row < gameboard.length; row++) {
      elements.push(gameboard[row][row]);
    }
    let equalElements = elements.every((element) => element === elements[0]);
    if (equalElements) {
      return elements[0];
    }
  };

  let rightDiagonalChecker = function () {
    let elements = [];
    let column = gameboard.length - 1;
    for (let row = 0; row < gameboard.length; row++) {
      elements.push(gameboard[row][column--]);
    }
    let equalElements = elements.every((element) => element === elements[0]);
    if (equalElements) {
      return elements[0];
    }
  };

  winnerPlayer =
    straightChecker() ||
    straightChecker("for column") ||
    leftDiagonalChecker() ||
    rightDiagonalChecker();

  const getWinner = () => winnerPlayer;
  return { getWinner };
};

let WinnerPlayerChecker = function (winnerToken, players) {
  if (winnerToken) {
    if (winnerToken === players[0].token) {
      return players[0].name;
    } else if (winnerToken === players[1].token) {
      return players[1].name;
    } else {
      return "unknown player";
    }
  } else {
    return "No winners yet";
  }
};
let TieChecker = function (gameBoard) {
  let isTie;
  let boardArray = gameBoard;

  const isEveryElementDefined = boardArray.every((row) =>
    row.every((element) => element !== undefined)
  );
  isEveryElementDefined ? (isTie = true) : (isTie = false);
  let getTie = () => isTie;

  return { getTie };
};

let RestartGame = function (board) {
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      board[row][column].addToken(undefined);
    }
  }
};

//many duplicate code that needs to be refactored
//make BoardValues function to be added to a property of Gameboard
//instead of declaring it and calling it everywhere
let GameDisplay = function () {
  let activePlayerDisplay = document.querySelector(".activePlayer");
  let cells = Array.from(document.querySelectorAll(".gameboard > *"));

  activePlayerDisplay.textContent = `${
    GameController.getActivePlayer().name
  }'s turn.`;

  cells.forEach((cell) => {
    cell.addEventListener("click", function () {
      let position = this.getAttribute("rowcol")
        .split("")
        .map((str) => Number(str));
      let row = position[0];
      let column = position[1];
      GameController.playRound(row, column);

      this.textContent = Gameboard.getBoard()[row][column].getValue();
      activePlayerDisplay.textContent = `${
        GameController.getActivePlayer().name
      }'s turn.`;
    });
  });

  let getCell = function (row, column) {};
};

GameDisplay();
