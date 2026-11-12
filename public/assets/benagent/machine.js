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

/* ---------- boot ---------- */

if (typedEl) {
  typeLine(LINES[0]);
}
readStats();
readHistory();
renderKept();
