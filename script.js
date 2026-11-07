/* ============================================================
   GX-LAUNCHER 2.4 SCRIPT
   ============================================================ */

// ===== STORAGE HELPERS =====
const _memStore = {};
function _lsGet(name) {
    try { return localStorage.getItem(name); } catch(e) { return _memStore[name] ?? null; }
}
function _lsSet(name, value) {
    try { localStorage.setItem(name, value); } catch(e) { _memStore[name] = value; }
}
function getCookie(name)            { return _lsGet(name); }
function setCookie(name, value, _d) { _lsSet(name, String(value)); }

// ===== TOAST =====
let _toastTimer;
function showToast(msg, isError, ms) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast' + (isError ? ' error' : '') + ' show';
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => t.classList.remove('show'), ms || 3000);
}

// ===== STATUS LINE =====
function setStatus(html) {
    const el = document.getElementById('status-line');
    if (el) el.innerHTML = html;
}

// ===== LOADING OVERLAY =====
function showLoading(msg) {
    const ov = document.getElementById('loading-overlay');
    const tx = document.getElementById('loading-text');
    if (ov) ov.classList.add('active');
    if (tx) tx.textContent = msg || 'LOADING...';
    setLoadingBar(0);
}
function hideLoading() {
    const ov = document.getElementById('loading-overlay');
    if (ov) ov.classList.remove('active');
}
function setLoadingBar(pct) {
    const bar = document.getElementById('loading-bar');
    if (bar) bar.style.width = pct + '%';
}

// ===== THEME SYSTEM =====
const GX_THEMES = {
    'default':  { '--accent':'#cc0000','--accent-hi':'#ff2222','--accent-dim':'#7a0000','--accent-glow':'rgba(200,0,0,0.22)','--border':'#2a2a2a','--border2':'#8a0000','--bg':'#070707','--bg2':'#0b0b0b','--bg3':'#101010','--panel':'#0d0d0d' },
    'green':    { '--accent':'#00cc44','--accent-hi':'#00ff55','--accent-dim':'#006622','--accent-glow':'rgba(0,180,60,0.18)','--border':'#2a2a2a','--border2':'#00802b','--bg':'#070707','--bg2':'#0b0b0b','--bg3':'#101010','--panel':'#0d0d0d' },
    'blood':    { '--accent':'#cc0000','--accent-hi':'#ff4444','--accent-dim':'#800000','--accent-glow':'rgba(200,0,0,0.22)','--border2':'#4a0000','--bg':'#080000','--bg2':'#0d0000','--bg3':'#120000','--panel':'#0f0000' },
    'midnight': { '--accent':'#5566ff','--accent-hi':'#7788ff','--accent-dim':'#2233bb','--accent-glow':'rgba(80,100,255,0.18)','--border2':'#1a2050','--bg':'#070710','--bg2':'#0c0c1a','--bg3':'#111125','--panel':'#0e0e1e' },
    'ash':      { '--accent':'#999999','--accent-hi':'#cccccc','--accent-dim':'#555555','--accent-glow':'rgba(150,150,150,0.15)','--border2':'#404040' },
    'amber':    { '--accent':'#cc7700','--accent-hi':'#ffaa00','--accent-dim':'#7a4400','--accent-glow':'rgba(200,120,0,0.18)','--border2':'#3a2200','--bg':'#090600','--bg2':'#100d00','--bg3':'#181200','--panel':'#130f00' },
    'blue':       { '--accent':'#3d8bff','--accent-hi':'#6aa8ff','--accent-dim':'#1c4a99','--accent-glow':'rgba(60,130,255,0.18)','--border':'#2a2a2a','--border2':'#2563c4','--bg':'#070707','--bg2':'#0b0b0b','--bg3':'#101010','--panel':'#0d0d0d' },
    'amber-grey': { '--accent':'#e07b00','--accent-hi':'#ffa326','--accent-dim':'#8a4a00','--accent-glow':'rgba(224,123,0,0.18)','--border':'#2a2a2a','--border2':'#a85a00','--bg':'#070707','--bg2':'#0b0b0b','--bg3':'#101010','--panel':'#0d0d0d' },
    'matrix':     { '--accent':'#00cc44','--accent-hi':'#00ff55','--accent-dim':'#006622','--accent-glow':'rgba(0,180,60,0.15)','--bg':'#010a04','--bg2':'#04110a','--bg3':'#07180e','--panel':'#05130a','--border':'#12331f','--border2':'#003318','--text':'#9fd9b0','--text-dim':'#2f6b44','--text-bright':'#d6ffe3' },
    'light':      { '--accent':'#cc0000','--accent-hi':'#e01010','--accent-dim':'#e8a0a0','--accent-glow':'rgba(200,0,0,0.12)','--bg':'#f1f1f1','--bg2':'#e7e7e7','--bg3':'#dddddd','--panel':'#fafafa','--border':'#cfcfcf','--border2':'#b5b5b5','--scroll':'#b5b5b5','--line2':'#b5b5b5','--text':'#333333','--text-dim':'#7a7a7a','--text-bright':'#111111','--hover':'rgba(0,0,0,0.05)' },
};
const GX_DEFAULTS = {
    '--accent':'#cc0000','--accent-hi':'#ff2222','--accent-dim':'#7a0000',
    '--accent-glow':'rgba(180,0,0,0.18)','--bg':'#0a0a0a','--bg2':'#111111',
    '--bg3':'#181818','--panel':'#141414','--border2':'#404040',
    '--border':'#2a2a2a','--scroll':'#404040','--line2':'#404040','--text':'#cccccc','--text-dim':'#555555','--text-bright':'#eeeeee','--hover':'rgba(255,255,255,0.035)'
};

function applyTheme(name) {
    const root = document.documentElement;
    for (const [k, v] of Object.entries(GX_DEFAULTS)) root.style.setProperty(k, v);
    const t = GX_THEMES[name] || {};
    for (const [k, v] of Object.entries(t)) root.style.setProperty(k, v);
    setCookie('launcherTheme', name, 365);
    document.querySelectorAll('.theme-swatch').forEach(s => {
        s.classList.toggle('selected', s.dataset.themeName === name);
    });
}

function updateNavVisibility() {}
function toggleModMaker() {}

// ===== VERSION SELECTOR =====
let _selectedVersion = '';
let _selectedBuild = null;   // catalog entry for the current selection

