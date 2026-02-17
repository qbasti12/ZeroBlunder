import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";

const bots = [
  // Beginners
  { id: "martin", name: "Martin", elo: 250, desc: "Can barely move pieces.", type: "beginner" },
  { id: "elani", name: "Elani", elo: 400, desc: "Learning the rules.", type: "beginner" },
  // Intermediate
  { id: "emir", name: "Emir", elo: 1000, desc: "Solid player.", type: "intermediate" },
  { id: "sven", name: "Sven", elo: 1200, desc: "Dangerous tactician.", type: "intermediate" },
  // Advanced
  { id: "nelson", name: "Nelson", elo: 1500, desc: "Queen attacks only.", type: "advanced" },
  { id: "antigravity", name: "Antigravity", elo: 3000, desc: "Grandmaster Level.", type: "advanced" },
];

export default function PlayBots() {
  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 style={{ marginBottom: "20px" }}>Choose Your Opponent</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {bots.map(bot => (
          <div key={bot.id} className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#444", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {/* Placeholder Avatar */}
              <Cpu size={40} color="var(--accent-primary)" />
            </div>
            
            <div>
              <h3 style={{ margin: 0 }}>{bot.name}</h3>
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "bold" }}>Play ({bot.elo})</span>
            </div>
            
            <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "10px" }}>{bot.desc}</p>
            
            <Link to={`/play/bot/${bot.id}`} className="btn btn-primary" style={{ width: "100%" }}>
              Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
