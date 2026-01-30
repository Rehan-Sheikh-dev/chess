const socket = io();
const chess = new Chess();
const chessboard = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = "w"; 

const renderBoard = () => {
  const board = chess.board();
  chessboard.innerHTML = "";

  board.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      const square = document.createElement("div");
      square.classList.add(
        "square",
        (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
      );

      square.dataset.row = rowIndex;
      square.dataset.col = colIndex;

      if (piece) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          piece.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(piece);
        pieceElement.draggable = playerRole === piece.color;

        pieceElement.addEventListener("dragstart", (e) => {
          if (!pieceElement.draggable) return;
          draggedPiece = piece;
          sourceSquare = { row: rowIndex, col: colIndex };
          e.dataTransfer.setData("text/plain", "");
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        });

        square.appendChild(pieceElement);
      }

      square.addEventListener("dragover", (e) => e.preventDefault());

      square.addEventListener("drop", () => {
        if (!draggedPiece) return;

        const targetSquare = {
          row: parseInt(square.dataset.row),
          col: parseInt(square.dataset.col),
        };

        handleMove(sourceSquare, targetSquare);
      });

      chessboard.appendChild(square);
    });
  });
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row }`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row }`,
    promotion: "q",
  };

  const result = chess.move(move);

  if (result) {
    renderBoard();
  } else {
    alert("Invalid move!");
  }
};

const coordsToSquare = ({ row, col }) => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  return files[col] + ranks[row];
};

const getPieceUnicode = (piece) => {
  const map = {
    w: {
      p: "♙",
      r: "♖",
      n: "♘",
      b: "♗",
      q: "♕",
      k: "♔",
    },
    b: {
      p: "♙",
      r: "♜",
      n: "♞",
      b: "♝",
      q: "♛",
      k: "♚",
    },
  };

  return map[piece.color][piece.type] || "";
};

socket.on("playerRole", (role) => {
  playerRole = role;    
renderBoard();
})

socket.on("spectatorRole", (role) => {
  playerRole = null;    
renderBoard();
})

socket.on("boardState", (fen) => {
  chess.load(fen);
  renderBoard();
})

socket.on("move", (fen) => {
  chess.move(fen);
  renderBoard();
})


renderBoard();
