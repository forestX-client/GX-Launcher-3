/* ============================================================
   GX-LAUNCHER 3.0 — ARCADE PAGE

   Renders the games in arcade-data.js, but only the ones backed by a file
   that actually exists (bundled in game/, or present in a publisher
   manifest). A tile you can click always launches something.
   ============================================================ */

(function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /* Find the real file for an arcade entry across every source. */
  function resolve(entry) {
    const cats = window.GX && window.GX.catalog;
    if (!cats) return null;

    // 1. a bundled copy under game/<folder>/index.html
    const kind = entry.file.includes('/');
    if (kind) {
      const folder = entry.file.split('/')[0];
      const hit = cats.all().find(b => b.file === entry.file ||
                                      (b.localFolders || []).includes(folder));
      if (hit) return hit;
    }

    // 2. an entry in the build index with the same filename
    const names = [entry.file].concat(entry.alternates || []);
    const all = cats.all();
    for (const name of names) {
      const hit = all.find(b => b.file === name);
      if (hit) return hit;
    }
    return null;
  }

  function draw() {
    const host = document.getElementById('arcade-groups');
    if (!host) return;

    const games = [];
    for (const entry of (window.GX_ARCADE || [])) {
      const build = resolve(entry);
      if (build) games.push({ entry, build });
    }

    if (!games.length) {
      host.innerHTML = '<div class="arcade-empty">No arcade games found in this deployment yet.<br>' +
        'The catalogue loads from the same mirrors as the Build Library.</div>';
      return;
    }

    const cards = games.map(({ entry, build }) => {
      const img = entry.art
        ? '<div class="game-icon"><img src="' + esc(entry.art) + '" alt="" loading="lazy"' +
          ' onerror="this.parentNode.textContent=\'' + esc(entry.name.charAt(0)) + '\'"></div>'
        : '<div class="game-icon">' + esc(entry.name.charAt(0)) + '</div>';

      const tags = (entry.tags || []).map(t => '<span class="gx-tag">' + esc(t) + '</span>').join('') +
        (build.mirrors.some(m => m.local) ? '<span class="gx-tag local">OFFLINE</span>' : '');

      return '<button class="game-card" data-game="' + esc(entry.id) + '" data-build="' + esc(build.id) + '">' +
        img +
        '<span class="game-meta">' +
          '<span class="game-name">' + esc(entry.name) + '</span>' +
          '<span class="game-blurb">' + esc(entry.blurb) + '</span>' +
          '<span class="game-tags">' + tags + '</span>' +
        '</span>' +
        '<span class="game-play"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></span>' +
      '</button>';
    }).join('');

    host.innerHTML =
      '<div class="arcade-group">' +
        '<div class="arcade-group-title">' + games.length + ' game' + (games.length === 1 ? '' : 's') + ' ready</div>' +
        '<div class="arcade-grid">' + cards + '</div>' +
      '</div>';

    host.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => play(card.dataset.build));
    });

    const meta = document.getElementById('status-line');
    if (meta) meta.textContent = games.length + ' GAMES READY';
  }

  /* Launch exactly like the Play page: cache-aware, mirror-resolving, and it
     writes the downloaded file to disk so it works offline next time. */
  async function play(buildId) {
    const build = window.GX.catalog.byId(buildId);
    if (!build) { window.showToast('That game is no longer available.', true); return; }

    if (typeof window.playGame !== 'function') {
      window.showToast('Launcher core is not loaded on this page.', true);
      return;
    }
    /* Hand the build straight to playGame: this page has no version picker,
       so nothing needs to be selected in the sidebar first. */
    await window.playGame(build);
  }
  window.arcadePlay = play;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', draw);
  else draw();
})();
