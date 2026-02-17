import { useTheme } from "../context/ThemeContext";
import { Chessboard } from "react-chessboard";

export default function Settings() {
  const { boardTheme, pieceTheme, setBoardTheme, setPieceTheme, getBoardStyle } = useTheme();
  
  const boardStyles = getBoardStyle();

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 style={{ marginBottom: "30px", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px" }}>Settings</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        {/* Left Column: Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          
          <div className="card">
            <h3>Board Theme</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "15px" }}>Customize the board colors.</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {(['green', 'brown', 'blue', 'gray'] as const).map(theme => (
                <button
                  key={theme}
                  className={`btn ${boardTheme === theme ? 'btn-primary' : ''}`}
                  style={{ background: boardTheme === theme ? '' : '#333', textTransform: 'capitalize' }}
                  onClick={() => setBoardTheme(theme)}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Piece Set</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "15px" }}>Choose your favorite piece style.</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
               {/* Note: react-chessboard doesn't easily support custom piece sets names directly without custom renders, 
                   but we will simulate the selection for now and implement the actual change if supported or via custom SVGs later. 
                   For now, 'neo' is default. 'alpha' is standard. */}
              {(['neo', 'alpha', 'classic'] as const).map(theme => (
                <button
                  key={theme}
                  className={`btn ${pieceTheme === theme ? 'btn-primary' : ''}`}
                  style={{ background: pieceTheme === theme ? '' : '#333', textTransform: 'capitalize' }}
                  onClick={() => setPieceTheme(theme)}
                >
                  {theme}
                </button>
              ))}
            </div>
             <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "10px" }}>* Visual support for piece sets coming in next update. Currently only default supported by library seamlessly.</p>
          </div>

        </div>

        {/* Right Column: Preview */}
        <div>
          <h3 style={{ marginBottom: "15px" }}>Preview</h3>
          <div style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)", borderRadius: "4px", overflow: "hidden" }}>
            <Chessboard 
              options={{
                id: "SettingsPreview",
                position: "start",
                boardStyle: { width: 400 },
                darkSquareStyle: { backgroundColor: boardStyles.dark },
                lightSquareStyle: { backgroundColor: boardStyles.light },
                animationDurationInMs: 200,
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
