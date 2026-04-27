import React from 'react';
import { getPidColor, STATE_COLORS } from '../utils/colors';

const STATE_ORDER = ['NEW', 'READY', 'RUNNING', 'WAITING', 'TERMINATED'];

export default function StateTransitionPanel({ transitions, processes, animStep, timeline }) {
  if (!transitions) return null;

  // Current time based on animStep
  const currentTime = timeline && animStep > 0 && animStep <= timeline.length
    ? timeline[Math.min(animStep - 1, timeline.length - 1)].end
    : 0;

  return (
    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
      {Object.entries(transitions).map(([pid, events]) => {
        const color = getPidColor(pid, processes);
        // Only show events up to current time
        const visibleEvents = events.filter(e => e.time <= currentTime + 0.001);

        return (
          <div key={pid} className="rounded-lg border border-border bg-bg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                style={{ backgroundColor: color.fill + '20', color: color.fill, border: `1px solid ${color.fill}40` }}
              >
                {pid}
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex flex-wrap gap-1 items-center">
              {visibleEvents.map((evt, i) => {
                const sc = STATE_COLORS[evt.state] || STATE_COLORS.NEW;
                return (
                  <React.Fragment key={i}>
                    <div
                      className="flex flex-col items-center gap-0.5"
                      title={evt.note}
                    >
                      <div
                        className="state-badge"
                        style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                      >
                        {evt.state}
                      </div>
                      <div className="text-[9px] font-mono text-slate-600">t={evt.time}</div>
                    </div>
                    {i < visibleEvents.length - 1 && (
                      <div className="text-slate-600 text-xs mb-3">→</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
