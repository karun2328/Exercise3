/**
 * ui.js
 * Two-browser Tic-Tac-Toe – Exercise 3
 * Author: Purna Satya Karun Saride – 28 Jun 2025
 */
import { newState, move, WINS } from './gameLogic.js';

const btn   = document.getElementById('toggleBtn');   // “Load” in HTML
const cells = [...document.querySelectorAll('#board input')];

let fileHandle;              // FileSystemFileHandle
let state;                   // Current game-state
let hasAlerted = false;      // <─ NEW: prevents repeat alerts
/* ─────────  Load / Clear toggle  ───────── */
btn.addEventListener('click', async () => {
  if (!fileHandle) await pickFile();            // choose state.json once

  /* LOAD: just read state.json and paint board */
  if (btn.textContent === 'Load') {
    await loadState();
    render();
    btn.textContent = 'Clear';
    return;                                     // stop; do NOT reset game
  }

  /* CLEAR: start a brand-new empty game */
  state       = newState(randomFirst());
  hasAlerted  = false;                          // reset alert flag
  await saveState();
  render();
  btn.textContent = 'Load';
});


/* ─────────  Cell clicks = moves  ───────── */
cells.forEach((cell, idx) =>
  cell.addEventListener('click', async () => {
    if (!state || state.winner) return;         // ignore if game over
    state = move(state, idx);
    await saveState();
    render();
  })
);


/* ─────────  File-System-Access helpers  ───────── */
async function pickFile () {
  [fileHandle] = await window.showOpenFilePicker({
    types: [{ description: 'TTT state', accept: { 'application/json': ['.json'] } }],
    multiple: false
  });
  await loadState();
  render();
}

async function loadState () {
  try {
    const file = await fileHandle.getFile();
    state = JSON.parse(await file.text());
  } catch {
    state = newState(randomFirst());
    await saveState();
  }
}

async function saveState () {
  const wr = await fileHandle.createWritable();
  await wr.write(JSON.stringify(state));
  await wr.close();
}


/* ─────────  DOM helpers  ───────── */
function render () {
  cells.forEach((c, i) => {
    c.value              = state.board[i];
    c.style.background   = 'transparent';
  });

  if (state.winner) {
    highlightWin();
    if (!hasAlerted) {
      alert(`${state.winner} wins!`);
      hasAlerted = true;
    }
  } else if (state.board.every(v => v)) {
    if (!hasAlerted) {
      alert('Tie!');
      hasAlerted = true;
    }
  }
}

function highlightWin () {
  const triple = WINS.find(w => w.every(i => state.board[i] === state.winner));
  triple?.forEach(i => (cells[i].style.background = 'red'));
}

function randomFirst () {
  return Math.random() < 0.5 ? 'O' : 'X';
}


/* ─────────  Auto refresh on window focus  ───────── */
window.addEventListener('focus', async () => {
  if (fileHandle) {
    await loadState();
    render();
  }
});
