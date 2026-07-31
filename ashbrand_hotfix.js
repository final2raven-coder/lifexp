// LifeXP - ashbrand_hotfix.js
// STUB DE COMPATIBILIDAD - Fase D del saneamiento (2026-07-31)
//
// Toda la logica que vivia aqui ha sido absorbida por inventory_system.js:
//   - normalizeItemText         -> window.normalizeItemText  (alias de text())
//   - emergencyRerollLegacyItem -> window.emergencyRerollLegacyItem
//
// Este fichero se mantiene vacio para no romper el orden de carga definido
// en index.html ni la lista de assets del Service Worker (sw.js).
// Se eliminara fisicamente en la Fase G (split de game.js), cuando se
// actualicen index.html y sw.js de forma planificada.
