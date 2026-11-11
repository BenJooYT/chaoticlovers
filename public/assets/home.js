const STREAMS = [
  { who: 'ben', file: 'wall/ben.jsonl' },
  { who: 'hofi', file: 'wall/hofi.jsonl' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function startCounter() {
  const counter = document.querySelector('.counter');
  const out = document.querySelector('#days');
  if (!counter || !out) return;

  const start = new Date(`${counter.dataset.since}T00:00:00`);
  if (Number.isNaN(start.getTime())) return;

  const today = new Date();
  const startDay = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  // Counts the first day as day one.
  const days = Math.round((todayDay - startDay) / DAY_MS) + 1;
  out.textContent = days.toLocaleString();
}

function parseStream(who, text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line) => {
      try {
        const entry = JSON.parse(line);
        if (!entry.text) return null;
        return { who, date: entry.date || '', text: String(entry.text) };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function loadStream(stream) {
  try {
    const response = await fetch(stream.file, { cache: 'no-store' });
    if (!response.ok) return [];
    return parseStream(stream.who, await response.text());
  } catch {
    return [];
  }
}

function formatDate(date) {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function renderEntry(entry) {
  const item = document.createElement('li');
  item.className = `entry entry-${entry.who}`;

  const meta = document.createElement('p');
  meta.className = 'entry-meta';
  meta.textContent = [entry.who, formatDate(entry.date)].filter(Boolean).join(' · ');

  const text = document.createElement('p');
  text.className = 'entry-text';
  text.textContent = entry.text;

  item.append(meta, text);
  return item;
}

async function renderWall() {
  const wall = document.querySelector('#wall');
  if (!wall) return;

  const entries = (await Promise.all(STREAMS.map(loadStream))).flat();
  entries.sort((a, b) => a.date.localeCompare(b.date)).reverse();

  if (entries.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'entry entry-empty';
    empty.textContent = 'Nothing yet — the first line is yours.';
    wall.append(empty);
    return;
  }

  wall.append(...entries.map(renderEntry));
}

startCounter();
renderWall();
