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
    group: 'games',
    tags: ['2D', 'SURVIVAL'],
    art: 'resources/arcade/minicraft.png'
  },
  {
    id: 'mc4k',
    name: 'Eaglercraft 4K',
    blurb: 'The whole game compressed under four kilobytes. Absurd and it really runs.',
    file: 'mc4k.html',
    group: 'variants',
    tags: ['DEMO', 'TINY'],
    art: 'resources/arcade/4k.png'
  },
  {
    id: 'eaglercraft-4k',
    name: 'Eaglercraft 4K (JS)',
    blurb: 'The plain-JavaScript cut of the 4K build, for hardware without WASM.',
    file: 'Eaglercraft-4k-JS.html',
    group: 'variants',
    tags: ['DEMO', 'JAVASCRIPT'],
    art: 'resources/arcade/4k.png'
  },
  {
    id: 'scratch',
    name: 'Eaglercraft Scratch',
    blurb: 'The Scratch edition — block-based visuals, same survival loop.',
    file: 'Eaglercraft Scratch.html',
    alternates: ['Eaglercraft-Scratch.html'],
    group: 'variants',
    tags: ['NOVELTY'],
    art: 'resources/arcade/scratch.png'
  },
  {
    id: 'mobile',
    name: 'Eaglercraft Mobile',
    blurb: 'Touch-first controls, laid out for a phone held sideways.',
    file: 'Eaglercraft Mobile.html',
    group: 'variants',
    tags: ['MOBILE', 'TOUCH'],
    art: 'resources/arcade/mobile.png'
  },
  {
    id: 'eaglet',
    name: 'Eaglet',
    blurb: 'Small, fast Eaglercraft client for low-end machines. Vanilla textures.',
    file: 'Eaglet.html',
    alternates: ['EagletWithNormalResources.html'],
    group: 'variants',
    tags: ['CLIENT', 'LIGHTWEIGHT'],
    art: 'resources/arcade/eaglet.png'
  },
  {
    id: 'eaglymc',
    name: 'EaglyMC',
    blurb: 'Compact Eaglercraft client with a trimmed launcher screen.',
    file: 'EaglyMC.html',
    group: 'variants',
    tags: ['CLIENT'],
    art: 'resources/arcade/eaglymc.png'
  },
  {
    id: 'eagler-forge',
    name: 'EaglerForge 1.8.8',
    blurb: 'Forge-style mod loader for browser Minecraft. This is the one the mods page targets.',
    file: 'efi-1.8.8/index.html',
    alternates: ['eaglercraft-forge-1.0-js.html'],
    group: 'variants',
    tags: ['MODS', 'FORGE'],
    art: 'resources/arcade/eagler-forge.png'
  },
  {
    id: 'skyfactory',
    name: 'Skyfactory',
    blurb: 'Skyblock survival with a full tech and resource modpack layered on.',
    file: 'Eaglercraft Skyfactory.html',
    tags: ['MODPACK', 'SKYBLOCK'],
    group: 'modpacks',
    art: 'resources/arcade/pack-sky.png'
  },
  {
    id: 'tech',
    name: 'Tech',
    blurb: 'Industrial tech modpack — machinery, power and automation.',
    file: 'Eaglercraft Tech.html',
    tags: ['MODPACK', 'TECH'],
    group: 'modpacks',
    art: 'resources/arcade/pack-tech.png'
  },
  {
    id: 'magic',
    name: 'Magic',
    blurb: 'Magic-focused modpack: spell and enchantment overhaul.',
    file: 'Eaglercraft Magic.html',
    tags: ['MODPACK', 'MAGIC'],
    group: 'modpacks',
    art: 'resources/arcade/pack-magic.png'
  },
  {
    id: 'aether',
    name: 'Aether',
    blurb: 'The Aether dimension bolted onto 1.14. Sky islands and new gear.',
    file: 'Eaglercraft 1.14 Aether.html',
    tags: ['MODPACK', 'ADVENTURE'],
    group: 'modpacks',
    art: 'resources/arcade/pack-sky.png'
  },
  {
    id: 'create',
    name: 'Create (fast)',
    blurb: "Create's mechanical contraptions, in a build tuned to start quickly.",
    file: 'EaglerCreate fast WASM.html',
    tags: ['MODPACK', 'TECH'],
    group: 'modpacks',
    art: 'resources/arcade/pack-tech.png'
  },
  {
    id: 'immersive',
    name: 'Immersive Engineering',
    blurb: 'Immersive Engineering 1.12 — multiblock machines and wiring.',
    file: 'Immersive Engineering 1.12 New.html',
    tags: ['MODPACK', 'TECH'],
    group: 'modpacks',
    art: 'resources/arcade/pack-tech.png'
  },
  {
    id: 'explore',
    name: 'Explore',
    blurb: 'Exploration pack: new biomes and structures to wander into.',
    file: 'Eaglercraft Explore.html',
    tags: ['MODPACK', 'EXPLORATION'],
    group: 'modpacks',
    art: 'resources/arcade/pack-explore.png'
  },
  {
    id: 'modded',
    name: '26.2 Modded',
    blurb: 'The newest build with a mod layer on top.',
    file: 'Eaglercraft 26.2 Modded.html',
    tags: ['MODPACK', '26.2'],
    group: 'modpacks',
    art: 'resources/arcade/pack.png'
  },
  {
    id: 'magic-jspi',
    name: 'Magic (WASM JSPI)',
    blurb: 'The magic pack as a WASM build — needs JSPI.',
    file: 'Eaglercraft WASM JSPI Magic.html',
    tags: ['MODPACK', 'WASM'],
    group: 'modpacks',
    art: 'resources/arcade/pack-magic.png'
  },
  {
    id: 'tech-jspi',
    name: 'Tech (WASM JSPI)',
    blurb: 'The tech pack as a WASM build — needs JSPI.',
    file: 'Eaglercraft WASM JSPI Tech.html',
    tags: ['MODPACK', 'WASM'],
    group: 'modpacks',
    art: 'resources/arcade/pack-tech.png'
  }
];

/* A top-level `const` is not a window property, and arcade.js reads from
   window, so export it explicitly (same pattern as builds-data.js). */
if (typeof window !== 'undefined') {
  window.GX_ARCADE = GX_ARCADE;
}
