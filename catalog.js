/* ============================================================
   GX-LAUNCHER 3.0 — BUILD CATALOG
   Turns GX_BUILD_SOURCES (file names from the Apex-Launcher
   mirror set) into clean, de-duplicated, epoch-grouped entries.
   Same build appearing on several mirrors = one entry, many mirrors.
   ============================================================ */
(function () {
  'use strict';

  const GX = window.GX = window.GX || {};

  /* ---------------------------------------------------------- known builds
     Anything we can name properly is named here. Everything else falls back
     to a generic parse of the file name, so nothing is ever dropped. */
  const KNOWN = {
    // ---- snapshots / newest
    'eaglercraft-26.3.html':                          ['26.3', 'Snapshot', 'Eaglercraft 26.3 — newest WASM build.'],
    'eaglercraft-26.2.html':                          ['26.2', 'Snapshot', 'Eaglercraft 26.2 WASM.'],
    'eaglercraft-26.2-wispcraft.html':                ['26.2 Wispcraft', 'Snapshot', '26.2 with the Wispcraft relay patch baked in.'],
    'eaglercraft-26.1.2-WASM_Novix.html':             ['26.1.2 Novix', 'Snapshot', 'Novix-packaged 26.1.2 WASM build.'],
    'Novix_26.1.2.html':                              ['26.1.2 Novix', 'Snapshot', 'Novix 26.1.2 build.'],
    'Eaglercraft 1.21.11 WASM.html':                  ['1.21.11', 'Release', 'Eaglercraft 1.21.11 WASM.'],
    'Eaglercraft-1-21-11_wasm.html':                  ['1.21.11', 'Release', 'Eaglercraft 1.21.11 WASM.'],
    'Eaglercraft_1.20.6_WASM-GC.html':                ['1.20.6', 'Release', 'Eaglercraft 1.20.6 WASM-GC.'],
    'eaglercraft-1.17-wasm_gc.html':                  ['1.17.1', 'Release', 'Eaglercraft 1.17.1 WASM-GC.'],
    'Eaglercraft 1.16.5 WASM.html':                   ['1.16.5', 'Release', 'Eaglercraft 1.16.5 WASM.'],
    'eaglercraft-1.16.5-wasm-gc.html':                ['1.16.5', 'Release', 'Eaglercraft 1.16.5 WASM-GC.'],
    'Eaglercraft-1.15.2-JS.html':                     ['1.15.2', 'Release', 'Eaglercraft 1.15.2 (JavaScript build).'],
    'Eaglercraft-1.15.2-WASM_GC.html':                ['1.15.2', 'Release', 'Eaglercraft 1.15.2 WASM-GC.'],
    'Eaglercraft_1.14.4_WASM-GC.html':                ['1.14.4', 'Release', 'Eaglercraft 1.14.4 WASM-GC.'],
    'Eaglercraft_1.14.4_WASM-GC_U1.html':             ['1.14.4 u1', 'Release', 'Eaglercraft 1.14.4 WASM-GC update 1.'],
    'Eaglercraft 1.13.2-WASM.html':                   ['1.13.2', 'Release', 'Eaglercraft 1.13.2 WASM.'],
    'Eaglercraft-1.13.2-JS.html':                     ['1.13.2', 'Release', 'Eaglercraft 1.13.2 (JavaScript build).'],
    'Eaglercraft_1.12.2-WASM-GC.html':                ['1.12.2', 'Release', 'Eaglercraft 1.12.2 WASM-GC — the modding favourite.'],
    'wispcraft-Eaglercraft_1.12.2-WASM-GC.html':      ['1.12.2 Wispcraft', 'Release', '1.12.2 WASM-GC with Wispcraft relays.'],
    'Eaglercraft-1.12.html':                          ['1.12.2', 'Release', 'Eaglercraft 1.12.2.'],
    'wispcraft-Eaglercraft-1.12.html':                ['1.12.2 Wispcraft', 'Release', '1.12.2 with Wispcraft relays.'],
    'Eaglercraft_1.12_Javascript.html':               ['1.12.2 JS', 'Release', '1.12.2 full JavaScript build (large, slow, classic).'],
    'Eaglercraft-1.11.2.html':                        ['1.11.2', 'Release', 'Eaglercraft 1.11.2 — llama-era blocks supported.'],
    'Eaglercraft 1.8.8 .html':                        ['1.8.8', 'Release', 'EaglercraftX 1.8.8 — the definitive PvP build.'],
    'wispcraft-Eaglercraft 1.8.8 .html':              ['1.8.8 Wispcraft', 'Release', '1.8.8 with Wispcraft relays.'],
    'Eaglercraft-1.8.8.html':                         ['1.8.8', 'Release', 'EaglercraftX 1.8.8.'],
    'EaglercraftX_1.8_WASM-GC.html':                  ['1.8.8', 'Release', 'EaglercraftX 1.8.8 WASM-GC.'],
    'wispcraft-EaglercraftX_1.8_WASM-GC.html':        ['1.8.8 Wispcraft', 'Release', '1.8.8 WASM-GC with Wispcraft relays.'],
    'Eaglercraft-1.8_wasm-wispcraft.html':            ['1.8.8 Wispcraft', 'Release', '1.8.8 WASM with Wispcraft relays.'],
    'Eaglercraft 1.8.8 JS.html':                      ['1.8.8 JS', 'Release', 'EaglercraftX 1.8.8 JavaScript build.'],
    'Eaglercraft 1.7.10-Javascript.html':             ['1.7.10', 'Release', 'Eaglercraft 1.7.10 — the modding king.'],
    'Eaglercraft-1.7-wasm.html':                      ['1.8.8', 'Release', 'EaglercraftX 1.8 WASM (1.7 skin pack).'],
    'Eaglercraft 1.6.4.html':                         ['1.6.4', 'Release', 'Eaglercraft 1.6.4.'],
    'Eaglercraft-1.6.4-Forge.html':                   ['1.6.4 Forge', 'Release', 'Eaglercraft 1.6.4 with Forge.'],
    'Eaglercraft-1.6.4-Forge-WASM.html':              ['1.6.4 Forge', 'Release', 'Eaglercraft 1.6.4 Forge, WASM.'],
    '1.5.2.html':                                     ['1.5.2', 'Release', 'Eaglercraft 1.5.2.'],
    'Eaglercraft-1.5.2.html':                         ['1.5.2', 'Release', 'Eaglercraft 1.5.2.'],
    'Eaglercraft-1.5.2-WASM-GC.html':                 ['1.5.2', 'Release', 'Eaglercraft 1.5.2 WASM-GC.'],
    'Eaglercraft-1.5-wispcraft.html':                 ['1.5.2 Wispcraft', 'Release', '1.5.2 with Wispcraft relays.'],
    'Eaglercraft_1.4.7-JS.html':                      ['1.4.7', 'Release', 'Eaglercraft 1.4.7 (The Pretty Scary Update).'],
    'Eaglercraft_1.4.7-WASM.html':                    ['1.4.7', 'Release', 'Eaglercraft 1.4.7, WASM.'],
    'Eaglercraft_1_3_2.html':                         ['1.3.2', 'Release', 'Eaglercraft 1.3.2.'],
    'Eaglercraft_1.2.5_JS.html':                      ['1.2.5', 'Release', 'Eaglercraft 1.2.5.'],
    'Eaglercraft_1.2.5_wasm.html':                    ['1.2.5', 'Release', 'Eaglercraft 1.2.5, WASM.'],
    'Eaglercraft_1.2.3_JS.html':                      ['1.2.3', 'Release', 'Eaglercraft 1.2.3.'],
    'Eaglercraft_1.2.3_WASM-GC.html':                 ['1.2.3', 'Release', 'Eaglercraft 1.2.3 WASM-GC.'],
    'Eaglercraft_1.1.html':                           ['1.1', 'Release', 'Eaglercraft 1.1.'],
    'Eaglercraft-1.0.html':                           ['1.0.0', 'Release', 'Eaglercraft 1.0.0 — the gold release.'],
    'Eaglercraft-1.0-WASM-GC.html':                   ['1.0.0', 'Release', 'Eaglercraft 1.0.0 WASM-GC.'],
    'Eaglercraft_1_0_0.html':                         ['1.0.0', 'Release', 'Eaglercraft 1.0.0.'],

    // ---- Beta
    'Eaglercraft_Beta_1.9_pre_5.html':                ['Beta 1.9 pre 5', 'Beta', 'Beta 1.9 Pre-release 5 — the End and the dragon.'],
    'Eaglercraft_Beta_1.9_pre_5_WASM.html':           ['Beta 1.9 pre 5', 'Beta', 'Beta 1.9 Pre-5, WASM.'],
    'Eaglercraft beta 1.8.1.html':                    ['Beta 1.8.1', 'Beta', 'Beta 1.8.1 — Adventure Update part 1.'],
    'Eaglercraft beta 1.8.1_WASM.html':               ['Beta 1.8.1', 'Beta', 'Beta 1.8.1, WASM.'],
    'Beta_1.7.3.html':                                ['Beta 1.7.3', 'Beta', 'Beta 1.7.3 — pistons, the legend.'],
    'Beta-1.6.4.html':                                ['Beta 1.6.4', 'Beta', 'Beta 1.6.4.'],
    'Eaglercraft beta 1.6-tb3.html':                  ['Beta 1.6 tb3', 'Beta', 'Beta 1.6 tech build 3.'],
    'Eaglercraft beta 1.6-tb3-wasm.html':             ['Beta 1.6 tb3', 'Beta', 'Beta 1.6 tech build 3, WASM.'],
    'Eaglercraft Beta 1.5_01.html':                   ['Beta 1.5_01', 'Beta', 'Beta 1.5_01 — weather and achievements.'],
    'Eaglercraft Beta 1.4.html':                      ['Beta 1.4', 'Beta', 'Beta 1.4 — wolves.'],
    'Eaglercraft_Beta_1.4_01.html':                   ['Beta 1.4_01', 'Beta', 'Beta 1.4_01.'],
    'Eaglercraft-Beta-1.3-JS.html':                   ['Beta 1.3', 'Beta', 'Beta 1.3 — beds and repeaters.'],
    'Eaglercraft-Beta-1.3-WASM.html':                 ['Beta 1.3', 'Beta', 'Beta 1.3, WASM.'],
    'eaglercraft-beta-1.3.html':                      ['Beta 1.3', 'Beta', 'Beta 1.3.'],
    'Eaglercraft_Beta-1.2_02.html':                   ['Beta 1.2_02', 'Beta', 'Beta 1.2_02 — sandstone and note blocks.'],
    'Eaglercraft_Beta_1.1_02-JAVS.html':              ['Beta 1.1_02', 'Beta', 'Beta 1.1_02.'],
    'Eaglercraft_Beta_1.0.2.html':                    ['Beta 1.0.2', 'Beta', 'Beta 1.0.2.'],
    'Eaglercraft_b1.1.html':                          ['Beta 1.1', 'Beta', 'Beta 1.1.'],

    // ---- Alpha
    'eaglercraft-alpha-1.2.6.html':                   ['Alpha 1.2.6', 'Alpha', 'Alpha 1.2.6 — the last Alpha.'],
    'eaglercraft-alpha-1.2.6-WASM.html':              ['Alpha 1.2.6', 'Alpha', 'Alpha 1.2.6, WASM.'],
    'Eaglercraft_Alpha_1.1.2_01.html':                ['Alpha 1.1.2_01', 'Alpha', 'Alpha 1.1.2_01 — the Nether.'],
    'Eaglercraft alpha 1.0.16_02-JS.html':            ['Alpha 1.0.16_02', 'Alpha', 'Alpha 1.0.16_02.'],
    'Eaglercraft alpha 1.0.16_02-WASM.html':          ['Alpha 1.0.16_02', 'Alpha', 'Alpha 1.0.16_02, WASM.'],
    'Eaglercraft Alpha 1.0.6_03.html':                ['Alpha 1.0.6_03', 'Alpha', 'Alpha 1.0.6_03 — boats and minecarts.'],
    'Alpha 1.0.4-JS.html':                            ['Alpha 1.0.4', 'Alpha', 'Alpha 1.0.4.'],
    'Alpha 1.0.1_01-JS.html':                         ['Alpha 1.0.1_01', 'Alpha', 'Alpha 1.0.1_01 — where it all began.'],

    // ---- Indev / Infdev
    'Eaglercraft Indev 20100219-JS.html':             ['Indev 20100219', 'Indev', 'Indev 20100219.'],
    'Eaglercraft Indev 20100219-WASM.html':           ['Indev 20100219', 'Indev', 'Indev 20100219, WASM.'],
    'Eaglercraft_indev 20100223_JS.html':             ['Indev 20100223', 'Indev', 'Indev 20100223.'],
    'Eaglercraft_indev 20100223_WASM.html':           ['Indev 20100223', 'Indev', 'Indev 20100223, WASM.'],
    'Eaglercraft_indev_20100233.html':                ['Indev 20100233', 'Indev', 'Indev 20100233.'],
    'Eaglercraft_indev_20100233-wasm.html':           ['Indev 20100233', 'Indev', 'Indev 20100233, WASM.'],
    'Indev_20100214_JS.html':                         ['Indev 20100214', 'Indev', 'Indev 20100214.'],
    'Indev_20100214_WASM-GC.html':                    ['Indev 20100214', 'Indev', 'Indev 20100214 WASM-GC.'],
    'eagler-indev.html':                              ['Indev (early)', 'Indev', 'The earliest Indev build.'],
    'infdev-wasm-gc.html':                            ['Infdev', 'Infdev', 'Infdev — infinite terrain arrives.'],

    // ---- Classic
    'Classic 0.30-JS.html':                           ['Classic 0.30', 'Classic', 'Classic 0.30.'],
    'classic-0.30_WASM.html':                         ['Classic 0.30', 'Classic', 'Classic 0.30, WASM.'],
    'Classic 0.25_5-JS.html':                         ['Classic 0.25_5', 'Classic', 'Classic 0.25_5.'],
    'Classic 0.25_5-WASM.html':                       ['Classic 0.25_5', 'Classic', 'Classic 0.25_5, WASM.'],
    'Classic 0.24_3-JS.html':                         ['Classic 0.24_3', 'Classic', 'Classic 0.24_3.'],
    'Classic 0.24_3-WASM.html':                       ['Classic 0.24_3', 'Classic', 'Classic 0.24_3, WASM.'],
    'Classic 0.0.23a_01-JS.html':                     ['Classic 0.0.23a_01', 'Classic', 'Classic 0.0.23a_01.'],
    'Classic 0.0.23a_01-WASM.html':                   ['Classic 0.0.23a_01', 'Classic', 'Classic 0.0.23a_01, WASM.'],
    'Classic 0.0.22a_5-JS.html':                      ['Classic 0.0.22a_5', 'Classic', 'Classic 0.0.22a_5.'],
    'Classic 0.0.22a_5-WASM.html':                    ['Classic 0.0.22a_5', 'Classic', 'Classic 0.0.22a_5, WASM.'],
    'Classic 0.0.21a-JS.html':                        ['Classic 0.0.21a', 'Classic', 'Classic 0.0.21a.'],
    'Classic 0.0.21a-WASM.html':                      ['Classic 0.0.21a', 'Classic', 'Classic 0.0.21a, WASM.'],
    'Classic 0.0.20_2-JS.html':                       ['Classic 0.0.20_2', 'Classic', 'Classic 0.0.20_2.'],
    'Classic 0.0.20_2-WASM.html':                     ['Classic 0.0.20_2', 'Classic', 'Classic 0.0.20_2, WASM.'],
    'Classic 0.0.19a_6-JS.html':                      ['Classic 0.0.19a_6', 'Classic', 'Classic 0.0.19a_6.'],
    'Classic 0.0.19a_6-WASM.html':                    ['Classic 0.0.19a_6', 'Classic', 'Classic 0.0.19a_6, WASM.'],
    'Classic 0.0.18a_2-JS.html':                      ['Classic 0.0.18a_2', 'Classic', 'Classic 0.0.18a_2.'],
    'Classic 0.0.18a_2-WASM.html':                    ['Classic 0.0.18a_2', 'Classic', 'Classic 0.0.18a_2, WASM.'],
    'Classic 0.0.17a-JS.html':                        ['Classic 0.0.17a', 'Classic', 'Classic 0.0.17a.'],
    'Classic 0.0.17a-WASM.html':                      ['Classic 0.0.17a', 'Classic', 'Classic 0.0.17a, WASM.'],
    'Classic 0.0.16a_2-JS.html':                      ['Classic 0.0.16a_2', 'Classic', 'Classic 0.0.16a_2.'],
    'Classic 0.0.16a_2-WASM.html':                    ['Classic 0.0.16a_2', 'Classic', 'Classic 0.0.16a_2, WASM.'],
    'Classic 0.0.15a-JS.html':                        ['Classic 0.0.15a', 'Classic', 'Classic 0.0.15a.'],
    'Classic 0.0.15a-WASM.html':                      ['Classic 0.0.15a', 'Classic', 'Classic 0.0.15a, WASM.'],
    'Classic 0.0.14a_8-JS.html':                      ['Classic 0.0.14a_8', 'Classic', 'Classic 0.0.14a_8.'],
    'Classic 0.0.14a_8-WASM.html':                    ['Classic 0.0.14a_8', 'Classic', 'Classic 0.0.14a_8, WASM.'],
    'Classic 0.0.13a_3-JS.html':                      ['Classic 0.0.13a_3', 'Classic', 'Classic 0.0.13a_3.'],
    'Classic 0.0.13a_3-WASM.html':                    ['Classic 0.0.13a_3', 'Classic', 'Classic 0.0.13a_3, WASM.'],
    'Classic 0.0.12a_3-JS.html':                      ['Classic 0.0.12a_3', 'Classic', 'Classic 0.0.12a_3.'],
    'Classic 0.0.12a_3-WASM.html':                    ['Classic 0.0.12a_3', 'Classic', 'Classic 0.0.12a_3, WASM.'],
    'Classic 0.0.11a-JS.html':                        ['Classic 0.0.11a', 'Classic', 'Classic 0.0.11a — the first Classic.'],
    'Classic 0.0.11a-WASM.html':                      ['Classic 0.0.11a', 'Classic', 'Classic 0.0.11a, WASM.'],

    // ---- pre-classic prototypes
    'pre-release-160052.html':                        ['rd-160052', 'Pre-Classic', 'Pre-Classic rd-160052.'],
    'rd-160052-JS.html':                              ['rd-160052', 'Pre-Classic', 'Pre-Classic rd-160052.'],
    'rd-161348-JS.html':                              ['rd-161348', 'Pre-Classic', 'Pre-Classic rd-161348.'],
    'rd-161348-WASM.html':                            ['rd-161348', 'Pre-Classic', 'Pre-Classic rd-161348, WASM.'],
    'rd-132328-JS.html':                              ['rd-132328', 'Pre-Classic', 'Pre-Classic rd-132328.'],
    'rd-132328-WASM.html':                            ['rd-132328', 'Pre-Classic', 'Pre-Classic rd-132328, WASM.'],
    'rd-132211-JS.html':                              ['rd-132211', 'Pre-Classic', 'Pre-Classic rd-132211 — the first build.'],
    'rd-132211-WASM.html':                            ['rd-132211', 'Pre-Classic', 'Pre-Classic rd-132211, WASM.'],
    'rd-131655-JS.html':                              ['rd-131655', 'Pre-Classic', 'Pre-Classic rd-131655.'],
    'rd-131655-WASM.html':                            ['rd-131655', 'Pre-Classic', 'Pre-Classic rd-131655, WASM.'],

    // ---- clients
    'Aero Client JS.html':                            ['Aero Client', 'Client', 'Aero Client — smooth 1.12.2 PvP client.'],
    'EB Client Nextgen CU4.html':                     ['EB Client Nextgen', 'Client', 'EB Client Next Generation, CU4.'],
    'Eaglercraft Mobile.html':                        ['Mobile', 'Client', 'Touch-controls build for phones and tablets.'],
    'Eaglercraft Scratch.html':                       ['Scratch Edition', 'Client', 'Scratch-style Eaglercraft.'],
    'Eaglercraft-Scratch.html':                       ['Scratch Edition', 'Client', 'Scratch-style Eaglercraft.'],
    'EaglercraftZ.html':                              ['EaglercraftZ', 'Client', 'EaglercraftZ — 1.20-era client.'],
    'eaglercraftx-194.html':                          ['EaglercraftX 1.9.4', 'Release', 'EaglercraftX on 1.9.4.'],
    'Eaglet.html':                                    ['Eaglet', 'Client', 'Eaglet — tiny, boots in seconds.'],
    'EagletWithNormalResources.html':                 ['Eaglet (vanilla assets)', 'Client', 'Eaglet with vanilla resource pack.'],
    'EaglyMC.html':                                   ['EaglyMC', 'Client', 'EaglyMC — 1.20 WASM client.'],
    'Eclipse Client.html':                            ['Eclipse Client', 'Client', 'Eclipse Client — PvP-focused 1.8.8.'],
    'Mega Client-JS.html':                            ['Mega Client', 'Client', 'Mega Client (JavaScript build).'],
    'Minicraft.html':                                 ['Minicraft', 'Extra', 'Minicraft, in the browser.'],
    'Myven-Client-WASM.html':                         ['Myven Client', 'Client', 'Myven Client — 1.8.8 WASM PvP client.'],
    'N0VA CLIENT.html':                               ['N0VA Client', 'Client', 'N0VA Client.'],
    'Precision.html':                                 ['Precision Client', 'Client', 'Precision Client — tuned PvP.'],
    'Prism-Client.html':                              ['Prism Client', 'Client', 'Prism Client.'],
    'Tuff_Client_WASM.html':                          ['Tuff Client', 'Client', 'Tuff Client — 1.12.2 feature-heavy WASM client.'],
    'Water Client.html':                              ['Water Client', 'Client', 'Water Client.'],
    'WurstX.html':                                    ['WurstX', 'Client', 'WurstX client.'],
    'PixelClient 1.8.8 JS.html':                      ['PixelClient', 'Client', 'PixelClient on 1.8.8.'],
    'Koneclient-1.8.8.html':                          ['Koneclient', 'Client', 'Koneclient 1.8.8.'],
    'eaglercraft-forge-1.0-js.html':                  ['EaglerForge 1.0', 'Client', 'EaglerForge on 1.0 (JavaScript).'],
    'eaglercraft-forge-1.0-wasm.html':                ['EaglerForge 1.0', 'Client', 'EaglerForge on 1.0 (WASM).'],
    'mc4k.html':                                      ['4K', 'Extra', 'The 4K April Fools edition.'],
    'Eaglercraft-4k-JS.html':                         ['4K', 'Extra', 'The 4K April Fools edition.'],
    'wispcraft-Eaglercraft-1.12.html':                ['1.12.2 Wispcraft', 'Release', '1.12.2 with Wispcraft relays.'],
    'wispcraft-eaglercraft-js.html':                  ['Wispcraft Legacy', 'Release', 'Wispcraft legacy JavaScript build.']
  };

  /* Files that are tools rather than games — never show these. */
  const SKIP = /^(injector|README|\.gitattributes|\.github)/i;

  const EPOCH_ORDER = [
    'Pre-Classic', 'Classic', 'Indev', 'Infdev', 'Alpha', 'Beta',
    'Release', 'Snapshot', 'Client', 'Extra'
  ];

  const EPOCH_BLURB = {
    'Pre-Classic': 'Where it started — 2009 tech demos, blocks and nothing else.',
    'Classic': 'Creative-mode Classic builds from the summer of 2009.',
    'Indev': 'Survival, mining and dynamic lighting, late 2009.',
    'Infdev': 'Infinite terrain generation arrives.',
    'Alpha': 'Alpha — redstone, the Nether, the birth of multiplayer.',
    'Beta': 'The Beta era that made Minecraft famous.',
    'Release': 'Full releases, 1.0 through the newest browser builds.',
    'Snapshot': 'Cutting-edge builds — mostly WASM, occasionally rough.',
    'Client': 'Community clients: PvP, HUDs, mods and quality of life.',
    'Extra': 'Novelty builds, mobile editions and one-offs.'
  };

  /* ---------------------------------------------------------- build index */
  let _all = null;
  let _built = false;
  /* ------------------------------------------------------- live fetching */
  /* The manifests in builds-data.js are a verified snapshot. This pulls the
     current file list of every publisher so uploads show up without a new
     launcher release. jsDelivr is used because it returns a clean JSON file
     tree and sends CORS headers; raw.githubusercontent and api.github.com
     either redirect or rate-limit anonymous browser requests. */

  const LIVE_CACHE_KEY = 'gxLiveManifests';
  const LIVE_MAX_AGE_MS = 6 * 60 * 60 * 1000;   // 6 hours

  /* A live response replaces the snapshot for that publisher, so deleted
     uploads disappear too. The guard below refuses a response that looks
     truncated: a real manifest is always close in size to the snapshot. */
  function applyLiveFiles(family, files) {
    const srcs = (window.GX_BUILD_SOURCES || []).filter(s => s.family === family && !s.unavailable);
    if (!srcs.length || !Array.isArray(files) || !files.length) return 0;
    const snapshot = srcs[0].files || [];
    if (files.length < snapshot.length * 0.5) return 0;   // suspiciously short
    let added = 0, removed = 0;
    const next = files.slice();
    for (const f of next) if (!snapshot.includes(f)) added++;
    for (const f of snapshot) if (!next.includes(f)) removed++;
    if (!added && !removed) return 0;
    for (const src of srcs) src.files = next.slice();
    return added + removed;
  }

  function readLiveCache() {
    try {
      const raw = JSON.parse(localStorage.getItem(LIVE_CACHE_KEY) || 'null');
      if (!raw || !raw.at || Date.now() - raw.at > LIVE_MAX_AGE_MS) return null;
      return raw.data || null;
    } catch (e) { return null; }
  }

  function writeLiveCache(data) {
    try {
      localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
    } catch (e) { /* quota — ignore */ }
  }

  /* Fetch the current file list for every repository. Returns
     { apex: [...], play: [...], arham: [...] } with only .html files. */
  async function fetchLiveManifests(force) {
    if (!force) {
      const cached = readLiveCache();
      if (cached) return cached;
    }
    const repos = window.GX_REPOS || [];
    const out = {};
    await Promise.all(repos.map(async r => {
      const url = 'https://data.jsdelivr.com/v1/packages/gh/' + r.repo + '@' + r.ref + '?structure=flat';
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 15000);
        const res = await fetch(url, { signal: ctrl.signal, credentials: 'omit' });
        clearTimeout(t);
        if (!res.ok) return;
        const json = await res.json();
        /* Tiny files are placeholders, not builds — TheCookeringYT/play has a
           134-byte "Eaglercraft 1.16.5.html" stub that would launch a blank
           page. Anything under 4 KB is filtered out. */
        const files = (json.files || [])
          .filter(f => !f.size || f.size >= 4096)
          .map(f => String(f.name || '').replace(/^\/+/, ''))
          .filter(f => /\.html?$/i.test(f) && !f.includes('/'));
        if (files.length) out[r.family] = files;
      } catch (e) { /* keep the verified snapshot for this repo */ }
    }));
    if (Object.keys(out).length) writeLiveCache(out);
    return out;
  }

  /* Merge live results into the sources and rebuild the index. */
  function mergeLive(data) {
    if (!data) return 0;
    let added = 0;
    for (const family of Object.keys(data)) added += applyLiveFiles(family, data[family]);
    if (added) _all = null;
    return added;
  }

  /* Called on page load. Adds new builds silently, then repaints the picker
     if the dropdown is already open. */
  async function refreshCatalog(opts) {
    const force = !!(opts && opts.force);
    const before = buildIndex().length;
    const data = await fetchLiveManifests(force);
    const added = mergeLive(data);
    const after = buildIndex().length;
    if (added || after !== before) {
      const list = document.getElementById('gx-dropdown-list');
      if (list && list.innerHTML.trim()) renderDropdown(state.q || '');
      const line = document.getElementById('play-catalog-line');
      if (line && window.paintCatalogLine) window.paintCatalogLine();
    }
    return { added, total: after, tried: Object.keys(data).length };
  }

  function liveStatus() {
    const cached = readLiveCache();
    if (!cached) return null;
    return { families: Object.keys(cached), stale: false };
  }


  function canonicalKey(file) {
    // Two mirrors use slightly different names for the same build.
    const k = file.toLowerCase().replace(/\.html?$/, '');
    const alias = {
      'eaglercraft 1.8.8 ': 'eaglercraft-1.8.8',
      'eaglercraft_1_0_0': 'eaglercraft-1.0.0',
      'eaglercraft_1_3_2': 'eaglercraft-1.3.2',
      'eaglercraft_beta-1.2_02': 'eaglercraft-beta-1.2_02',
      'eaglercraft_beta_1.1_02-javs': 'eaglercraft-beta-1.1_02',
      'eaglercraft_beta_1.4_01': 'eaglercraft-beta-1.4_01',
      'eaglercraft_beta_1.0.2': 'eaglercraft-beta-1.0.2',
      '1.5.2': 'eaglercraft-1.5.2',
      'classic-0.30_wasm': 'classic-0.30-wasm',
      'classic 0.30-js': 'classic-0.30',
      'eaglercraft beta 1.8.1_wasm': 'eaglercraft beta 1.8.1 wasm',
      'eaglercraft-4k-js': 'mc4k'
    };
    return alias[k] || k;
  }

  function slugFor(name, file) {
    return file.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70);
  }

  function guessFromFile(file) {
    // "Eaglercraft_1.14.4_WASM-GC.html" -> version + tech
    const clean = file.replace(/\.html?$/i, '').replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
    const vm = clean.match(/(\d+\.\d+(?:\.\d+)?[a-z]?)/i);
    const version = vm ? vm[1] : clean;
    const isWasm = /wasm/i.test(clean);
    return { version, isWasm };
  }

  /* A label that disagrees with its own filename (e.g. a 1.7.10 file tagged
     1.8.8) would launch the wrong build. Trust the filename for the version. */
  function reconcileName(name, file) {
    const ver = /(\d+\.\d+(?:\.\d+)?)/;
    const fv = (file.match(ver) || [])[1];
    const nv = (name.match(ver) || [])[1];
    if (!fv || !nv || fv === nv) return name;
    const major = v => v.split('.').slice(0, 2).join('.');
    if (major(fv) === major(nv)) return name;          // 1.8 vs 1.8.8 — close enough
    return name.split(nv).join(fv);
  }

  function buildIndex() {
    if (_all) return _all;
    const sources = window.GX_BUILD_SOURCES || [];
    const map = new Map();

    for (const src of sources) {
      for (const file of src.files) {
        if (SKIP.test(file)) continue;
        const key = canonicalKey(file);
        const meta = KNOWN[file];
        let entry = map.get(key);
        if (!entry) {
          const guess = guessFromFile(file);
          const name = reconcileName(meta ? meta[0] : guess.version, file);
          const epoch = meta ? meta[1] : (guess.isWasm ? 'Release' : 'Release');
          entry = {
            id: slugFor(name, file),
            name: name,
            epoch: epoch,
            blurb: (meta ? meta[2] : 'Eaglercraft build — ' + file.replace(/\.html?$/i, ''))
                   .replace(/\s*Bundled.*$/i, ''),
            tech: /wasm/i.test(file) ? 'wasm' : 'js',
            mirrors: [],
            file: file,
            isMobile: /mobile/i.test(file),
            isWisp: /wispcraft/i.test(file),
            isForge: /forge/i.test(file),
            isClient: /client|eagly|eaglet|myven|precision|prism|wurst|nova|eclipse|aero|tuff|kone|pixel/i.test(file)
          };
          map.set(key, entry);
        }
        entry.mirrors.push({ id: src.id, label: src.label, url: src.base + encodeURIComponent(file).replace(/%2F/g, '/') });
        if (meta && meta[1] !== 'Release') entry.epoch = meta[1];
        if (/wasm/i.test(file)) entry.tech = 'wasm';
      }
    }

    _all = [...map.values()];

    // Two entries can end up with the same display name (1.8.8 JS vs 1.8.8
    // WASM, for example). Disambiguate instead of showing duplicates.
    const seen = new Map();
    for (const b of _all) {
      const k = b.epoch + '|' + b.name;
      seen.set(k, (seen.get(k) || 0) + 1);
    }
    for (const b of _all) {
      if (seen.get(b.epoch + '|' + b.name) > 1) {
        const suffix = b.tech === 'wasm' ? 'WASM' : 'JS';
        b.name = b.name + ' (' + suffix + ')';
      }
      b.label = (b.epoch === 'Client' || b.epoch === 'Extra') ? b.name : 'Eaglercraft ' + b.name;
    }

    attachLocalBuilds(_all);

    // stable, sensible ordering: epoch, then version descending
    const rank = Object.fromEntries(EPOCH_ORDER.map((e, i) => [e, i]));
    const ver = b => {
      const m = String(b.name).match(/(\d+)\.(\d+)(?:\.(\d+))?/);
      return m ? [+m[1], +m[2], +(m[3] || 0)] : [0, 0, 0];
    };
    _all.sort((a, b) => {
      const ra = rank[a.epoch] ?? 99, rb = rank[b.epoch] ?? 99;
      if (ra !== rb) return ra - rb;
      const va = ver(a), vb = ver(b);
      for (let i = 0; i < 3; i++) if (va[i] !== vb[i]) return vb[i] - va[i];
      return a.name.localeCompare(b.name);
    });
    return _all;
  }

  /* ---------------------------------------------------------- state */
  const state = { q: '', epoch: 'All', tech: 'all', sort: 'default' };
  GX.catalogState = state;

  function haystack(b) {
    if (b._hay) return b._hay;
    b._hay = [b.name, b.epoch, b.blurb, b.mirrors.map(m => m.label).join(' '),
      b.tech, b.isWisp ? 'wispcraft' : '', b.isForge ? 'forge mods' : '',
      b.isMobile ? 'mobile phone touch' : '', b.isClient ? 'client pvp' : '']
      .filter(Boolean).join(' ').toLowerCase();
    return b._hay;
  }

  function filtered() {
    let list = buildIndex();
    if (state.epoch !== 'All') list = list.filter(b => b.epoch === state.epoch);
    if (state.tech === 'wasm') list = list.filter(b => b.tech === 'wasm');
    if (state.tech === 'js') list = list.filter(b => b.tech === 'js');
    const q = state.q.trim().toLowerCase();
    if (q) {
      const toks = q.split(/\s+/);
      list = list.filter(b => { const h = haystack(b); return toks.every(t => h.includes(t)); });
    }
    if (state.sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (state.sort === 'newest' || state.sort === 'oldest') {
      const sign = state.sort === 'newest' ? -1 : 1;
      list = [...list].sort((a, b) => sign * (EPOCH_ORDER.indexOf(a.epoch) - EPOCH_ORDER.indexOf(b.epoch)) ||
        sign * a.name.localeCompare(b.name));
    }
    return list;
  }

  /* --------------------------------------------------- local (offline) builds */
  /* game/<folder>/index.html ships with the launcher. When a folder matches a
     remote build, that build gets an extra mirror that is same-origin, so it
     launches instantly and works offline. Local-only builds are added too. */
  const LOCAL_BASE = (function () {
    try { return new URL('game/', location.href).href; } catch (e) { return 'game/'; }
  })();

  function localUrlFor(folder) {
    return LOCAL_BASE + folder.split('/').map(encodeURIComponent).join('/') + '/index.html';
  }

  /* Compare names ignoring case, spaces, dashes and the .html suffix. */
  function norm(x) {
    return String(x || '')
      .toLowerCase()
      .replace(/\.html?$/, '')
      .replace(/^eaglercraft[\s_-]*/, '')
      .replace(/[^a-z0-9.]/g, '');
  }

  /* "classic-0.0.25a-05-wasm" -> { epoch:'Classic', version:'0.0.25a-05', wasm:true } */
  const FOLDER_EPOCHS = [
    ['pre-classic', 'Pre-Classic'], ['preclassic', 'Pre-Classic'],
    ['classic', 'Classic'], ['indev', 'Indev'], ['infdev', 'Infdev'],
    ['alpha', 'Alpha'], ['beta', 'Beta']
  ];

  function parseFolder(folder) {
    const wasm = /-wasm$/i.test(folder);
    let stem = folder.replace(/-wasm$/i, '').replace(/-js$/i, '').trim();
    let epoch = null, prefix = '';
    for (const [pre, name] of FOLDER_EPOCHS) {
      if (stem.toLowerCase() === pre) { epoch = name; prefix = pre; stem = ''; break; }
      if (stem.toLowerCase().startsWith(pre + '-')) {
        epoch = name; prefix = pre;
        stem = stem.slice(pre.length + 1);
        break;
      }
    }
    // an epoch-only folder ("indev", "infdev") is keyed by its epoch word
    return { epoch, bare: stem === '', version: stem || prefix || folder, wasm };
  }

  function folderLabel(folder) {
    const p = parseFolder(folder);
    let label;
    if (p.bare && p.epoch) label = p.epoch;
    else if (p.epoch && /^\d/.test(p.version)) label = p.epoch + ' ' + p.version;
    else label = p.version;
    return p.wasm ? label + ' (WASM)' : label;
  }

  /* Exact-name matching only. A loose "contains" test happily pairs
     "The Broken Script 1.8.8" with plain 1.8.8, which would launch the
     wrong build — worse than having no bundled copy. */
  function matchLocalFolders(build) {
    const folders = window.GX_LOCAL_BUILDS || [];
    const keys = [norm(build.file), norm(build.name), norm(build.label), norm(build.name.replace(/\(.*\)/, ''))]
      .filter(Boolean);
    const out = [];
    for (const folder of folders) {
      const p = parseFolder(folder);
      if (p.wasm !== (build.tech === 'wasm')) continue;
      const fk = norm(folder);
      const vk = norm(p.version);
      const hit = keys.some(k => {
        const km = k.replace(/js$/, '').replace(/wasmwispcraft$/, 'wasm');
        return k === fk || k === vk || km === vk || km === fk ||
          (k.length > 2 && (fk === k + '-js' || fk === k + '-wasm'));
      });
      if (hit) out.push(folder);
    }
    return out.slice(0, 1);
  }

  function attachLocalBuilds(list) {
    const folders = window.GX_LOCAL_BUILDS || [];
    if (!folders.length) return;
    const claimed = new Set();
    for (const b of list) {
      const matches = matchLocalFolders(b);
      if (!matches.length) continue;
      b.localFolders = matches;
      claimed.add(matches[0]);
      // same-origin copy first: no probe needed, works offline
      b.mirrors.unshift({ id: 'local', label: 'Bundled (offline)', url: localUrlFor(matches[0]), local: true });
    }
    // anything left over becomes its own entry so nothing ships unreachable
    for (const folder of folders) {
      if (claimed.has(folder)) continue;
      const p = parseFolder(folder);
      const isClient = /client|eaglet|eagly|forge|huzzium|kozmo|larp|modern|astra|nova|wurst|prism|precision|myven|kone|pixel|reflex|tuff|aero|eclipse|water|mega|chromium|4k|mini|scratch|mobile|shadow|broken/i.test(folder);
      const label = folderLabel(folder);
      list.push({
        id: slugFor(label, folder) + '-local',
        name: isClient ? p.version.replace(/-/g, ' ') + (p.wasm ? ' (WASM)' : '') : 'Eaglercraft ' + label,
        label: label,
        epoch: isClient ? 'Client' : (p.epoch || 'Release'),
        blurb: 'Bundled build — ships with the launcher and runs without a connection.',
        tech: p.wasm ? 'wasm' : 'js',
        mirrors: [{ id: 'local', label: 'Bundled (offline)', url: localUrlFor(folder), local: true }],
        localFolders: [folder],
        file: folder + '/index.html',
        isMobile: /mobile/i.test(folder),
        isWisp: false,
        isForge: /forge/i.test(folder),
        isClient
      });
    }
  }

  function parseEpoch(version) {
    const v = version.toLowerCase();
    if (/^rd-/.test(v)) return 'Pre-Classic';
    if (/^classic/.test(v)) return 'Classic';
    if (/^indev/.test(v)) return 'Indev';
    if (/^infdev/.test(v)) return 'Infdev';
    if (/^alpha/.test(v)) return 'Alpha';
    if (/^beta/.test(v)) return 'Beta';
    return 'Release';
  }

  function byId(id) { return buildIndex().find(b => b.id === id) || null; }

  function counts() {
    const byEpoch = {}, byTech = { wasm: 0, js: 0 };
    const all = buildIndex();
    for (const b of all) {
      byEpoch[b.epoch] = (byEpoch[b.epoch] || 0) + 1;
      byTech[b.tech]++;
    }
    return { total: all.length, byEpoch, byTech };
  }

  /* ---------------------------------------------------------- rendering */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function rowHtml(b) {
    const badges = [];
    if (b.mirrors.some(m => m.local)) badges.push('<span class="gx-tag local">OFFLINE</span>');
    if (b.tech === 'wasm') badges.push('<span class="gx-tag wasm">WASM</span>');
    if (b.isWisp) badges.push('<span class="gx-tag">WISPCRAFT</span>');
    if (b.isForge) badges.push('<span class="gx-tag">FORGE</span>');
    if (b.isMobile) badges.push('<span class="gx-tag">MOBILE</span>');
    return `<div class="version-option" data-id="${esc(b.id)}" title="${esc(b.blurb || b.name)}">
      <img src="resources/main.png" onerror="this.style.display='none'" loading="lazy" alt="">
      <span>${esc(b.name)}</span>
      ${badges.join('')}
    </div>`;
  }

  /* --- compact picker used in the top bar of every page --- */
  function renderDropdown(query) {
    const host = document.getElementById('version-dropdown');
    if (!host) return;
    const listHost = document.getElementById('gx-dropdown-list') || host;
    const saved = state.q;
    state.q = (query == null ? '' : query);

    const cfg = counts();
    let html = '';
    const chips = ['All', ...EPOCH_ORDER.filter(e => cfg.byEpoch[e])];
    html += `<div class="gx-chiprow">` + chips.map(e =>
      `<button type="button" class="gx-chip${state.epoch === e ? ' on' : ''}" data-epoch="${esc(e)}">${esc(e)}<b>${e === 'All' ? cfg.total : cfg.byEpoch[e]}</b></button>`
    ).join('') + `</div>`;

    const list = filtered();
    if (!list.length) {
      html += `<div class="gx-empty">Nothing matches “${esc(state.q)}”.</div>`;
    }
    let lastEpoch = null;
    for (const b of list) {
      if (b.epoch !== lastEpoch) {
        html += `<div class="version-group-label">${esc(b.epoch)}</div>`;
        lastEpoch = b.epoch;
      }
      html += rowHtml(b);
    }
    listHost.innerHTML = html;
    state.q = saved;

    listHost.querySelectorAll('.version-option').forEach(el => {
      el.onclick = e => {
        e.stopPropagation();
        const b = byId(el.dataset.id);
        if (b) GX.pickBuild(b);
      };
    });
    listHost.querySelectorAll('.gx-chip').forEach(el => {
      el.onclick = e => {
        e.stopPropagation();
        state.epoch = el.dataset.epoch;
        renderDropdown(document.getElementById('version-search')?.value || '');
      };
    });
  }

  GX.catalog = {
    all: buildIndex, filtered, byId, counts, renderDropdown,
    EPOCH_ORDER, EPOCH_BLURB, esc,
    refresh: refreshCatalog, fetchLive: fetchLiveManifests, liveStatus
  };

  // Pull the live file lists once the page is idle. A failure is silent —
  // the verified snapshot in builds-data.js still gives a full catalogue.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => refreshCatalog(), 1200));
  } else {
    setTimeout(() => refreshCatalog(), 1200);
  }
})();
