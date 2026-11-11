const out = document.querySelector('#loc');
if (out) {
  fetch('../stats.json', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .then((stats) => {
      if (!stats || !Number.isFinite(stats.lines)) return;
      out.textContent = stats.lines.toLocaleString();
      if (Number.isFinite(stats.files)) {
        out.title = `${stats.files.toLocaleString()} files, counted at deploy`;
      }
    })
    .catch(() => {});
}