function toggleVersionDropdown() {
    const dd  = document.getElementById('version-dropdown');
    const sel = document.getElementById('version-select');
    if (!dd) return;
    const isOpen = dd.classList.toggle('open');
    sel.classList.toggle('open', isOpen);
    if (isOpen && window.GX && window.GX.catalog) window.GX.catalog.renderDropdown('');
    const search = document.getElementById('version-search');
    if (search) {
        if (isOpen) {
            search.value = '';
            filterVersionDropdown(search);
            setTimeout(() => search.focus(), 0);
        }
    }
}

function filterVersionDropdown(input) {
    if (window.GX && window.GX.catalog) {
        window.GX.catalog.renderDropdown(input ? input.value : '');
        return;
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const dd = document.getElementById('version-dropdown');
        const sel = document.getElementById('version-select');
        if (dd && dd.classList.contains('open')) {
            dd.classList.remove('open');
            sel.classList.remove('open');
        }
    }
});

// ===== ENVIRONMENT DETECTION =====
// Cloudflare Workers deployments are served from *.workers.dev. On Cloudflare,
// 'regular' and 'popup' launch modes don't work reliably, so the badge and the
// actual launch logic both force 'blob' there. Everything else (GitHub Pages,
// custom domains, local file) behaves normally using the saved setting.
function isRunningOnCloudflare() {
    return location.hostname.endsWith('.workers.dev')
        || location.hostname.endsWith('.bitbucket.io');
}

function getEffectiveLaunchMethod() {
    if (isRunningOnCloudflare()) return 'blob';
    return getCookie('launchMethod') || 'regular';
}

function selectVersion(path, label, isWasm, silent) {
    window._customActive = false;
    _selectedVersion = path;
    _selectedBuild = (window.GX && window.GX.catalog) ? window.GX.catalog.byId(path) : null;
    const shown = label || path;
    const lbl = document.getElementById('version-label');
    if (lbl) lbl.textContent = shown;
    document.getElementById('version-dropdown')?.classList.remove('open');
    document.getElementById('version-select')?.classList.remove('open');
    const btn = document.getElementById('play-btn');
    if (btn) btn.disabled = false;
    document.querySelectorAll('.version-option').forEach(o => {
        o.classList.toggle('active-ver', o.dataset.id === path);
    });
    if (!silent) {
        try { _lsSet(_getPageVerKey(), JSON.stringify({ path, label: shown, isWasm: !!isWasm })); } catch (e) {}
        try { _lsSet('gxLastBuild', path); } catch (e) {}
    }
    const method = getEffectiveLaunchMethod();
    const modeLabels = { regular:'REGULAR', 'about-blank':'ABOUT:BLANK', 'data-uri':'DATA URI', blob:'BLOB URL', popup:'POPUP' };
    const badge = document.getElementById('mode-badge-text');
    if (badge) badge.textContent = modeLabels[method] || method.toUpperCase();
    setStatus('BUILD: <span class="hl">' + shown + '</span>');
    const picked = document.getElementById('play-picked');
    if (picked) {
        if (_selectedBuild) {
            picked.textContent = shown + '  ·  ' + _selectedBuild.epoch +
                '  ·  ' + (_selectedBuild.tech === 'wasm' ? 'WASM' : 'JS') +
                '  ·  ' + _selectedBuild.mirrors.length + ' mirror' +
                (_selectedBuild.mirrors.length === 1 ? '' : 's');
        } else {
            picked.textContent = shown;
        }
    }
}

// Called by every build row in the picker.
function pickBuild(build) {
    if (!build) return;
    selectVersion(build.id, build.label || build.name, build.tech === 'wasm');
}
window.GX = window.GX || {};
window.GX.pickBuild = pickBuild;

document.addEventListener('click', e => {
    if (!e.target.closest('.version-wrapper')) {
        document.getElementById('version-dropdown')?.classList.remove('open');
        document.getElementById('version-select')?.classList.remove('open');
    }
});

// ===== WISP INJECTION =====

// Checks if WISP injection is enabled in settings
function isWispEnabled() {
    return getCookie('wispEnabled') === 'true';
}

// Returns the configured WISP URL, or the default
function getWispUrl() {
    return getCookie('wispUrl') || 'wss://anura.pro/';
}

// Injects the wispcraft bundle script into a raw HTML string
// Returns the modified HTML string
async function injectWispIntoHtml(html) {
    // Lazy-load the bundle from wisp-bundle.js if not already loaded
    if (typeof getWispBundle !== 'function') {
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'wisp-bundle.js';
            s.onload = resolve;
            s.onerror = () => reject(new Error('Failed to load wisp-bundle.js'));
            document.head.appendChild(s);
        });
    }

    const b64 = getWispBundle();
    const wispUrl = getWispUrl();

    // Build the injected script:
    // 1. Sets wispcraft_wispurl in localStorage so wispcraft uses our configured server
    // 2. Decodes and executes the wispcraft bundle
    const injectedScript = `<script>
(function(){
  try { localStorage.setItem('wispcraft_wispurl', ${JSON.stringify(wispUrl)}); } catch(e){}
  var s=document.createElement('script');
  s.textContent=atob(${JSON.stringify(b64)});
  document.currentScript.parentNode.insertBefore(s,document.currentScript);
})();
<\/script>`;

    // Prepend into <head> if present, else prepend to <html>, else prepend to document
    if (/<head[\s>]/i.test(html)) {
        return html.replace(/(<head[^>]*>)/i, '$1\n' + injectedScript);
    } else if (/<html[\s>]/i.test(html)) {
        return html.replace(/(<html[^>]*>)/i, '$1\n<head>' + injectedScript + '</head>');
    } else {
        return injectedScript + html;
    }
}

// ===== SERVER INJECTION =====
const GX_SERVERS = [
    { name: "mc.arch.lol",                    addr: "mc.arch.lol" },
    { name: "Zentic",                          addr: "wss://zentic.cc" },
    { name: "Zyth",                            addr: "wss://mc.zyth.me" },
    { name: "AsianF4rmer",                     addr: "wss://asianf4rmer.minecraft.pe" },
    { name: "shhnowisnottheti.me",             addr: "wss://sus.shhnowisnottheti.me" },
    { name: "Aeon Network",                    addr: "wss://aeon-network.net/1.8" },
    { name: "Adderall",                        addr: "wss://adderall.ir" },
    { name: "Lamp Lifesteal",                  addr: "wss://mc.lamplifesteal.xyz" },
    { name: "VanillaMC",                       addr: "wss://vanillamc.org" },
    { name: "Voidsent",                        addr: "wss://mc.voidsent.net" },
    { name: "Dumbshit Survival X",             addr: "wss://mc.dssx.uk" },
    { name: "Mytheria MC",                     addr: "wss://play.mytheriamc.net" },
    { name: "CMC",                             addr: "wss://cmc.tf" },
];

