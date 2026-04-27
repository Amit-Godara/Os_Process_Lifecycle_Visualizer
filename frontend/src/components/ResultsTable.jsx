import React from 'react';
import { getPidColor } from '../utils/colors';

export default function ResultsTable({ results, processes }) {
  if (!results || results.length === 0) return null;

  const cols = [
    { key: 'pid', label: 'PID' },
    { key: 'arrivalTime', label: 'Arrival' },
    { key: 'burstTime', label: 'Burst' },
    { key: 'startTime', label: 'Start' },
    { key: 'endTime', label: 'End' },
    { key: 'waitingTime', label: 'Wait' },
    { key: 'turnaroundTime', label: 'TAT' },
    { key: 'responseTime', label: 'Response' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-border">
            {cols.map(c => (
              <th key={c.key} className="text-left py-2 px-2 text-slate-500 uppercase tracking-wide font-normal">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const color = getPidColor(r.pid, processes);
            return (
              <tr key={r.pid} className="border-b border-border/50 hover:bg-bg transition-colors">
                {cols.map(c => (
                  <td key={c.key} className="py-2 px-2" style={c.key === 'pid' ? { color: color.fill, fontWeight: 'bold' } : { color: '#94a3b8' }}>
                    {r[c.key] ?? '—'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
