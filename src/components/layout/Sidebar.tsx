import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Gamepad2, Sword, Search, BookOpen, Settings } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <div className="sidebar">
      <div className="logo-area">
        ZERO<span style={{ color: "var(--accent-primary)" }}>BLUNDER</span>
      </div>
      
      <nav>
        <Link to="/" className={isActive("/")}>
          <LayoutDashboard size={20} />
          <span>Home</span>
        </Link>
        <Link to="/play" className={isActive("/play")}>
          <Gamepad2 size={20} />
          <span>Play</span>
        </Link>
        <Link to="/puzzles" className={isActive("/puzzles")}>
          <Sword size={20} />
          <span>Puzzles</span>
        </Link>
        <Link to="/analysis" className={isActive("/analysis")}>
          <Search size={20} />
          <span>Analysis</span>
        </Link>
        <Link to="/learn" className={isActive("/learn")}>
          <BookOpen size={20} />
          <span>Learn</span>
        </Link>
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)" }}></div>
        <Link to="/settings" className={isActive("/settings")}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