function injectServersIntoHtml(html) {
    const injection = `<script>
(function(){
  var toAdd = ${JSON.stringify(GX_SERVERS)};
  function doInject() {
    var existing = (window.eaglercraftXOpts && window.eaglercraftXOpts.servers) || [];
    var existingAddrs = existing.map(function(s){ return s.addr; });
    toAdd.forEach(function(s){
      if (existingAddrs.indexOf(s.addr) === -1) existing.push(s);
    });
    if (window.eaglercraftXOpts) window.eaglercraftXOpts.servers = existing;
  }
  if (window.eaglercraftXOpts) {
    doInject();
  } else {
    var poll = setInterval(function(){
      if (window.eaglercraftXOpts) { clearInterval(poll); doInject(); }
    }, 50);
  }
})();
<\/script>`;

    if (/<head[\s>]/i.test(html)) {
        return html.replace(/(<head[^>]*>)/i, '$1\n' + injection);
    } else if (/<html[\s>]/i.test(html)) {
        return html.replace(/(<html[^>]*>)/i, '$1\n<head>' + injection + '</head>');
    } else {
        return injection + html;
    }
}

// ===== MOD COMPATIBILITY WARNING =====
// Mods (EF_MODS, installed from mods.html) only load in these two builds.
const MOD_COMPATIBLE_VERSIONS = ['efi-1.12.2', 'efi-1.8.8'];

// Number of currently enabled mods in the EF_MODS store. 0 on any failure.
async function countEnabledMods() {
    try {
        const db = await new Promise((res, rej) => {
            const r = indexedDB.open('EF_MODS');
            r.onsuccess = () => res(r.result);
            r.onerror = () => rej(r.error);
        });
        try {
            if (!db.objectStoreNames.contains('filesystem')) return 0;
            const blob = await new Promise((res, rej) => {
                const r = db.transaction(['filesystem'], 'readonly').objectStore('filesystem').get('mods.txt');
                r.onsuccess = () => res(r.result);
                r.onerror = () => rej(r.error);
            });
            if (!blob) return 0;
            return (await blob.text()).split('|').filter(Boolean).length;
        } finally { db.close(); }
    } catch (e) { return 0; }
}

async function warnIfModsWontWork() {
    if (MOD_COMPATIBLE_VERSIONS.includes(String(_selectedVersion).toLowerCase())) return;
    const n = await countEnabledMods();
    if (!n) return;
    const lbl = document.getElementById('version-label');
    const name = (lbl && lbl.textContent.trim()) || _selectedVersion;
    showToast('Warning: your ' + n + ' installed mod' + (n === 1 ? '' : 's') + " won't work on " + name + '. Mods only work on EFI 1.12.2 and EFI 1.8.8.', true, 8000);
}

// ===== LAUNCH LOGIC =====
/* ============================================================
   MIRROR RESOLUTION
   Each build exists on two or three of the mirrors. We verify every
   candidate with a ranged GET (first 4 KB) — headers can lie, a ranged
   body cannot — and keep the first mirror that returns real HTML.
   ============================================================ */
function gxMirrorTimeout() {
    return (typeof gxSettings === 'function' && gxSettings().mirrorTimeout) || 20000;
}

function probeMirror(url, signal) {
    /* No custom headers: a Range header would trigger a CORS preflight, and
       GitHub Pages / raw.githubusercontent do not answer OPTIONS. A plain
       GET is a "simple request", so the response is readable without one.
       We read the first chunk and then cancel the body — enough to prove the
       file exists and is really an HTML build, without downloading 40 MB. */
    return fetch(url, { method: 'GET', signal, cache: 'no-store', credentials: 'omit' })
        .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const type = ((res.headers && res.headers.get('content-type')) || '').toLowerCase();
            if (type && !/text\/html|text\/plain|application\/octet-stream/.test(type)) {
                throw new Error('wrong content-type: ' + type);
            }
            if (!res.body || typeof res.body.getReader !== 'function') {
                return res.text().then(t => sniffHtml(t, url));
            }
            const reader = res.body.getReader();
            return reader.read().then(({ value }) => {
                try { reader.cancel(); } catch (e) {}
                const chunk = value ? new TextDecoder().decode(value.slice(0, 8192)) : '';
                return sniffHtml(chunk, url);
            });
        });
}

function sniffHtml(text, url) {
    if (!text || text.length < 64) throw new Error('stub or empty file');
    if (/<html|<head|<script|<!doctype html/i.test(text)) return url;
    throw new Error('not an html build');
}

async function resolveMirror(build) {
    if (!build || !build.mirrors || !build.mirrors.length) throw new Error('no mirrors');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), gxMirrorTimeout());

    // Race every mirror; first verified wins. Failures are remembered so the
    // next launch of the same build goes straight to the working mirror.
    const cached = (() => {
        try { return JSON.parse(_lsGet('gxMirror_' + build.id) || 'null'); } catch (e) { return null; }
    })();
    /* A bundled copy is same-origin, so it is tried first and normally wins
       without touching the network. If the folder is missing from this
       deployment (it may have been excluded to keep the repo small) fall
       through to the remote mirrors instead of launching a 404. */
    const local = build.mirrors.find(m => m.local);
    if (local) {
        const quickCtrl = new AbortController();
        const quickTimer = setTimeout(() => quickCtrl.abort(), 4000);
        try {
            const ok = await probeMirror(local.url, quickCtrl.signal);
            try { _lsSet('gxMirror_' + build.id, JSON.stringify(ok)); } catch (e) {}
            clearTimeout(quickTimer); clearTimeout(timer);
            return ok;
        } catch (e) {
            clearTimeout(quickTimer);
        }
    }

    const pref = (typeof gxSettings === 'function' ? gxSettings().sourceOrder : 'auto');
    let ordered = build.mirrors.filter(m => !m.local);
    if (pref && pref !== 'auto') {
        // user pinned a preferred source: try it first, keep the rest as backup
        ordered.sort((a, b) => (b.id === pref ? 1 : 0) - (a.id === pref ? 1 : 0));
    } else if (cached) {
        ordered.sort((a, b) => (b.url === cached ? 1 : 0) - (a.url === cached ? 1 : 0));
    }

    try {
        const winner = await Promise.any(ordered.map(m => probeMirror(m.url, ctrl.signal)));
        try { _lsSet('gxMirror_' + build.id, JSON.stringify(winner)); } catch (e) {}
        return winner;
    } finally {
        clearTimeout(timer);
    }
}

