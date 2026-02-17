import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Engine } from "../lib/engine";
import { useTheme } from "../context/ThemeContext";
import { ArrowLeft, RotateCcw, GraduationCap } from "lucide-react";

export default function PlayCoach() {
  const { getBoardStyle } = useTheme();
  const boardStyle = getBoardStyle();

  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState<Engine | null>(null);
  const [coachMessage, setCoachMessage] = useState("I'm watching your moves. Play White.");
  const [statusColor, setStatusColor] = useState("#4db8ff"); // Neutral
  const [bestMoveForUser, setBestMoveForUser] = useState<string | null>(null);

  useEffect(() => {
    const newEngine = new Engine((event) => {
      const line = event.data;
      // console.log("Coach Engine:", line); // Debug
      
      if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        setBestMoveForUser(move); // Store expected best move
      }
    });

    setEngine(newEngine);
    return () => {
      newEngine.quit();
    };
  }, []);

  // Analyze before user moves to know what was best
  useEffect(() => {
    if (game.turn() === 'w' && engine && !game.isGameOver()) {
        // We want to know the best move for White *before* they move? 
        // Actually, we can just let them move, then analyze the position *before* the move?
        // Or constantly analyze current position?
        // Let's analyze current position for White to have "Best Move" ready.
        engine.evaluatePosition(game.fen(), 10);
    }
  }, [game]);

  // Handle Engine Response (Black)
  useEffect(() => {
    if (game.turn() === 'b' && !game.isGameOver()) {
       // Simple timeout to simulate thinking for Black response
       setTimeout(() => {
           // We can use a second engine instance or just random/heuristic if we don't want to complicate the single engine worker state.
           // However, let's try to verify user move first.
           
           // For Coach to play back, we can just pick a random legal move or use the same engine?
           // The engine is busy analyzing white's position... wait no, turn is black now.
           // So we can ask engine for black's move.
           if (engine) engine.evaluatePosition(game.fen(), 5);
       }, 500);
    }
  }, [game]);

  // Listen for engine best move to either grade user OR play for black
  useEffect(() => {
      if (!bestMoveForUser || !engine) return;

      // If it was Black's turn, the "bestmove" is what the engine plays
      if (game.turn() === 'b') {
          const from = bestMoveForUser.substring(0, 2);
          const to = bestMoveForUser.substring(2, 4);
          const promotion = bestMoveForUser.substring(4, 5);
          
          setGame(g => {
              const copy = new Chess(g.fen());
              try { copy.move({ from, to, promotion: promotion || 'q' }); } catch {}
              return copy;
          });
          // Reset
          setBestMoveForUser(null);
      }
  }, [bestMoveForUser]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (game.turn() !== 'w' || game.isGameOver()) return false;

    // Check legality first
    let move = null;
    const gameCopy = new Chess(game.fen());
    try {
      move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    } catch { return false; }

    if (!move) return false;

    // EVALUATE USER MOVE
    // bestMoveForUser holds the engine's recommendation for the position *before* this move.
    // e.g. "e2e4"
    const userMoveUci = sourceSquare + targetSquare + (move.promotion ? move.promotion : "");
    const isBest = bestMoveForUser && (bestMoveForUser === userMoveUci || bestMoveForUser.startsWith(sourceSquare + targetSquare));

    if (isBest) {
        setCoachMessage("Excellent! That's the best move.");
        setStatusColor("#81b64c"); // Green
    } else {
        setCoachMessage(`Inaccuracy. Better might have been ${bestMoveForUser}.`);
        setStatusColor("#ffcc00"); // Yellow
    }

    setGame(gameCopy);
    setBestMoveForUser(null); // Clear for next turn
    return true;
  }

  return (
    <div className="container" style={{ padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
       
       <div style={{ width: "100%", maxWidth: "600px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/play" className="btn" style={{ background: "transparent", color: "var(--text-secondary)", padding: "5px" }}>
            <ArrowLeft size={20} /> Back
        </Link>
        <h2>Coach Mode</h2>
        <div style={{ width: "30px" }}></div>
      </div>

      <div className="card" style={{ borderLeft: `5px solid ${statusColor}`, width: "100%", maxWidth: "600px", display: "flex", alignItems: "center", gap: "15px" }}>
        <GraduationCap size={32} color={statusColor} />
        <div>
            <h3 style={{ color: statusColor, marginBottom: "5px", fontSize: "1rem" }}>COACH ANALYSIS</h3>
            <p style={{ fontSize: "1.1rem", margin: 0 }}>{coachMessage}</p>
        </div>
      </div>

      <div style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)", borderRadius: "4px", overflow: "hidden" }}>
        <Chessboard 
          options={{
            id: "CoachBoard",
            position: game.fen(),
            onPieceDrop: ({ sourceSquare, targetSquare }) => targetSquare ? onDrop(sourceSquare, targetSquare) : false,
            boardStyle: { width: 500 },
            darkSquareStyle: { backgroundColor: boardStyle.dark },
            lightSquareStyle: { backgroundColor: boardStyle.light },
            animationDurationInMs: 200,
          }}
        />
      </div>

      <button className="btn" style={{ background: "#333", color: "white" }} onClick={() => {
          setGame(new Chess());
          setCoachMessage("New Game. Show me what you got.");
          setStatusColor("#4db8ff");
      }}>
          <RotateCcw size={18} /> New Game
      </button>
    </div>
  );
}
