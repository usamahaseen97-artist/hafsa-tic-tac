/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Trophy, User } from 'lucide-react';

type Player = 'X' | 'O';
type BoardState = (Player | null)[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function App() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const checkWinner = useCallback((newBoard: BoardState) => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return { winner: newBoard[a], line: combo };
      }
    }
    if (newBoard.every((cell) => cell !== null)) {
      return { winner: 'Draw' as const, line: null };
    }
    return null;
  }, []);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner !== 'Draw') {
        setScores(prev => ({ ...prev, [result.winner as Player]: prev[result.winner as Player] + 1 }));
      }
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  const currentPlayer = isXNext ? 'X' : 'O';

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex flex-col items-center justify-center p-6 sm:p-12 font-sans">
      {/* Header */}
      <header className="mb-16 text-center">
        <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.3em] text-[#64748B] mb-4">
          Tic Tac Toe
        </h1>
        <div className="w-10 h-0.5 bg-[#3B82F6] mx-auto" />
      </header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Player X Card */}
        <div 
          className={`
            w-40 p-6 bg-white border border-[#E2E8F0] text-center transition-all duration-300
            ${isXNext && !winner ? 'border-[#3B82F6] border-2 shadow-lg scale-105' : 'opacity-80'}
          `}
        >
          <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] mb-4">Player One</div>
          <div className="text-5xl font-bold text-[#3B82F6] mb-4">✕</div>
          <div className="text-4xl font-bold leading-none">{scores.X.toString().padStart(2, '0')}</div>
        </div>

        {/* Board Container */}
        <div className="relative p-1 bg-[#CBD5E1] shadow-2xl">
          <div className="grid grid-cols-3 gap-px w-[320px] sm:w-[450px] aspect-square bg-[#CBD5E1]">
            {board.map((cell, i) => {
              const isWinningCell = winningLine?.includes(i);
              return (
                <button
                  key={i}
                  id={`cell-${i}`}
                  onClick={() => handleClick(i)}
                  className={`
                    flex items-center justify-center text-6xl sm:text-7xl font-medium bg-white transition-colors duration-200
                    ${!cell && !winner ? 'hover:bg-[#F8FAFC]' : ''}
                    ${cell === 'X' ? 'text-[#3B82F6]' : 'text-[#EF4444]'}
                    ${isWinningCell ? 'bg-[#F1F5F9]' : ''}
                  `}
                >
                  <AnimatePresence mode="wait">
                    {cell && (
                      <motion.span
                        key={cell}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {cell === 'X' ? '✕' : '◯'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>

        {/* Player O Card */}
        <div 
          className={`
            w-40 p-6 bg-white border border-[#E2E8F0] text-center transition-all duration-300
            ${!isXNext && !winner ? 'border-[#3B82F6] border-2 shadow-lg scale-105' : 'opacity-80'}
          `}
        >
          <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] mb-4">Player Two</div>
          <div className="text-5xl font-bold text-[#EF4444] mb-4">◯</div>
          <div className="text-4xl font-bold leading-none">{scores.O.toString().padStart(2, '0')}</div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-16 flex flex-col items-center gap-8">
        <div className="bg-[#1E293B] text-white px-8 py-3 text-sm uppercase tracking-widest font-medium shadow-xl">
          {winner ? (
            winner === 'Draw' ? "It's a Draw" : `Player ${winner} Wins`
          ) : (
            `Player ${currentPlayer}'s Turn`
          )}
        </div>
        
        <button
          onClick={resetGame}
          className="px-6 py-2 border border-[#CBD5E1] text-[#64748B] text-xs uppercase tracking-widest hover:bg-[#E2E8F0] hover:text-[#1E293B] transition-colors"
        >
          Restart Session
        </button>
      </div>
    </div>
  );
}
