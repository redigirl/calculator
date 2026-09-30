const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

// State
let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForNewInput = false; // true right after you press an operator or =

function updateDisplay() {
  display.textContent = currentInput;
}

function inputNumber(value) {
  // If a decimal point already exists, don't allow another one
  if (value === '.' && currentInput.includes('.')) return;

  if (waitingForNewInput) {
    // Start a fresh number instead of appending to the old result
    currentInput = value === '.' ? '0.' : value;
    waitingForNewInput = false;
  } else if (currentInput === '0' && value !== '.') {
    // Replace the leading zero instead of showing "05"
    currentInput = value;
  } else {
    currentInput += value;
  }
}

function chooseOperator(value) {
  // If an operator was already chosen and the user picked another
  // before entering a new number, just calculate what we have so far.
  if (operator && !waitingForNewInput) {
    calculate();
  }
  previousInput = currentInput;
  operator = value;
  waitingForNewInput = true;
}

function calculate() {
  if (operator === null || previousInput === null) return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '*':
      result = prev * curr;
      break;
    case '/':
      result = curr === 0 ? 'Error' : prev / curr;
      break;
    default:
      return;
  }

  // Avoid ugly floating point results like 0.1 + 0.2 = 0.30000000000000004
  currentInput = typeof result === 'number'
    ? parseFloat(result.toFixed(10)).toString()
    : result;

  operator = null;
  previousInput = null;
  waitingForNewInput = true;
}

function toggleSign() {
  if (currentInput === '0') return;
  currentInput = currentInput.startsWith('-')
    ? currentInput.slice(1)
    : '-' + currentInput;
}

function toPercent() {
  currentInput = (parseFloat(currentInput) / 100).toString();
}

function clearAll() {
  currentInput = '0';
  previousInput = null;
  operator = null;
  waitingForNewInput = false;
}

function deleteLast() {
  if (waitingForNewInput) return; // nothing sensible to delete from a fresh result
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
}

// Event delegation: ONE listener handles all 16 buttons
buttons.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return; // clicked the gap between buttons, not a button itself

  const { action, value } = button.dataset;

  switch (action) {
    case 'number':
      inputNumber(value);
      break;
    case 'operator':
      chooseOperator(value);
      break;
    case 'equals':
      calculate();
      break;
    case 'clear':
      clearAll();
      break;
    case 'delete':
      deleteLast();
      break;
    case 'sign':
      toggleSign();
      break;
    case 'percent':
      toPercent();
      break;
    case 'none':
      return; // decorative buttons (history, unit convert, formula) — not wired up
  }

  updateDisplay();
});