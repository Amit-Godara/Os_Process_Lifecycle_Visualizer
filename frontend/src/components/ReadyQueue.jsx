import React, { useMemo } from 'react';
import { getPidColor } from '../utils/colors';

export default function ReadyQueue({ snapshots, animStep, processes }) {
  const snapshot = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return null;
    // Find snapshot closest to current animation step
    const idx = Math.min(animStep, snapshots.length - 1);
    return snapshots[idx] || snapshots[snapshots.length - 1];
  }, [snapshots, animStep]);

  if (!snapshot) return null;

  const { running, ready, time } = snapshot;

  return (
    <div className="flex flex-col gap-3">
      {/* CPU */}
      <div>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">CPU @ t={time}</div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent flex items-center justify-center text-accent text-xs font-mono font-bold">
            CPU
          </div>
          <div className="w-2 h-0.5 bg-accent" />
          {running === 'IDLE' ? (
            <div className="px-3 py-1.5 rounded-lg border border-border bg-bg text-slate-500 text-xs font-mono italic">
              IDLE
            </div>
          ) : (
            <ProcessChip pid={running} processes={processes} pulse />
          )}
        </div>
      </div>

      {/* Queue */}
      <div>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
          Ready Queue ({ready.length})
        </div>
        <div className="flex items-center gap-1 flex-wrap min-h-8">
          {ready.length === 0 ? (
            <span className="text-xs font-mono text-slate-600 italic">empty</span>
          ) : (
            ready.map((pid, i) => (
              <React.Fragment key={pid}>
                <ProcessChip pid={pid} processes={processes} />
                {i < ready.length - 1 && (
                  <span className="text-slate-600 text-xs">→</span>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ProcessChip({ pid, processes, pulse }) {
  const color = getPidColor(pid, processes);
  return (
    <div
      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${pulse ? 'animate-pulse-slow' : ''}`}
      style={{
        backgroundColor: color.fill + '20',
        color: color.fill,
        border: `1px solid ${color.fill}50`,
        boxShadow: pulse ? `0 0 10px ${color.glow}` : 'none',
      }}
    >
      {pid}
    </div>
  );
}
