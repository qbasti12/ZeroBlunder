import { Link } from "react-router-dom";
import { Cpu, GraduationCap } from "lucide-react";

export default function Play() {
  return (
    <div className="container" style={{ padding: "40px 0", textAlign: "center" }}>
      <h1 style={{ marginBottom: "40px" }}>Play Chess</h1>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
        
        <Link to="/play/bots" className="card" style={{ width: "300px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "40px", cursor: "pointer", transition: "transform 0.2s", textDecoration: "none" }}>
          <Cpu size={64} color="var(--accent-primary)" />
          <div>
            <h2 style={{ marginBottom: "10px" }}>Play vs Bots</h2>
            <p style={{ color: "var(--text-secondary)" }}>Challenge computer personalities from 200 to 3000 ELO.</p>
          </div>
          <span className="btn btn-primary">Select Bot</span>
        </Link>

        <Link to="/play/coach" className="card" style={{ width: "300px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "40px", cursor: "pointer", transition: "transform 0.2s", textDecoration: "none" }}>
          <GraduationCap size={64} color="#ffd700" />
          <div>
            <h2 style={{ marginBottom: "10px" }}>Play Coach</h2>
            <p style={{ color: "var(--text-secondary)" }}>Get real-time feedback and move explanations.</p>
          </div>
          <span className="btn" style={{ background: "#444", color: "white" }}>Start Training</span>
        </Link>

      </div>
    </div>
  );
}
