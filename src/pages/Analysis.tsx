import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Engine } from "../lib/engine";
import { useTheme } from "../context/ThemeContext";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";

export default function Analysis() {
  const { getBoardStyle } = useTheme();
  const boardStyle = getBoardStyle();


  const [history, setHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); // -1 = Start position
  const [displayedFen, setDisplayedFen] = useState("start");
  
  const [pgnInput, setPgnInput] = useState("");
  const [engine, setEngine] = useState<Engine | null>(null);
  const [evaluation, setEvaluation] = useState<string>("0.0");
  const [bestMove, setBestMove] = useState<string>("");

  useEffect(() => {
    const newEngine = new Engine((event) => {
      const line = event.data;
      // Parse info (e.g., "info depth 10 ... score cp 50 ... pv e2e4 ...")
      if (line.startsWith("info") && line.includes("score cp")) {
          const match = line.match(/score cp (-?\d+)/);
          if (match) {
              const cp = parseInt(match[1]);
              // Adjust for turn? Stockfish gives score relative to side to move usually, or white?
              // Standard UCI is white's perspective usually, but stockfish sometimes is side-to-move.
              // Let's assume CP is centipawns for side in check? 
              // Actually Stockfish gives score from white's perspective OR side to move depending on options.
              // We'll display raw CP for now.
              setEvaluation((cp / 100).toFixed(2));
          }
      } else if (line.startsWith("info") && line.includes("score mate")) {
          const match = line.match(/score mate (-?\d+)/);
          if (match) setEvaluation(`M${match[1]}`);
      }
      
      if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        setBestMove(move);
      }
    });

    setEngine(newEngine);
    return () => newEngine.quit();
  }, []);

  useEffect(() => {
    if (engine) {
        setEvaluation("...");
        setBestMove("");
        engine.evaluatePosition(displayedFen, 12);
    }
  }, [displayedFen, engine]);

  function loadPgn() {
    try {
      const g = new Chess();
      g.loadPgn(pgnInput);
      const h = g.history();
      setHistory(h);
      setCurrentMoveIndex(h.length - 1);
      setDisplayedFen(g.fen());
    } catch {
      alert("Invalid PGN");
    }
  }

  function goToMove(index: number) {
      if (index < -1 || index >= history.length) return;
      
      const g = new Chess();
      // Replay moves
      for (let i = 0; i <= index; i++) {
          g.move(history[i]);
      }
      setCurrentMoveIndex(index);
      setDisplayedFen(g.fen());
  }

  return (
    <div className="container" style={{ padding: "20px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
        
        {/* Left: Board & Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          
          {/* Eval Bar (Simplified Visual) */}
          <div style={{ width: "100%", maxWidth: "500px", height: "10px", background: "#333", borderRadius: "5px", overflow: "hidden", display: "flex" }}>
              <div style={{ width: "50%", background: "#fff", transition: "width 0.5s" }}></div> {/* Placeholder centered */}
          </div>
          
          <div style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)", borderRadius: "4px", overflow: "hidden" }}>
             <Chessboard 
              options={{
                id: "AnalysisBoard",
                position: displayedFen,
                boardStyle: { width: 500 },
                darkSquareStyle: { backgroundColor: boardStyle.dark },
            lightSquareStyle: { backgroundColor: boardStyle.light },
                animationDurationInMs: 200,
              }}
            />
          </div>

          <div className="card" style={{ width: "100%", maxWidth: "500px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button className="btn" onClick={() => goToMove(currentMoveIndex - 1)} disabled={currentMoveIndex < 0}>
                  <ChevronLeft /> Prev
              </button>
              <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  {currentMoveIndex === -1 ? "Start" : `${Math.floor(currentMoveIndex / 2) + 1}. ${history[currentMoveIndex]}`}
              </span>
              <button className="btn" onClick={() => goToMove(currentMoveIndex + 1)} disabled={currentMoveIndex >= history.length - 1}>
                  Next <ChevronRight />
              </button>
          </div>

           {/* Analysis Info */}
           <div className="card" style={{ width: "100%", maxWidth: "500px", borderLeft: "4px solid var(--accent-primary)" }}>
                <h4>Stockfish Evaluation</h4>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <span>Eval: <strong>{evaluation}</strong></span>
                    <span>Best: <strong>{bestMove}</strong></span>
                </div>
            </div>

        </div>

        {/* Right: PGN & Move List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="card">
                <h3>Load Game</h3>
                <textarea 
                    value={pgnInput}
                    onChange={(e) => setPgnInput(e.target.value)}
                    placeholder="Paste PGN here..."
                    style={{ width: "100%", height: "100px", background: "#333", color: "#fff", border: "1px solid #444", borderRadius: "4px", padding: "10px", marginTop: "10px", marginBottom: "10px" }}
                />
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={loadPgn}>
                    <Upload size={18} /> Import PGN
                </button>
            </div>

            <div className="card" style={{ flex: 1, overflowY: "auto", maxHeight: "400px" }}>
                <h3>History</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "10px" }}>
                    {history.map((move, i) => (
                        <span 
                            key={i} 
                            onClick={() => goToMove(i)}
                            style={{ 
                                padding: "2px 6px", 
                                cursor: "pointer", 
                                background: i === currentMoveIndex ? "var(--accent-primary)" : "rgba(255,255,255,0.1)", 
                                borderRadius: "4px",
                                color: i === currentMoveIndex ? "#fff" : "var(--text-secondary)"
                            }}
                        >
                            {i % 2 === 0 ? `${Math.floor(i/2) + 1}.` : ""} {move}
                        </span>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
