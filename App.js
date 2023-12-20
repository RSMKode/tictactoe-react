import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) return;

    const locations = [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4]
    ];

    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    onPlay(nextSquares, locations[i]);
  };

  const winner = calculateWinner(squares);
  let status;
  status = winner ? `Ganador: ${winner}` : `Turno: ${xIsNext ? "X" : "O"}`;
  if (!squares.includes(null) && !winner) status = "Empate";
  return (
    <>
      <div className="game-status">{status}</div>
      <div className="game-board">
        {squares.map((_, index) => {
          return (
            <Square
              key={index}
              value={squares[index]}
              onSquareClick={() => handleClick(index)}
            />
          );
        })}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState({
    squares: [Array(16).fill(null)],
    location: null
  });
  const [currentMove, setCurrentMove] = useState(0);
  const [reversedMoves, setReversedMoves] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history.squares[currentMove];

  function handlePlay(nextSquares, location) {
    const nextHistory = {
      squares: [...history.squares.slice(0, currentMove + 1), nextSquares],
      location
    };
    setHistory(nextHistory);
    setCurrentMove(nextHistory.squares.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.squares.map((square, move) => {
    let description;
    console.log(history.location);
    description =
      move > 0
        ? `Ir al movimiento #${move} Fila: ${history.location[0]} Columna: ${history.location[1]}`
        : history.location &&
          `Ir al inicio Fila: ${history.location[0]} Columna: ${history.location[1]}`;
    return (
      <li key={move}>
        {move === currentMove ? (
          <b>Estás en el movimiento {move}</b>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const handleReverse = () => {
    setReversedMoves(!reversedMoves);
  };

  return (
    <main className="game">
      <section className="game-space">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <br />
        <button className="button-moves" onClick={handleReverse}>
          Invertir Movimientos
        </button>
      </section>
      <section className="game-info">
        <ol>{reversedMoves ? moves.toReversed() : moves}</ol>
      </section>
    </main>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[a] === squares[d]
    ) {
      console.log(squares[a]);
      return squares[a];
    }
  }
  return null;
}
