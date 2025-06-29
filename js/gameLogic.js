/**
 * @file gameLogic.js
 * Pure game engine for Exercise 3 – no DOM, no file I/O
 * Author: Purna S. K. Saride – 28 Jun 2025
 */

/* 0-based index triples for every winning line */
export const WINS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // cols
  [0, 4, 8], [2, 4, 6]               // diags
];

/* fresh state */
export function newState (first = 'O') {
  return { board: Array(9).fill(''), turn: first, winner: null };
}

/* immutable move */
export function move (s, i) {
  if (s.winner || s.board[i]) return s;      // illegal
  const board  = [...s.board];
  board[i]     = s.turn;
  const winner = detectWin(board);
  return {
    board,
    turn: winner ? s.turn : (s.turn === 'O' ? 'X' : 'O'),
    winner
  };
}

/**
 * Detect a winner.
 * Returns 'X', 'O', or null.
 */
export function detectWin (board) {
  for (const [a, b, c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];        // winner mark
    }
  }
  return null;                // no win
}
