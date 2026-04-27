export const PROCESS_COLORS = [
  { fill: '#00e5ff', text: '#0a0e1a', glow: 'rgba(0,229,255,0.4)' },
  { fill: '#ff6b35', text: '#0a0e1a', glow: 'rgba(255,107,53,0.4)' },
  { fill: '#a855f7', text: '#ffffff', glow: 'rgba(168,85,247,0.4)' },
  { fill: '#22d3ee', text: '#0a0e1a', glow: 'rgba(34,211,238,0.4)' },
  { fill: '#fbbf24', text: '#0a0e1a', glow: 'rgba(251,191,36,0.4)' },
  { fill: '#f87171', text: '#0a0e1a', glow: 'rgba(248,113,113,0.4)' },
  { fill: '#4ade80', text: '#0a0e1a', glow: 'rgba(74,222,128,0.4)' },
  { fill: '#e879f9', text: '#0a0e1a', glow: 'rgba(232,121,249,0.4)' },
];

export const STATE_COLORS = {
  NEW: { bg: '#1e2d40', text: '#94a3b8', border: '#334155' },
  READY: { bg: '#1a2e1a', text: '#4ade80', border: '#166534' },
  RUNNING: { bg: '#1a2010', text: '#fbbf24', border: '#854d0e' },
  WAITING: { bg: '#2d1a2d', text: '#e879f9', border: '#7e22ce' },
  TERMINATED: { bg: '#1a1a1a', text: '#64748b', border: '#374151' },
};

export function getProcessColor(idx) {
  return PROCESS_COLORS[idx % PROCESS_COLORS.length];
}

export function getPidColor(pid, processes) {
  const idx = processes.findIndex(p => p.pid === pid);
  return idx >= 0 ? getProcessColor(idx) : { fill: '#475569', text: '#e2e8f0', glow: 'transparent' };
}
