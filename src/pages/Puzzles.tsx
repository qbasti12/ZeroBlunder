import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useTheme } from "../context/ThemeContext";
import { ArrowRight, RotateCcw } from "lucide-react";



const ACTUAL_PUZZLES = [
    {
        id: 1,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
        solutionSan: "Qxf7#",
        hint: "Target the f7 square!"
    },
    {
        id: 2,
        fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
        solutionSan: "Re8#",
        hint: "The King is trapped on the back rank."
    },
    {
        id: 3,
        fen: "8/8/8/8/8/6k1/8/6KQ w - - 0 1",
        solutionSan: "Qg2#",
        hint: "Queen and King mate."
    },
       {
        id: 4,
        fen: "4R3/2p2p1k/p4Ppp/1p6/5Q2/2P4P/PP3PPK/3r4 w - - 0 32",
        solutionSan: "Rh8+",
        hint: "Sacrifice the Rook to open the h-file!" 
        // If Kxh8, Qxh6+ Kg8 Qg7#
    }
];

export default function Puzzles() {
  const { getBoardStyle } = useTheme();
  const boardStyle = getBoardStyle();
  
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [game, setGame] = useState(new Chess(ACTUAL_PUZZLES[0].fen));
  const [status, setStatus] = useState<"solving" | "correct" | "wrong">("solving");

  const currentPuzzle = ACTUAL_PUZZLES[currentPuzzleIndex];

  useEffect(() => {
    const newGame = new Chess(currentPuzzle.fen);
    setGame(newGame);
    setStatus("solving");
  }, [currentPuzzleIndex]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (status === "correct") return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) return false;

      if (move.san === currentPuzzle.solutionSan) {
        setGame(gameCopy);
        setStatus("correct");
        return true;
      } else {
        setStatus("wrong");
        // Don't make the move on board if wrong
        return false; 
        // Or make it and then undo? Better not to allow it.
      }
    } catch {
      return false;
    }
  }

  function nextPuzzle() {
    if (currentPuzzleIndex < ACTUAL_PUZZLES.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
    } else {
      alert("You completed all puzzles!");
      setCurrentPuzzleIndex(0);
    }
  }

  function retry() {
    setGame(new Chess(currentPuzzle.fen));
    setStatus("solving");
  }

  return (
    <div className="container" style={{ padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <h1>Daily Puzzles</h1>
      <p style={{ color: "var(--text-secondary)" }}>Puzzle {currentPuzzleIndex + 1} of {ACTUAL_PUZZLES.length}</p>

      <div style={{ padding: "15px", background: status === "correct" ? "rgba(129, 182, 76, 0.2)" : status === "wrong" ? "rgba(255, 77, 77, 0.2)" : "transparent", borderRadius: "8px", border: `1px solid ${status === "correct" ? "#81b64c" : status === "wrong" ? "#ff4d4d" : "transparent"}`, width: "100%", maxWidth: "500px", textAlign: "center", minHeight: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {status === "solving" && <span style={{color: "#bbb"}}>{currentPuzzle.hint}</span>}
        {status === "correct" && <span style={{color: "#81b64c", fontWeight: "bold", fontSize: "1.2rem"}}>Correct! Well done.</span>}
        {status === "wrong" && <span style={{color: "#ff4d4d", fontWeight: "bold"}}>Wrong move. Try again.</span>}
      </div>

      <div style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)", borderRadius: "4px", overflow: "hidden" }}>
        <Chessboard 
          options={{
            id: "PuzzleBoard",
            position: game.fen(),
            onPieceDrop: ({ sourceSquare, targetSquare }) => targetSquare ? onDrop(sourceSquare, targetSquare) : false,
            boardStyle: { width: 500 },
            darkSquareStyle: { backgroundColor: boardStyle.dark },
            lightSquareStyle: { backgroundColor: boardStyle.light },
            animationDurationInMs: 200,
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <button className="btn" style={{ background: "#444", color: "white" }} onClick={retry}>
            <RotateCcw size={18} /> Retry
        </button>
        
        {status === "correct" && (
            <button className="btn btn-primary" onClick={nextPuzzle}>
                Next Puzzle <ArrowRight size={18} />
            </button>
        )}
      </div>
    </div>
  );
}
