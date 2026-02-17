import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Engine } from "../lib/engine";
import { useTheme } from "../context/ThemeContext";
import { RotateCcw, ArrowLeft } from "lucide-react";

export default function PlayBotGame() {
  const { botId } = useParams();
  const { getBoardStyle } = useTheme();
  const boardStyle = getBoardStyle();

  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState<Engine | null>(null);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState("");

  // Difficulty mapping (approximate dept/skill)
  const getDepth = () => {
    switch (botId) {
      case "martin": return 1;
      case "elani": return 3;
      case "emir": return 6;
      case "sven": return 8;
      case "nelson": return 10;
      case "antigravity": return 15;
      default: return 5;
    }
  };

  useEffect(() => {
    // Initialize Engine
    const newEngine = new Engine((event) => {
      const line = event.data;
      if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        if (move) {
          makeEngineMove(move);
        }
      }
    });
    setEngine(newEngine);

    return () => {
      newEngine.quit();
    };
  }, []); // Only once on mount

  function makeEngineMove(bestMove: string) {
    const from = bestMove.substring(0, 2);
    const to = bestMove.substring(2, 4);
    const promotion = bestMove.substring(4, 5); // 'q' usually

    setGame(g => {
        const copy = new Chess(g.fen());
        try {
            copy.move({ from, to, promotion: promotion || 'q' });
        } catch (e) {
            console.error("Invalid engine move", bestMove, e);
        }
        return copy;
    });
    setIsEngineThinking(false);
  }

  // Trigger engine if it's black's turn (assuming player is white for now)
  useEffect(() => {
    if (game.isGameOver()) {
        if (game.isCheckmate()) setGameStatus("Checkmate!");
        else if (game.isDraw()) setGameStatus("Draw");
        return;
    }

    if (game.turn() === 'b' && !isEngineThinking && engine) {
      setIsEngineThinking(true);
      // Add a small delay for realism
      setTimeout(() => {
        engine.evaluatePosition(game.fen(), getDepth());
      }, 500);
    }
  }, [game, engine]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (game.turn() !== 'w' || game.isGameOver()) return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) return false;

      setGame(gameCopy);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div className="container" style={{ padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div style={{ width: "100%", maxWidth: "600px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/play/bots" className="btn" style={{ background: "transparent", color: "var(--text-secondary)", padding: "5px" }}>
            <ArrowLeft size={20} /> Back
        </Link>
        <h2>Vs. {botId?.toUpperCase()}</h2>
        <div style={{ width: "30px" }}></div>
      </div>

      <div style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)", borderRadius: "4px", overflow: "hidden" }}>
        <Chessboard 
          options={{
            id: "BotGame",
            position: game.fen(),
            onPieceDrop: ({ sourceSquare, targetSquare }) => targetSquare ? onDrop(sourceSquare, targetSquare) : false,
            boardStyle: { width: 500 },
             darkSquareStyle: { backgroundColor: boardStyle.dark },
            lightSquareStyle: { backgroundColor: boardStyle.light },
            animationDurationInMs: 200,
          }}
        />
      </div>

      {gameStatus && (
          <div className="card" style={{ background: "#81b64c", color: "white", padding: "15px 30px" }}>
              <h3>Game Over: {gameStatus}</h3>
          </div>
      )}

      <button className="btn" style={{ background: "#333", color: "white" }} onClick={() => {
          setGame(new Chess());
          setGameStatus("");
      }}>
          <RotateCcw size={18} /> New Game
      </button>
    </div>
  );
}
