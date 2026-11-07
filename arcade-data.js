/* ============================================================
   GX-LAUNCHER 3.0 — ARCADE CATALOGUE

   Games that are not part of the Minecraft build list. Each entry names the
   file it launches. `file` is looked up in the same verified manifests the
   Build Library uses, so an entry only appears if a real file backs it —
   no dead tiles.

   art:  path to the game's logo under resources/arcade/.
         Client logos (Eaglet, EaglyMC, EaglerForge) are the real favicon.png
         shipped inside that client's own build, copied verbatim — not redrawn.
         Everything else is launcher-made art.
   ============================================================ */

const GX_ARCADE = [
  {
    id: 'minicraft',
    name: 'Minicraft',
    blurb: 'Notch\'s 2011 top-down 2D game. Gather wood, build a shelter, survive the night.',
    file: 'Minicraft.html',
    tags: ['2D', 'SURVIVAL'],
    art: 'resources/arcade/minicraft.png'
  },
  {
    id: 'mc4k',
    name: 'Eaglercraft 4K',
    blurb: 'The whole game compressed under four kilobytes. Absurd and it really runs.',
    file: 'mc4k.html',
    tags: ['DEMO', 'TINY'],
    art: 'resources/arcade/4k.png'
  },
  {
    id: 'eaglercraft-4k',
    name: 'Eaglercraft 4K (JS)',
    blurb: 'The plain-JavaScript cut of the 4K build, for hardware without WASM.',
    file: 'Eaglercraft-4k-JS.html',
    tags: ['DEMO', 'JAVASCRIPT'],
    art: 'resources/arcade/4k.png'
  },
  {
    id: 'scratch',
    name: 'Eaglercraft Scratch',
    blurb: 'The Scratch edition — block-based visuals, same survival loop.',
    file: 'Eaglercraft Scratch.html',
    alternates: ['Eaglercraft-Scratch.html'],
    tags: ['NOVELTY'],
    art: 'resources/arcade/scratch.png'
  },
  {
    id: 'mobile',
    name: 'Eaglercraft Mobile',
    blurb: 'Touch-first controls, laid out for a phone held sideways.',
    file: 'Eaglercraft Mobile.html',
    tags: ['MOBILE', 'TOUCH'],
    art: 'resources/arcade/mobile.png'
  },
  {
    id: 'eaglet',
    name: 'Eaglet',
    blurb: 'A small, fast client aimed at low-end machines. Vanilla textures.',
    file: 'Eaglet.html',
    alternates: ['EagletWithNormalResources.html'],
    tags: ['CLIENT', 'LIGHTWEIGHT'],
    art: 'resources/arcade/eaglet.png'
  },
  {
    id: 'eaglymc',
    name: 'EaglyMC',
    blurb: 'EaglyMC — a compact client build with a trimmed launcher screen.',
    file: 'EaglyMC.html',
    tags: ['CLIENT'],
    art: 'resources/arcade/eaglymc.png'
  },
  {
    id: 'eagler-forge',
    name: 'EaglerForge 1.8.8',
    blurb: 'Forge-style mod loader for browser Minecraft. This is the one the mods page targets.',
    file: 'efi-1.8.8/index.html',
    alternates: ['eaglercraft-forge-1.0-js.html'],
    tags: ['MODS', 'FORGE'],
    art: 'resources/arcade/eagler-forge.png'
  }
];

/* A top-level `const` is not a window property, and arcade.js reads from
   window, so export it explicitly (same pattern as builds-data.js). */
if (typeof window !== 'undefined') {
  window.GX_ARCADE = GX_ARCADE;
}