// Opens a URL the safe way: popup if allowed, same-tab otherwise. Used only
// for the Regular mode (which hands the URL to the browser) and as a last
// resort when a download fails — it never wraps a build in a frame.
function launchUrl(url, popupFeatures) {
    const newTab = (typeof gxSettings === 'function' ? gxSettings().preferNewTab : true);
    if (!newTab) { window.location.href = url; return false; }
    let win = null;
    try { win = window.open(url, '_blank', popupFeatures); } catch (e) { win = null; }
    if (!win) window.location.href = url;
    return !!win;
}

async function playGame() {
    if (window._customActive && window._customHtml) { return playCustom(); }
    if (!_selectedVersion) { showToast('Pick a build first.', true); return; }
    if (!_selectedBuild) _selectedBuild = (window.GX && window.GX.catalog) ? window.GX.catalog.byId(_selectedVersion) : null;
    if (!_selectedBuild) { showToast('That build is no longer in the catalog.', true); return; }
    await warnIfModsWontWork();

    const method = getEffectiveLaunchMethod();
    const wispOn = isWispEnabled();
    const popupFeatures = 'width=1280,height=720,toolbar=0,menubar=0,location=0,status=0';

    if (wispOn && method === 'regular') {
        showToast('WISP needs the HTML fetched first — use About:Blank, Blob or Popup mode.', true);
    }

    setStatus('CONNECTING...');
    let absUrl;
    try {
        absUrl = await resolveMirror(_selectedBuild);
    } catch (err) {
        setStatus('SOURCE UNREACHABLE');
        showToast('All mirrors failed for ' + _selectedBuild.name + '. Check your connection.', true, 6000);
        return;
    }

    /* Every mode except Regular downloads the actual HTML file and launches
       the fetched document. Nothing is loaded through an <iframe>: a frame
       would re-fetch the build from a third-party origin inside a sandbox the
       game cannot use (no pointer lock, no keyboard, no fullscreen, and the
       same CORS walls we just spent a mirror chain to get around). */
    if (method === 'regular') {
        setStatus('SOURCE OK');
        launchUrl(absUrl);
        setStatus('LAUNCHED <span class="hl">' + _selectedBuild.name + '</span>');
        return;
    }

    setStatus('FETCHING...');
    let html;
    try {
        html = await _fetchWithProgress(absUrl, _selectedBuild);
    } catch (err) {
        setStatus('FETCH FAILED');
        showToast('Could not download the build (' + err.message + ') — opening the source URL instead.', true, 6000);
        launchUrl(absUrl);
        return;
    }
    setStatus('PATCHING...');

    // WISP is optional and must never cost the user the launch. It is async
    // (it may lazy-load wisp-bundle.js), so it has to be awaited.
    if (wispOn) {
        try { html = await injectWispIntoHtml(html); }
        catch (e) { showToast('WISP failed (' + e.message + ') — launching without it.', true); }
    }
    try { html = injectServersIntoHtml(html); } catch (e) { /* non-fatal */ }

    // Relative URLs (textures, wasm modules, assets) must resolve against the
    // mirror the file came from, not against the launcher page.
    const prepared = absolutiseHtml(html, absUrl);

    if (method === 'blob') {
        const blob = new Blob([prepared], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        if (!launchUrl(blobUrl)) showToast('Popup blocked — opening in this tab instead.', true);
        setStatus('LAUNCHED <span class="hl">' + _selectedBuild.name + '</span> from fetched HTML');

    } else if (method === 'about-blank') {
        const win = window.open('', '_blank');
        if (!win) { showToast('Popup blocked.', true); setStatus('POPUP BLOCKED'); return; }
        win.document.open();
        win.document.write(prepared);
        win.document.close();
        setStatus('LAUNCHED <span class="hl">' + _selectedBuild.name + '</span> in about:blank');

    } else if (method === 'popup') {
        const win = window.open('', '_blank', popupFeatures);
        if (!win) { showToast('Popup blocked.', true); setStatus('POPUP BLOCKED'); return; }
        win.document.open();
        win.document.write(prepared);
        win.document.close();
        setStatus('LAUNCHED <span class="hl">' + _selectedBuild.name + '</span> in popup');

    } else if (method === 'data-uri') {
        /* A data: URI has to carry the whole document, and browsers cap the
           address bar at roughly 2 MB. Most Eaglercraft builds are 5-40 MB,
           so this mode is only honest for the small ones — say so plainly
           instead of copying a URI that will silently truncate. */
        try {
            const dataUri = buildDataUri(prepared);
            if (dataUri.length > 1500000) {
                setStatus('BUILD TOO LARGE FOR A URI');
                showToast('This build is ' + Math.round(prepared.length / 1048576) +
                    ' MB — too big for a data: URI (browser limit is about 2 MB). ' +
                    'Switch Launch Mode to Blob URL.', true, 9000);
                return;
            }
            try { await navigator.clipboard.writeText(dataUri); _showDataUriSplash(true); }
            catch (e) { _showDataUriSplash(false); }
            setStatus('DATA URI COPIED — PASTE IN ADDRESS BAR');
        } catch (e) {
            showToast('Failed to generate URI: ' + e.message, true);
            setStatus('URI ERROR');
        }
    }
}

/* Insert a <base> pointing at the mirror so every relative asset in the build
   resolves correctly once the HTML is no longer living at that origin. */
function absolutiseHtml(html, sourceUrl) {
    const base = '<base href="' + sourceUrl.replace(/[^/]*$/, '') + '">';
    if (/<base[\s>]/i.test(html)) return html;                 // already has one
    if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, m => m + '\n' + base);
    if (/<html[^>]*>/i.test(html)) return html.replace(/<html[^>]*>/i, m => m + '\n<head>' + base + '</head>');
    return base + html;
}

