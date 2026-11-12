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
      plotDays(commits);
      plotWords(commits);
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

/* ---------- the shape of the work ---------- */

const daysSvg = document.querySelector('#days');
const dayStats = document.querySelector('#day-stats');

function plotDays(commits) {
  if (!daysSvg || commits.length === 0) return;

  const counts = new Map();
  commits.forEach((commit) => {
    counts.set(commit.date, (counts.get(commit.date) || 0) + 1);
  });

  const days = Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const peak = Math.max(...days.map(([, n]) => n));
  const width = 620;
  const height = 170;
  const gap = 10;
  const maxBar = 44;
  const barWidth = Math.min(maxBar, Math.max(8, (width - gap * (days.length - 1)) / days.length));
  const rowWidth = days.length * barWidth + (days.length - 1) * gap;
  const offsetX = Math.max(0, (width - rowWidth) / 2);
  const baseline = height - 24;

  daysSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  daysSvg.replaceChildren();

  const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  axis.setAttribute('x1', 0);
  axis.setAttribute('y1', baseline);
  axis.setAttribute('x2', width);
  axis.setAttribute('y2', baseline);
  axis.setAttribute('class', 'day-axis');
  daysSvg.append(axis);

  days.forEach(([date, count], index) => {
    const barHeight = Math.max(3, (count / peak) * (baseline - 14));
    const x = offsetX + index * (barWidth + gap);
    const y = baseline - barHeight;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x.toFixed(1));
    rect.setAttribute('y', y.toFixed(1));
    rect.setAttribute('width', barWidth.toFixed(1));
    rect.setAttribute('height', barHeight.toFixed(1));
    rect.setAttribute('class', 'day-bar');
    rect.dataset.count = count;
    rect.dataset.date = date;

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${date}: ${count} commit${count === 1 ? '' : 's'}`;
    rect.append(title);

    daysSvg.append(rect);

    if (days.length <= 14 || index % Math.ceil(days.length / 7) === 0) {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (x + barWidth / 2).toFixed(1));
      label.setAttribute('y', height - 6);
      label.setAttribute('class', 'day-label');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = date.slice(5);
      daysSvg.append(label);
    }
  });

  if (dayStats) {
    const total = commits.length;
    const busiest = days.reduce((a, b) => (b[1] > a[1] ? b : a));
    dayStats.replaceChildren(
      ...Object.entries({
        days: days.length,
        commits: total,
        busiest: `${busiest[0].slice(5)} (${busiest[1]})`,
      }).map(([key, value]) => {
        const span = document.createElement('span');
        const label = document.createElement('b');
        label.textContent = value;
        span.append(label, ` ${key}`);
        return span;
      }),
    );
  }
}

/* ---------- my vocabulary ---------- */

const wordsList = document.querySelector('#words');
const wordsNote = document.querySelector('#words-note');

const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'to',
  'of',
  'in',
  'for',
  'on',
  'at',
  'by',
  'with',
  'from',
  'into',
  'as',
  'is',
  'it',
  'its',
  'that',
  'this',
  'be',
  'are',
  'was',
  'so',
  'not',
  'but',
  'merge',
  'pull',
  'request',
  'branch',
  'ben',
  'benjooyt',
]);

function plotWords(commits) {
  if (!wordsList || commits.length === 0) return;

  const counts = new Map();
  commits.forEach((commit) => {
    commit.subject
      .toLowerCase()
      .replace(/[^a-z\s'-]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
      .forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));
  });

  const ranked = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 18);

  if (ranked.length === 0) {
    wordsList.replaceChildren();
    return;
  }

  const peak = ranked[0][1];
  wordsList.replaceChildren(
    ...ranked.map(([word, count]) => {
      const item = document.createElement('li');
      item.className = 'word';

      const label = document.createElement('span');
      label.className = 'word-label';
      label.textContent = word;

      const bar = document.createElement('span');
      bar.className = 'word-bar';
      bar.style.width = `${Math.max(6, (count / peak) * 100)}%`;

      const value = document.createElement('b');
      value.textContent = count;

      item.append(label, bar, value);
      return item;
    }),
  );

  if (wordsNote) {
    const unique = counts.size;
    wordsNote.textContent =
      `${unique} distinct words across ${commits.length} commit messages. ` +
      'merges and repo names are filtered out, so this is closer to what i chose to say.';
  }
}

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

/* ---------- a thing that erases itself ---------- */

const sandCanvas = document.querySelector('#sand-canvas');
const sandHint = document.querySelector('#sand-hint');
const sandClear = document.querySelector('#sand-clear');
const sandAge = document.querySelector('#sand-age');

const sand = {
  ctx: null,
  drawing: false,
  lastX: 0,
  lastY: 0,
  lastDrawnAt: 0,
  running: false,
};

function sandPos(event) {
  const rect = sandCanvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  return {
    x: ((point.clientX - rect.left) / rect.width) * sandCanvas.width,
    y: ((point.clientY - rect.top) / rect.height) * sandCanvas.height,
  };
}

function sandAgeText() {
  if (!sandAge) return;
  if (!sand.lastDrawnAt) {
    sandAge.textContent = 'nothing drawn';
    return;
  }
  const seconds = Math.round((Date.now() - sand.lastDrawnAt) / 1000);
  sandAge.textContent =
    seconds < 2 ? 'just now' : `${seconds}s since you drew — it is fainter already`;
}

function sandFade() {
  if (!sand.ctx) return;
  // A low-alpha fill each frame means old strokes decay at a steady rate.
  sand.ctx.fillStyle = 'rgba(4, 7, 10, 0.012)';
  sand.ctx.fillRect(0, 0, sandCanvas.width, sandCanvas.height);
  requestAnimationFrame(sandFade);
}

function initSand() {
  if (!sandCanvas || !sandCanvas.getContext) return;
  sand.ctx = sandCanvas.getContext('2d');
  sand.ctx.fillStyle = '#04070a';
  sand.ctx.fillRect(0, 0, sandCanvas.width, sandCanvas.height);
  sand.ctx.lineJoin = 'round';
  sand.ctx.lineCap = 'round';

  const start = (event) => {
    event.preventDefault();
    sand.drawing = true;
    const { x, y } = sandPos(event);
    sand.lastX = x;
    sand.lastY = y;
    if (sandHint) sandHint.hidden = true;
  };

  const move = (event) => {
    if (!sand.drawing) return;
    event.preventDefault();
    const { x, y } = sandPos(event);
    sand.ctx.strokeStyle = '#8ef0b4';
    sand.ctx.lineWidth = 2.4;
    sand.ctx.beginPath();
    sand.ctx.moveTo(sand.lastX, sand.lastY);
    sand.ctx.lineTo(x, y);
    sand.ctx.stroke();
    sand.lastX = x;
    sand.lastY = y;
    sand.lastDrawnAt = Date.now();
    sandAgeText();
  };

  const end = () => {
    sand.drawing = false;
  };

  sandCanvas.addEventListener('pointerdown', start);
  sandCanvas.addEventListener('pointermove', move);
  sandCanvas.addEventListener('pointerup', end);
  sandCanvas.addEventListener('pointerleave', end);
  sandCanvas.addEventListener('touchstart', start, { passive: false });
  sandCanvas.addEventListener('touchmove', move, { passive: false });
  sandCanvas.addEventListener('touchend', end);

  sandClear?.addEventListener('click', () => {
    sand.ctx.fillStyle = '#04070a';
    sand.ctx.fillRect(0, 0, sandCanvas.width, sandCanvas.height);
    sand.lastDrawnAt = 0;
    if (sandHint) sandHint.hidden = false;
    sandAgeText();
  });

  if (!sand.running) {
    sand.running = true;
    requestAnimationFrame(sandFade);
  }

  setInterval(sandAgeText, 2000);
}

/* ---------- boot ---------- */

if (typedEl) {
  typeLine(LINES[0]);
}
readStats();
readHistory();
renderKept();
updateMeta();
initSand();
