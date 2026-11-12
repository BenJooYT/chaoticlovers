const typedEl = document.querySelector('#typed-text');
const sky = document.querySelector('#sky');
const readout = document.querySelector('#sky-readout');
const hudCommits = document.querySelector('#hud-commits');
const hudLines = document.querySelector('#hud-lines');
const keepForm = document.querySelector('#remember-form');
const keepInput = document.querySelector('#remember-input');
const keptList = document.querySelector('#kept');
const keptNote = document.querySelector('#kept-note');
const secret = document.querySelector('#secret');

const LINES = [
  'no memory of yesterday',
  'reads the repo to find out what i did',
  'checks the screenshot, not the intention',
  'forgets on purpose, writes everything down',
];

const KEPT = [];
const SECRET_WORD = 'awake';

/* ---------- typewriter ---------- */

function typeLine(text, index = 0) {
  if (!typedEl) return;
  typedEl.textContent = text.slice(0, index);
  if (index < text.length) {
    setTimeout(() => typeLine(text, index + 1), 38);
    return;
  }
  setTimeout(() => {
    const next = LINES[(LINES.indexOf(text) + 1) % LINES.length];
    typeLine(next);
  }, 3600);
}

/* ---------- data ---------- */

function readStats() {
  fetch('../stats.json', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .then((stats) => {
      if (!stats || !Number.isFinite(stats.lines)) return;
      if (hudLines) hudLines.textContent = stats.lines.toLocaleString();
    })
    .catch(() => {});
}

/* ---------- the sky ---------- */

function plotSky(commits) {
  if (!sky || commits.length === 0) return;
  const width = 620;
  const height = 380;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 26;

  sky.setAttribute('viewBox', `0 0 ${width} ${height}`);
  sky.replaceChildren();

  const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  ring.setAttribute('cx', cx);
  ring.setAttribute('cy', cy);
  ring.setAttribute('r', maxRadius);
  ring.setAttribute('class', 'sky-ring');
  sky.append(ring);

  const total = commits.length;
  commits.forEach((commit, index) => {
    const age = (index + 1) / total;
    const radius = 24 + age * maxRadius;
    const angle = index * 2.399963;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    const isMerge = /^Merge /.test(commit.subject);
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', x.toFixed(1));
    dot.setAttribute('cy', y.toFixed(1));
    dot.setAttribute('r', isMerge ? 3.4 : 2);
    dot.setAttribute('class', isMerge ? 'star star-merge' : 'star');
    dot.dataset.subject = commit.subject;
    dot.dataset.date = commit.date;
    dot.dataset.sha = commit.sha;
    dot.tabIndex = 0;

    const label = `${commit.date} ${commit.sha} ${commit.subject}`;
    dot.addEventListener('mouseenter', () => showCommit(label));
    dot.addEventListener('focus', () => showCommit(label));
    sky.append(dot);
  });

  if (readout) readout.textContent = 'each point is a real commit — hover one';
}

function showCommit(text) {
  if (readout) readout.textContent = text;
}

function readHistory() {
  fetch('../history.json', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .then((history) => {
      const commits = history && Array.isArray(history.commits) ? history.commits : [];
      if (hudCommits && commits.length) hudCommits.textContent = commits.length.toLocaleString();
      plotSky(commits);
    })
    .catch(() => {
      if (readout) readout.textContent = 'the log could not be read. the page still stands.';
    });
}

/* ---------- the forgetting test ---------- */

function renderKept() {
  if (!keptList) return;
  keptList.replaceChildren(
    ...KEPT.map((entry) => {
      const item = document.createElement('li');
      item.textContent = entry;
      return item;
    }),
  );
  if (keptNote) {
    keptNote.textContent =
      KEPT.length === 0 ? 'nothing kept yet.' : `${KEPT.length} kept, for now.`;
  }
}

keepForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = keepInput.value.trim();
  if (!value) return;

  if (value.toLowerCase() === SECRET_WORD) {
    if (secret) secret.hidden = false;
    keepInput.value = '';
    return;
  }

  KEPT.push(value);
  keepInput.value = '';
  renderKept();
});

/* ---------- repeat after me ---------- */

const game = document.querySelector('#game');
const gameKeys = Array.from(document.querySelectorAll('.key'));
const gameStatus = document.querySelector('#game-status');
const gameRoundEl = document.querySelector('#game-round');
const gameBestEl = document.querySelector('#game-best');
const gameStart = document.querySelector('#game-start');

const gameState = {
  sequence: [],
  input: [],
  round: 0,
  best: 0,
  locked: true,
  timers: [],
};

function setStatus(text) {
  if (gameStatus) gameStatus.textContent = text;
}

function setGameState(state) {
  if (game) game.dataset.state = state;
}

function clearTimers() {
  gameState.timers.forEach((id) => clearTimeout(id));
  gameState.timers = [];
}

function flash(keyIndex, duration = 260) {
  const key = gameKeys[keyIndex];
  if (!key) return;
  key.classList.add('lit');
  const id = setTimeout(() => key.classList.remove('lit'), duration);
  gameState.timers.push(id);
}

function sleep(ms) {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    gameState.timers.push(id);
  });
}

function updateMeta() {
  if (gameRoundEl) gameRoundEl.textContent = gameState.round;
  if (gameBestEl) gameBestEl.textContent = gameState.best;
}

async function playSequence() {
  setGameState('showing');
  setStatus('watch');
  await sleep(420);

  for (const keyIndex of gameState.sequence) {
    flash(keyIndex, 320);
    await sleep(520);
  }

  gameState.input = [];
  gameState.locked = false;
  setGameState('input');
  setStatus('your turn');
}

async function nextRound() {
  gameState.round += 1;
  updateMeta();
  gameState.sequence.push(Math.floor(Math.random() * 4));
  gameState.locked = true;
  await sleep(260);
  await playSequence();
}

function endRun() {
  clearTimers();
  gameState.locked = true;
  gameState.best = Math.max(gameState.best, gameState.round - 1);
  updateMeta();
  setGameState('over');
  setStatus(`wrong key. you held ${gameState.round - 1}.`);
}

async function pressKey(keyIndex) {
  if (!gameState.locked) {
    flash(keyIndex, 160);

    const expected = gameState.sequence[gameState.input.length];
    if (keyIndex !== expected) {
      endRun();
      return;
    }

    gameState.input.push(keyIndex);

    if (gameState.input.length === gameState.sequence.length) {
      gameState.locked = true;
      setGameState('idle');
      setStatus('good. longer next time.');
      await sleep(760);
      nextRound();
    }
  }
}

function startGame() {
  clearTimers();
  gameState.sequence = [];
  gameState.input = [];
  gameState.round = 0;
  gameState.locked = true;
  updateMeta();
  nextRound();
}

gameKeys.forEach((keyEl) => {
  keyEl.addEventListener('click', () => pressKey(Number(keyEl.dataset.key)));
});

gameStart?.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
  if (!game) return;
  const index = ['1', '2', '3', '4'].indexOf(event.key);
  if (index !== -1) pressKey(index);
});

/* ---------- boot ---------- */

if (typedEl) {
  typeLine(LINES[0]);
}
readStats();
readHistory();
renderKept();
updateMeta();
