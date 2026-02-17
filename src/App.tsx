import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Play from "./pages/Play";
import PlayBots from "./pages/PlayBots";
import PlayBotGame from "./pages/PlayBotGame";
import PlayCoach from "./pages/PlayCoach";
import Puzzles from "./pages/Puzzles";
import Analysis from "./pages/Analysis";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="play" element={<Play />} />
        <Route path="play/bots" element={<PlayBots />} />
        <Route path="play/coach" element={<PlayCoach />} />
        <Route path="play/bot/:botId" element={<PlayBotGame />} />
        <Route path="puzzles" element={<Puzzles />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="settings" element={<Settings />} />
        <Route path="learn" element={<div className="container"><h2>Coming Soon</h2></div>} />
        <Route path="*" element={<div className="container"><h2>404 - Page Not Found</h2></div>} />
      </Route>
    </Routes>
  );
}