/* Pack the already-fetched document into a data: URI. Base64 of the UTF-8
   bytes, decoded in the loader with TextDecoder so non-ASCII build titles and
   inlined assets survive the round trip. */
function buildDataUri(html) {
    // TextEncoder is universal in browsers; guard anyway so an older embedded
    // webview can still produce a URI instead of throwing.
    const bytes = (typeof TextEncoder === 'function')
        ? new TextEncoder().encode(html)
        : Uint8Array.from(unescape(encodeURIComponent(html)), c => c.charCodeAt(0));
    let bin = '';
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    const b64 = btoa(bin);
    return 'data:text/html;base64,' + btoa(
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>GX-Launcher</title></head><body>' +
        '<script>' +
        'try{' +
        'var b=atob(' + JSON.stringify(b64) + ');' +
        'var u=new Uint8Array(b.length);' +
        'for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);' +
        'var h=new TextDecoder().decode(u);' +
        'document.open();document.write(h);document.close();' +
        '}catch(e){document.body.textContent="Launch failed: "+e.message;}' +
        '<\/script></body></html>');
}

function _showDataUriSplash(copied) {
    document.getElementById('_gx_uri_splash')?.remove();
    const overlay = document.createElement('div');
    overlay.id = '_gx_uri_splash';
    overlay.style.cssText = [
        'position:fixed','inset:0','z-index:99999',
        'background:rgba(0,0,0,0.92)',
        'display:flex','flex-direction:column',
        'align-items:center','justify-content:center','gap:18px',
        'font-family:var(--mono,monospace)',
        'animation:_gxFadeIn 0.2s ease'
    ].join(';');
    overlay.innerHTML = `
        <style>
            @keyframes _gxFadeIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
            #_gx_uri_splash .splash-box {
                border:1px solid var(--accent,#cc0000);
                background:var(--panel,#141414);
                padding:32px 40px;
                text-align:center;
                max-width:420px;
                box-shadow:0 0 40px var(--accent-glow,rgba(180,0,0,0.2));
            }
            #_gx_uri_splash .splash-icon { font-size:36px; margin-bottom:12px; }
            #_gx_uri_splash .splash-title {
                font-size:13px; letter-spacing:0.18em; text-transform:uppercase;
                color:var(--accent,#cc0000); margin-bottom:10px;
            }
            #_gx_uri_splash .splash-body {
                font-size:11px; color:var(--text-dim,#888); line-height:1.7; margin-bottom:20px;
            }
            #_gx_uri_splash .splash-body strong { color:var(--text-bright,#fff); }
            #_gx_uri_splash .splash-warn {
                font-size:10px; color:#ffaa00; margin-bottom:16px;
            }
            #_gx_uri_splash .splash-close {
                background:var(--accent-dim,#7a0000); border:none;
                color:#fff; font-family:var(--mono,monospace);
                font-size:11px; padding:8px 24px; cursor:pointer;
                letter-spacing:0.1em; text-transform:uppercase;
                transition:background 0.13s;
            }
            #_gx_uri_splash .splash-close:hover { background:var(--accent,#cc0000); }
        </style>
        <div class="splash-box">
            <div class="splash-icon">📋</div>
            <div class="splash-title">${copied ? 'URI Copied!' : 'URI Ready'}</div>
            <div class="splash-body">
                ${copied
                    ? 'The <strong>data: URI</strong> has been copied to your clipboard.'
                    : 'Could not auto-copy — please copy the URI from the address bar manually.'}
                <br><br>
                Open a <strong>new tab</strong>, click the address bar,<br>
                <strong>paste</strong> and press <strong>Enter</strong>.
            </div>
            ${!copied ? '<div class="splash-warn">⚠ Clipboard access was blocked by your browser.</div>' : ''}
            <button class="splash-close" onclick="document.getElementById('_gx_uri_splash').remove()">Got it</button>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay?.remove(), 15000);
}

function _fetchWithProgress(url, build) {
    const label = build ? (build.label || build.name) : '';
    showLoading(label ? 'FETCHING ' + label.toUpperCase() : 'FETCHING...');
    setLoadingBar(5);
    return fetch(url, { credentials: 'omit' }).then(res => {
        if (!res.ok) { hideLoading(); throw new Error('HTTP ' + res.status); }
        const total = parseInt(res.headers.get('content-length') || '0');
        // No readable stream (older browser, or a proxy that strips it):
        // fall back to a single-shot text read rather than failing the launch.
        if (!res.body || typeof res.body.getReader !== 'function') {
            setLoadingBar(60);
            return res.text().then(t => { hideLoading(); setLoadingBar(100); return t; });
        }
        const reader = res.body.getReader();
        let received = 0;
        const chunks = [];

        function pump() {
            return reader.read().then(({ done, value }) => {
                if (done) return;
                chunks.push(value);
                received += value.length;
                if (total) setLoadingBar(5 + Math.round(received / total * 80));
                return pump();
            });
        }

        return pump().then(() => {
            setLoadingBar(88);
            const merged = new Uint8Array(received);
            let pos = 0;
            for (const c of chunks) { merged.set(c, pos); pos += c.length; }
            hideLoading();
            setLoadingBar(100);
            return new TextDecoder().decode(merged);
        });
    }).catch(err => { hideLoading(); throw err; });
}

// ===== NAVIGATION HELPERS =====
function redirectToNews()         { window.location.href = 'news.html'; }
function redirectToClients()      { window.location.href = 'index.html'; }  // merged into Play
function redirectToPlay()         { window.location.href = 'index.html'; }
function redirectToServers()      { window.location.href = 'servers.html'; }
function redirectToMods()         { window.location.href = 'mods.html'; }
function redirectToSkins()        { window.location.href = 'skins.html'; }
function redirectToMain()         { window.location.href = 'index.html'; }
function redirectToDownloads()    { window.location.href = 'downloads.html'; }
function redirectToSettings()     { window.location.href = 'settings.html'; }
function redirectToChat()         { window.location.href = 'chat.html'; }

// ===== SETTINGS PAGE ACTIONS =====
function saveUsername() {
    const val = (document.getElementById('username-input')?.value || '').trim();
    if (!val) { showToast('Enter a username first.', true); return; }
    setCookie('username', val, 365);
    document.querySelectorAll('.profile-name, #profile-name').forEach(el => el.textContent = val);
    showToast('Username saved: ' + val);
}

function applyUiScale(scale) {
    document.documentElement.style.setProperty('--ui-scale', scale);
    document.querySelectorAll('[data-scale]').forEach(btn => {
        btn.classList.toggle('selected', parseFloat(btn.dataset.scale) === scale);
    });
}

function saveUiScale(scale) {
    applyUiScale(scale);
    setCookie('uiScale', scale, 365);
    showToast('UI scale: ' + Math.round(scale * 100) + '%');
}

function loadUiScale() {
    const saved = parseFloat(getCookie('uiScale'));
    const scale = (!isNaN(saved)) ? saved : 1;
    applyUiScale(scale);
}

function applyThemeFromSwatch(name, el) {
    applyTheme(name);
    showToast('Theme: ' + name);
}

function selectLaunchMode(mode, el) {
    setCookie('launchMethod', mode, 365);
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
    if (el) el.classList.add('selected');
    const labels = { regular:'REGULAR', 'about-blank':'ABOUT:BLANK', 'data-uri':'DATA URI', blob:'BLOB URL', popup:'POPUP' };
    const badge = document.getElementById('mode-badge-text');
    if (badge) badge.textContent = labels[mode] || mode.toUpperCase();
    showToast('Launch mode: ' + (labels[mode] || mode));
}

// Toggle WISP on/off from settings
function toggleWisp(enabled) {
    setCookie('wispEnabled', enabled ? 'true' : 'false', 365);
    const toggle = document.getElementById('wisp-toggle');
    const status = document.getElementById('wisp-status-text');
    const urlRow = document.getElementById('wisp-url-row');
    if (toggle) toggle.checked = enabled;
    if (status) {
        status.textContent = enabled ? 'ENABLED' : 'DISABLED';
        status.className = 'wisp-status-badge ' + (enabled ? 'on' : 'off');
    }
    if (urlRow) urlRow.style.opacity = enabled ? '1' : '0.45';
    showToast('WISP injection ' + (enabled ? 'enabled' : 'disabled'));
}

// Save WISP URL from settings input
function saveWispUrl() {
    const input = document.getElementById('wisp-url-input');
    if (!input) return;
    const val = input.value.trim();
    if (!val) {
        showToast('Enter a WISP server URL.', true);
        return;
    }
    try {
        const u = new URL(val);
        if (!u.protocol.startsWith('ws')) throw new Error('Must start with ws:// or wss://');
    } catch(e) {
        showToast('Invalid URL: ' + e.message, true);
        return;
    }
    setCookie('wispUrl', val, 365);
    showToast('WISP server saved.');
}

function resetWispUrl() {
    const def = 'wss://anura.pro/';
    setCookie('wispUrl', def, 365);
    const input = document.getElementById('wisp-url-input');
    if (input) input.value = def;
    showToast('Reset to default WISP server.');
}

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

    // Apply saved username
    const username = getCookie('username');
    if (username) {
        document.querySelectorAll('.profile-name, #profile-name').forEach(el => el.textContent = username);
        const input = document.getElementById('username-input');
        if (input) input.value = username;
    }

    // Apply saved theme
    const savedTheme = getCookie('launcherTheme') || 'default';
    applyTheme(savedTheme);

    // Restore launch mode selection on settings page
    const savedMode = getCookie('launchMethod') || 'regular';
    document.querySelectorAll('.mode-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.mode === savedMode);
    });
    const badge = document.getElementById('mode-badge-text');
    const modeLabels = { regular:'REGULAR', 'about-blank':'ABOUT:BLANK', 'data-uri':'DATA URI', blob:'BLOB URL', popup:'POPUP' };
    const effectiveMode = getEffectiveLaunchMethod();
    if (badge) badge.textContent = modeLabels[effectiveMode] || effectiveMode.toUpperCase();

    // On Cloudflare, Regular and Popup modes don't work reliably — disable
    // their cards on the settings page so users can't select something that
    // silently gets overridden at launch time.
    if (isRunningOnCloudflare()) {
        document.querySelectorAll('.mode-card[data-mode="regular"], .mode-card[data-mode="popup"]').forEach(c => {
            c.classList.add('disabled');
            c.style.opacity = '0.4';
            c.style.pointerEvents = 'none';
            c.title = 'Not available when running on Cloudflare — use Blob URL or About:Blank instead.';
        });
    }

    // Restore WISP settings on settings page
    const wispEnabled = isWispEnabled();
    const toggle = document.getElementById('wisp-toggle');
    const status = document.getElementById('wisp-status-text');
    const urlRow = document.getElementById('wisp-url-row');
    const urlInput = document.getElementById('wisp-url-input');
    if (toggle) toggle.checked = wispEnabled;
    if (status) {
        status.textContent = wispEnabled ? 'ENABLED' : 'DISABLED';
        status.className = 'wisp-status-badge ' + (wispEnabled ? 'on' : 'off');
    }
    if (urlRow) urlRow.style.opacity = wispEnabled ? '1' : '0.45';
    if (urlInput) urlInput.value = getWispUrl();

    // Restore UI scale
    loadUiScale();
});

// ===== CUSTOM HTML UPLOAD =====
// Lets you run your own game from a single .html file instead of a built-in version.
function pickCustomHtml() {
    document.getElementById('version-dropdown')?.classList.remove('open');
    document.getElementById('version-select')?.classList.remove('open');
    document.getElementById('custom-html-input')?.click();
}

async function onCustomHtml(input) {
    const f = input.files && input.files[0];
    input.value = '';
    if (!f) return;
    if (!/\.html?$/i.test(f.name)) { showToast('Pick an .html file.', true); return; }
    try {
        window._customHtml = await f.text();
    } catch (e) {
        showToast('Could not read file: ' + e.message, true);
        return;
    }
    window._customName = f.name;
    window._customActive = true;
    const lbl = document.getElementById('version-label');
    if (lbl) lbl.textContent = 'Custom: ' + f.name;
    document.querySelectorAll('.version-option').forEach(o => o.classList.remove('active-ver'));
    const btn = document.getElementById('play-btn');
    if (btn) btn.disabled = false;
    const safe = f.name.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[ch]));
    setStatus('CUSTOM GAME: <span class="hl">' + safe + '</span>');
}

async function playCustom() {
    const method = getEffectiveLaunchMethod();
    const wispOn = isWispEnabled();
    const name = window._customName || 'custom.html';
    let html = window._customHtml;
    setStatus('PREPARING CUSTOM GAME...');

    if (wispOn) {
        try { html = await injectWispIntoHtml(html); }
        catch (err) { showToast('WISP failed (' + err.message + ') — launching without WISP.', true); html = window._customHtml; }
    }
    try { html = await injectServersIntoHtml(html); } catch (e) { /* launch as-is */ }

    // An uploaded file has no URL of its own, so Regular has nothing to point
    // at — fall back to a blob URL, which is what the other modes use anyway.
    if (method === 'about-blank' || method === 'popup') {
        const win = window.open('', '_blank');
        if (!win) { showToast('Popup blocked.', true); return; }
        win.document.open();
        win.document.write(html);
        win.document.close();
    } else {
        const blobUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
        const w = window.open(blobUrl, '_blank', method === 'popup'
            ? 'width=1280,height=720,toolbar=0,menubar=0,location=0,status=0' : undefined);
        if (!w) { showToast('Popup blocked — allow popups for this site.', true); return; }
    }
    const safe = name.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[ch]));
    setStatus('LAUNCHED <span class="hl">CUSTOM: ' + safe + '</span>');
}

// Shows how many builds the picker knows about, on the Play screens.
function paintCatalogLine() {
    const el = document.getElementById('play-catalog-line');
    if (!el || !window.GX || !window.GX.catalog) return;
    const c = window.GX.catalog.counts();
    const sources = (window.GX_BUILD_SOURCES || []).filter(x => !x.unavailable).length;
    el.innerHTML = '<b>' + c.total + '</b> builds across <b>' + sources +
        '</b> mirrors &middot; <b>' + c.byTech.wasm + '</b> WASM &middot; restart-free';
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paintCatalogLine);
else paintCatalogLine();


/* ============================================================
   3.0 SETTINGS
   Every preference lives in a single gxSettings object so it can be
   exported, imported and reset in one place.
   ============================================================ */
const GX_SETTING_DEFAULTS = {
    sourceOrder: 'auto',
    mirrorTimeout: 20000,
    rememberBuild: true,
    preferNewTab: true,
    autofocusGame: true,
    keyboardLock: true,
    injectServers: true,
    extraRender: false,
    showBadges: true,
    compactPicker: false,
    reduceMotion: false
};

function gxSettings() {
    let saved = {};
    try { saved = JSON.parse(_lsGet('gxSettings') || '{}'); } catch (e) { saved = {}; }
    return Object.assign({}, GX_SETTING_DEFAULTS, saved);
}

function gxSaveSetting(key, value) {
    const all = gxSettings();
    all[key] = value;
    _lsSet('gxSettings', JSON.stringify(all));
    gxApplySettings();
}

function gxApplySettings() {
    const s = gxSettings();
    document.documentElement.classList.toggle('gx-reduce-motion', !!s.reduceMotion);
    document.documentElement.classList.toggle('gx-compact-picker', !!s.compactPicker);
    document.documentElement.classList.toggle('gx-no-badges', !s.showBadges);
}

function saveToggle(key, value) { gxSaveSetting(key, value); }
function saveSourceOrder(v) { gxSaveSetting('sourceOrder', v); }
function saveMirrorTimeout(v) { gxSaveSetting('mirrorTimeout', parseInt(v, 10) || 20000); }
function saveRememberBuild(v) { gxSaveSetting('rememberBuild', v); }
function savePreferNewTab(v) { gxSaveSetting('preferNewTab', v); }

function gxSyncSettingsUi() {
    const s = gxSettings();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };
    set('remember-build', s.rememberBuild);
    set('prefer-new-tab', s.preferNewTab);
    set('autofocus-game', s.autofocusGame);
    set('keyboard-lock', s.keyboardLock);
    set('inject-servers', s.injectServers);
    set('extra-render', s.extraRender);
    set('show-badges', s.showBadges);
    set('compact-picker', s.compactPicker);
    set('reduce-motion', s.reduceMotion);
    const so = document.getElementById('source-order'); if (so) so.value = s.sourceOrder;
    const mt = document.getElementById('mirror-timeout'); if (mt) mt.value = String(s.mirrorTimeout);

    // catalogue line
    const stats = document.getElementById('catalog-stats');
    if (stats && window.GX && window.GX.catalog) {
        const c = window.GX.catalog.counts();
        const nSources = (window.GX_BUILD_SOURCES || []).filter(x => !x.unavailable).length;
        const live = window.GX.catalog.liveStatus && window.GX.catalog.liveStatus();
        stats.textContent = c.total + ' builds from ' + nSources + ' mirrors (' +
            c.byTech.wasm + ' WASM, ' + c.byTech.js + ' JS) across ' +
            Object.keys(c.byEpoch).length + ' eras' +
            (live ? ' — file lists live from ' + live.families.length + ' publishers.' : ' — built-in verified list.');
        const ls = document.getElementById('live-status');
        if (ls) ls.textContent = live
            ? 'File lists refreshed from ' + live.families.join(', ') + '. Press the button to check again now.'
            : 'Checks every publisher for newly uploaded builds. Falls back to the built-in list if a publisher is offline.';
    }

    renderSourceList();
    refreshStorageInfo();
}

function refreshBuildList(force) {
    if (!window.GX || !window.GX.catalog || !window.GX.catalog.refresh) {
        showToast('Build catalogue is not loaded on this page.', true); return;
    }
    const el = document.getElementById('live-status');
    if (el) el.textContent = 'Checking publishers...';
    showToast('Checking publishers for new builds...');
    window.GX.catalog.refresh({ force: !!force }).then(r => {
        const total = window.GX.catalog.counts().total;
        if (r.offline && el) {
            el.textContent = 'You are offline — using the built-in list of ' + total + ' builds. Bundled builds still launch.';
            showToast('Offline — bundled builds still work.', true);
            return;
        }
        if (el) el.textContent = r.tried
            ? 'Checked ' + r.tried + ' publisher' + (r.tried === 1 ? '' : 's') + '. ' + total +
              ' builds available' + (r.added ? ' (' + r.added + ' change' + (r.added === 1 ? '' : 's') + ' picked up).' : '.')
            : 'No publisher answered — using the built-in list of ' + total + ' builds.';
        gxSyncSettingsUi();
        renderSourceList();
        showToast(r.added ? 'Build list updated: ' + r.added + ' change(s).' : 'Build list already up to date.');
    });
}

function verifyAllMirrors() {
    if (!window.GX || !window.GX.catalog) return;
    const builds = window.GX.catalog.all();
    showToast('Verifying ' + builds.length + ' builds across every mirror...');
    let done = 0, ok = 0, dead = 0;
    builds.forEach(b => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 12000);
        Promise.all(b.mirrors.map(m => fetch(m.url, { method: 'GET', headers: { Range: 'bytes=0-63' }, signal: ctrl.signal, credentials: 'omit' })
            .then(r => r.ok || r.status === 206).catch(() => false)))
            .then(results => {
                clearTimeout(t);
                done++;
                if (results.some(Boolean)) ok++; else dead++;
                if (done === builds.length) {
                    showToast('Mirror check finished: ' + ok + ' reachable, ' + dead + ' unreachable.', dead > 0);
                }
            });
    });
}

function clearMirrorCache() {
    try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('gxMirror_')) keys.push(k);
        }
        keys.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
    gxSyncSettingsUi();
    showToast('Mirror cache cleared.');
}

function renderSourceList() {
    const host = document.getElementById('source-list');
    if (!host) return;
    const srcs = window.GX_BUILD_SOURCES || [];
    if (!srcs.length) { host.innerHTML = '<div class="gx-empty">Source list not loaded.</div>'; return; }
    host.innerHTML = srcs.map(s => {
        const n = (s.files || []).length;
        const state = s.unavailable
            ? 'unsupported'
            : n + ' file' + (n === 1 ? '' : 's');
        return '<div class="gx-source' + (s.unavailable ? ' off' : '') + '">' +
            '<span class="gx-source-id">' + window.GX.catalog.esc(s.id) + '</span>' +
            '<span class="gx-source-label">' + window.GX.catalog.esc(s.label) + '</span>' +
            '<span class="gx-source-n">' + state + '</span></div>' +
            (s.note ? '<div class="gx-source-note">' + window.GX.catalog.esc(s.note) + '</div>' : '');
    }).join('');
}

function mirrorCacheCount() {
    let n = 0;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            if ((localStorage.key(i) || '').startsWith('gxMirror_')) n++;
        }
    } catch (e) {}
    return n;
}

function refreshStorageInfo() {
    const mc = document.getElementById('mirror-cache-desc');
    if (mc) {
        const n = mirrorCacheCount();
        mc.textContent = n
            ? n + ' build' + (n === 1 ? '' : 's') + ' resolved to a working mirror.'
            : 'No mirrors probed yet — the first launch of each build records one.';
    }
    const el = document.getElementById('storage-desc');
    if (!el) return;
    let bytes = 0, entries = 0;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            bytes += k.length + (localStorage.getItem(k) || '').length;
            entries++;
        }
    } catch (e) {}
    el.textContent = entries + ' keys, about ' + (bytes / 1024).toFixed(1) + ' KB of launcher settings stored locally.';
}

function exportSettings() {
    const data = {
        gxLauncher: '3.0',
        exported: new Date().toISOString(),
        settings: gxSettings(),
        username: _lsGet('username') || '',
        launchMethod: getCookie('launchMethod') || 'regular',
        theme: getCookie('launcherTheme') || 'default',
        uiScale: _lsGet('uiScale') || '1',
        wisp: { enabled: getCookie('wispEnabled') === 'true', url: getCookie('wispUrl') || '' },
        servers: (() => { try { return JSON.parse(_lsGet('gxCustomServers') || '[]'); } catch (e) { return []; } })()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gx-launcher-settings.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    showToast('Settings exported.');
}

function importSettings(input) {
    const f = input.files && input.files[0];
    input.value = '';
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
        let data;
        try { data = JSON.parse(reader.result); } catch (e) {
            showToast('That file is not valid JSON.', true); return;
        }
        if (!data || !data.settings) { showToast('Not a GX-Launcher settings file.', true); return; }
        _lsSet('gxSettings', JSON.stringify(Object.assign({}, GX_SETTING_DEFAULTS, data.settings)));
        if (data.username) _lsSet('username', data.username);
        if (data.launchMethod) setCookie('launchMethod', data.launchMethod, 365);
        if (data.theme) setCookie('launcherTheme', data.theme, 365);
        if (data.uiScale) _lsSet('uiScale', data.uiScale);
        if (data.wisp) {
            setCookie('wispEnabled', String(!!data.wisp.enabled), 365);
            if (data.wisp.url) setCookie('wispUrl', data.wisp.url, 365);
        }
        if (Array.isArray(data.servers)) _lsSet('gxCustomServers', JSON.stringify(data.servers));
        location.reload();
    };
    reader.readAsText(f);
}

function resetEverything() {
    if (!confirm('Reset every launcher setting, cached mirror result and saved profile?')) return;
    try {
        const kill = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && !k.startsWith('gx_ver_')) kill.push(k);
        }
        kill.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
    showToast('Launcher reset.');
    setTimeout(() => location.reload(), 600);
}

// Launch a random build. Bundled builds are favoured so it always works.
function launchRandomBuild() {
    if (!window.GX || !window.GX.catalog) { showToast('Build catalogue not loaded.', true); return; }
    const all = window.GX.catalog.all();
    const offline = all.filter(b => b.mirrors.some(m => m.local) && !b.isMobile);
    const pool = offline.length ? offline : all;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    pickBuild(pick);
    playGame();
}

// Restore the last played build when the user asked for it.
function gxRestoreLastBuild() {
    if (!gxSettings().rememberBuild) return;
    if (document.getElementById('version-label')?.textContent !== 'Select Version' &&
        document.getElementById('version-label')?.textContent !== 'Select a build') return;
    const id = _lsGet('gxLastBuild');
    if (!id || !window.GX || !window.GX.catalog) return;
    const b = window.GX.catalog.byId(id);
    if (b) selectVersion(b.id, b.label || b.name, b.tech === 'wasm', true);
}

document.addEventListener('DOMContentLoaded', () => {
    gxApplySettings();
    gxSyncSettingsUi();
    setTimeout(gxRestoreLastBuild, 300);
});
