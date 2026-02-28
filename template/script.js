/**
 * reverseString.js
 * Reverse String App — core logic & UI interactions
 */

// ─── Utilities ────────────────────────────────────────────────
/**
 * Reverses a given string character by character.
 * @param {string} str
 * @returns {string}
 */
function reverseString(str) {
  return str.split('').reverse().join('');
}

/**
 * Counts words in a string (splits on whitespace).
 * @param {string} str
 * @returns {number}
 */
function countWords(str) {
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
}

/**
 * Counts unique characters (excluding spaces).
 * @param {string} str
 * @returns {number}
 */
function countUnique(str) {
  return new Set(str.replace(/\s/g, '')).size;
}

// ─── DOM References ────────────────────────────────────────────
const inputText    = document.getElementById('inputText');
const resultText   = document.getElementById('resultText');
const resultBox    = document.getElementById('resultBox');
const placeholder  = document.getElementById('resultPlaceholder');
const charCount    = document.getElementById('charCount');
const copyBtn      = document.getElementById('copyBtn');
const clearBtn     = document.getElementById('clearBtn');
const statChars    = document.getElementById('statChars');
const statWords    = document.getElementById('statWords');
const statUnique   = document.getElementById('statUnique');
const statsBar     = document.getElementById('statsBar');

// ─── State ────────────────────────────────────────────────────
let currentReversed = '';

// ─── Core: Handle Input ───────────────────────────────────────
function handleInput() {
  const raw     = inputText.value;
  const len     = raw.length;
  const reversed = reverseString(raw);

  currentReversed = reversed;

  // Update char counter
  charCount.textContent = `${len} character${len !== 1 ? 's' : ''}`;
  charCount.classList.toggle('has-text', len > 0);

  if (len === 0) {
    // Empty state
    resultText.textContent = '';
    resultText.style.display = 'none';
    placeholder.style.display = '';
    resultBox.classList.remove('has-result');
    copyBtn.disabled  = true;
    clearBtn.disabled = true;
    statsBar.style.display = 'none';
  } else {
    // Active state
    resultText.style.display = '';
    placeholder.style.display = 'none';
    resultBox.classList.add('has-result');
    copyBtn.disabled  = false;
    clearBtn.disabled = false;
    statsBar.style.display = '';

    // Flash animation on each keystroke
    resultText.classList.remove('flash');
    void resultText.offsetWidth; // reflow to retrigger
    resultText.classList.add('flash');
    resultText.textContent = reversed;

    // Update stats
    statChars.innerHTML  = `<strong>${len}</strong> chars`;
    statWords.innerHTML  = `<strong>${countWords(raw)}</strong> words`;
    statUnique.innerHTML = `<strong>${countUnique(raw)}</strong> unique`;
  }
}

// ─── Copy to Clipboard ────────────────────────────────────────
async function copyResult() {
  if (!currentReversed) return;

  try {
    await navigator.clipboard.writeText(currentReversed);
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = currentReversed;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  // Visual feedback
  const icon  = copyBtn.querySelector('.btn-icon');
  const label = copyBtn.querySelector('.btn-label');
  copyBtn.classList.add('copied');
  icon.textContent  = '✓';
  label.textContent = 'Copied!';

  setTimeout(() => {
    copyBtn.classList.remove('copied');
    icon.textContent  = '⎘';
    label.textContent = 'Copy';
  }, 2000);
}

// ─── Clear ────────────────────────────────────────────────────
function clearAll() {
  inputText.value = '';
  inputText.focus();
  handleInput();
}

// ─── Event Listeners ──────────────────────────────────────────
inputText.addEventListener('input', handleInput);
copyBtn.addEventListener('click', copyResult);
clearBtn.addEventListener('click', clearAll);

// Keyboard shortcut: Ctrl/Cmd + Shift + C → copy
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
    e.preventDefault();
    copyResult();
  }
});

// ─── Init ─────────────────────────────────────────────────────
// Set initial disabled states
copyBtn.disabled  = true;
clearBtn.disabled = true;
statsBar.style.display = 'none';