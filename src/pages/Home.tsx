import { Link } from "react-router-dom";
import { Play, Search, Brain, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="container">
      <div style={{ padding: "40px 0" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>Welcome Back!</h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          
          {/* Main Hero / Daily Puzzle Teaser */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "300px", background: "linear-gradient(135deg, #262421 0%, #1a1917 100%)" }}>
            <Brain size={64} color="var(--accent-primary)" style={{ marginBottom: "20px" }} />
            <h2 style={{ marginBottom: "10px" }}>Daily Puzzle</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Solve today's tactical challenge.</p>
            <Link to="/puzzles" className="btn btn-primary">Solve Now</Link>
          </div>

          {/* Quick Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Link to="/play" className="card" style={{ display: "flex", alignItems: "center", gap: "15px", textDecoration: "none", cursor: "pointer", transition: "transform 0.2s" }}>
              <div style={{ background: "#4b4845", padding: "12px", borderRadius: "8px" }}>
                <Play size={32} color="var(--accent-primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem" }}>Play Computer</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Challenge bots from 200-3000 ELO</p>
              </div>
            </Link>

            <Link to="/analysis" className="card" style={{ display: "flex", alignItems: "center", gap: "15px", textDecoration: "none", cursor: "pointer", transition: "transform 0.2s" }}>
              <div style={{ background: "#4b4845", padding: "12px", borderRadius: "8px" }}>
                <Search size={32} color="#68a3d3" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem" }}>Analyze Game</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Import PGN or setup position</p>
              </div>
            </Link>

            <Link to="/" className="card" style={{ display: "flex", alignItems: "center", gap: "15px", textDecoration: "none", cursor: "pointer", opacity: 0.7 }}>
               <div style={{ background: "#4b4845", padding: "12px", borderRadius: "8px" }}>
                <Trophy size={32} color="#ffd700" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem" }}>Tournaments</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Coming soon</p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
