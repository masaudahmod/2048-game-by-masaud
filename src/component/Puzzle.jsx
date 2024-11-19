import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

const Puzzle = () => {
  const gridSize = 4;
  const [grid, setGrid] = useState(createInitialGrid());
  const [score, setScore] = useState(0);

  const lastScoreLocal = () => {
    localStorage.setItem("lastScore", score);
  };

  const LastScoreStorage = () => {
    return localStorage.getItem("lastScore");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        handleMove(event.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [grid, score]);

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => handleMove("ArrowUp"),
    onSwipedDown: () => handleMove("ArrowDown"),
    onSwipedLeft: () => handleMove("ArrowLeft"),
    onSwipedRight: () => handleMove("ArrowRight"),
  });

  function createInitialGrid() {
    const initialGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(0));
    return addTile(addTile(initialGrid));
  }

  function addTile(currentGrid) {
    const newGrid = currentGrid.map((row) => [...row]);
    const emptyCells = [];
    newGrid.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell === 0) emptyCells.push([i, j]);
      })
    );
    if (emptyCells.length === 0) return newGrid;

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newGrid[x][y] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }

  function handleMove(direction) {
    const movedGrid = moveGrid(grid, direction);
    if (JSON.stringify(movedGrid.grid) !== JSON.stringify(grid)) {
      setGrid(addTile(movedGrid.grid));
      setScore((prev) => prev + movedGrid.score);

      if (checkGameOver(movedGrid.grid)) {
        alert(`Game Over! Your score is ${score}`);
        lastScoreLocal(score);
      }
    }
  }

  function moveGrid(grid, direction) {
    const transposed = direction === "ArrowUp" || direction === "ArrowDown";
    const reversed = direction === "ArrowDown" || direction === "ArrowRight";
    let newGrid = transposed ? transpose(grid) : [...grid];
    let score = 0;

    newGrid = newGrid.map((row) => {
      if (reversed) row.reverse();
      const filteredRow = row.filter((value) => value !== 0);
      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          score += filteredRow[i];
          filteredRow[i + 1] = 0;
        }
      }
      const compactedRow = filteredRow.filter((value) => value !== 0);
      while (compactedRow.length < gridSize) {
        compactedRow.push(0);
      }
      return reversed ? compactedRow.reverse() : compactedRow;
    });

    newGrid = transposed ? transpose(newGrid) : newGrid;
    return { grid: newGrid, score };
  }

  function checkGameOver(grid) {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === 0) return false;
        if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) return false;
        if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  }

  function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  const handleNewGame = () => {
    setGrid(createInitialGrid());
    setScore(0);
  };

  return (
    <div {...swipeHandlers} className="flex flex-col items-center ">
      <h1 className="text-3xl font-bold font-mono tracking-widest my-7">2048 Game</h1>
      <h2 className="text-xl bg-slate-500 font-mono px-5 py-2 text-fuchsia-50 rounded-xl">Score: <span className="text-emerald-300">{score}</span></h2>
      <div className="flex flex-col md:flex-row gap-10 my-6">
        <h2 className="text-lg  bg-slate-600 font-mono px-5 py-2 text-fuchsia-50 rounded-xl">Last Score: {LastScoreStorage()}</h2>

        <button
          onClick={handleNewGame}
          className="relative h-[50px] px-7 border-2 hover:text-emerald-600 text-lg border-black bg-[#e8e8e8] transition-all duration-75 ease-linear font-inherit select-none whitespace-nowrap active:scale-95 group"
        >
          <span className="relative z-10 font-semibold ">
            New Game
          </span>
          <div className="absolute w-[calc(100%_+_6px)] h-[calc(100%_-_16px)] top-2 left-[-3px] bg-[#e8e8e8] transition-all duration-200 ease-linear group-hover:h-[calc(100%_-_32px)] group-hover:top-4" />
          <div className="absolute w-[calc(100%_-_16px)] h-[calc(100%_+_6px)] top-[-3px] left-2 bg-[#e8e8e8] transition-all duration-200 ease-linear group-hover:w-[calc(100%_-_32px)] group-hover:left-4" />
        </button>
      </div>
      <div className={`grid grid-cols-4 gap-4`}>
        {grid.map((row, i) =>
          row.map((value, j) => (
            <div
              key={`${i}-${j}`}
              className={`flex justify-center items-center text-lg md:text-2xl font-semibold rounded-lg ${
                value === 0 ? "bg-gray-300" : "bg-yellow-400"
              } w-16 h-16 md:w-20 md:h-20`}
            >
              {value || ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Puzzle;
