// ===========================================================================
// LifeXP RPG - Game Engine v1.0
// Bloque 1: Estructura base + Sistema de tareas + Stats
// ===========================================================================

const LIFE_XP_BUILD = 'v13.4-equip-action-fix';

// ===========================================================================
// CONSTANTS
// ===========================================================================

const CATEGORIES = {
  casa: { name: 'Casa', icon: '\uD83C\uDFE0', color: '#f87171' },
  cuerpo: { name: 'Cuerpo', icon: '\uD83D\uDCAA', color: '#4ade80' },
  gestiones: { name: 'Gestiones', icon: '\uD83D\uDCCB', color: '#fbbf24' },
  social: { name: 'Social', icon: '\uD83D\uDC65', color: '#60a5fa' },
  personal: { name: 'Personal', icon: '\uD83C\uDF1F', color: '#a78bfa' }
};

const STATS = {
  fue: { name: 'Fuerza', abbr: 'FUE', color: '#ef4444' },
  vit: { name: 'Vitalidad', abbr: 'VIT', color: '#22c55e' },
  des: { name: 'Destreza', abbr: 'DES', color: '#3b82f6' },
  int: { name: 'Intelecto', abbr: 'INT', color: '#a855f7' },
  vol: { name: 'Voluntad', abbr: 'VOL', color: '#f59e0b' },
  pre: { name: 'Presencia', abbr: 'PRE', color: '#ec4899' }
};

const FREQ = {
  daily: { name: 'Diaria', days: 1 },
  weekly: { name: 'Semanal', days: 7 },
  biweekly: { name: 'Quincenal', days: 14 },
  monthly: { name: 'Mensual', days: 30 },
  quarterly: { name: 'Trimestral', days: 90 },
  biannual: { name: 'Semestral', days: 180 },
  annual: { name: 'Anual', days: 365 }
};