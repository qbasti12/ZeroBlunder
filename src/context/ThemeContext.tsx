import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type BoardTheme = 'green' | 'brown' | 'blue' | 'gray';
type PieceTheme = 'alpha' | 'neo' | 'classic' | 'retro';

interface ThemeContextType {
  boardTheme: BoardTheme;
  pieceTheme: PieceTheme;
  setBoardTheme: (theme: BoardTheme) => void;
  setPieceTheme: (theme: PieceTheme) => void;
  getBoardStyle: () => { dark: string; light: string };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [boardTheme, setBoardTheme] = useState<BoardTheme>(() => {
    return (localStorage.getItem('boardTheme') as BoardTheme) || 'green';
  });

  const [pieceTheme, setPieceTheme] = useState<PieceTheme>(() => {
    return (localStorage.getItem('pieceTheme') as PieceTheme) || 'neo';
  });

  useEffect(() => {
    localStorage.setItem('boardTheme', boardTheme);
  }, [boardTheme]);

  useEffect(() => {
    localStorage.setItem('pieceTheme', pieceTheme);
  }, [pieceTheme]);

  const getBoardStyle = () => {
    switch (boardTheme) {
      case 'green':
        return { dark: '#779954', light: '#e9edcc' }; // Chess.com Green
      case 'brown':
        return { dark: '#b58863', light: '#f0d9b5' }; // Lichess Brown
      case 'blue':
        return { dark: '#687e94', light: '#dee3e6' }; // Lichess Blue
      case 'gray':
        return { dark: '#808080', light: '#d1d1d1' }; // Classic Gray
      default:
        return { dark: '#779954', light: '#e9edcc' };
    }
  };

  return (
    <ThemeContext.Provider value={{ boardTheme, pieceTheme, setBoardTheme, setPieceTheme, getBoardStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
