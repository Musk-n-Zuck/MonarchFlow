/**
 * Solo Leveling themed colors for light and dark modes
 */

const tintColorLight = '#0ea5e9'; // gate blue
const tintColorDark = '#60a5fa'; // lighter gate blue

export const Colors = {
  light: {
    text: '#0f172a', // shadow-900
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#64748b', // shadow-500
    tabIconDefault: '#94a3b8', // shadow-400
    tabIconSelected: tintColorLight,
    
    // Solo Leveling specific colors
    essence: '#d97706', // essence-600
    mana: '#3b82f6', // mana-500
    gate: '#0ea5e9', // gate-500
    shadow: '#334155', // shadow-700
    
    // UI elements
    card: '#f8fafc', // shadow-50
    border: '#e2e8f0', // shadow-200
    input: '#ffffff',
    placeholder: '#94a3b8', // shadow-400
  },
  dark: {
    text: '#f1f5f9', // shadow-100
    background: '#0f172a', // shadow-900
    tint: tintColorDark,
    icon: '#94a3b8', // shadow-400
    tabIconDefault: '#64748b', // shadow-500
    tabIconSelected: tintColorDark,
    
    // Solo Leveling specific colors
    essence: '#fbbf24', // essence-400
    mana: '#60a5fa', // mana-400
    gate: '#38bdf8', // gate-400
    shadow: '#cbd5e1', // shadow-300
    
    // UI elements
    card: '#1e293b', // shadow-800
    border: '#334155', // shadow-700
    input: '#334155', // shadow-700
    placeholder: '#64748b', // shadow-500
  },
};