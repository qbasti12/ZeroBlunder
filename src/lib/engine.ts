export type EngineMove = {
  from: string;
  to: string;
  promotion: string;
};

export class Engine {
  private stockfish: Worker | null = null;
  private onMessage: (event: MessageEvent) => void;

  constructor(onMessage: (event: MessageEvent) => void) {
    this.onMessage = onMessage;
    // We assume stockfish.js is in the public folder.
    // In Vite, public/stockfish.js is served at /stockfish.js
    this.stockfish = new Worker("/stockfish.js");
    this.stockfish.onmessage = this.onMessage;
    this.stockfish.postMessage("uci");
  }

  evaluatePosition(fen: string, depth: number = 10) {
    if (!this.stockfish) return;
    this.stockfish.postMessage("position fen " + fen);
    this.stockfish.postMessage("go depth " + depth);
  }

  stop() {
    this.stockfish?.postMessage("stop");
  }

  quit() {
    this.stockfish?.postMessage("quit");
    this.stockfish?.terminate();
  }
}
