import React from 'react';
import { getProcessColor } from '../utils/colors';

export default function ProcessPanel({ processes, onAdd, onRemove, onUpdate, algorithm, quantum, onQuantumChange, onAlgoChange }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Algorithm selector */}
      <div className="bg-panel rounded-xl border border-border p-4">
        <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Scheduling Algorithm</div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {['fcfs', 'sjf', 'rr'].map(a => (
            <button
              key={a}
              onClick={() => onAlgoChange(a)}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wide transition-all duration-200 ${
                algorithm === a
                  ? 'bg-accent text-bg shadow-lg'
                  : 'bg-bg border border-border text-slate-400 hover:border-accent hover:text-accent'
              }`}
            >
              {a === 'fcfs' ? 'FCFS' : a === 'sjf' ? 'SJF' : 'Round Robin'}
            </button>
          ))}
        </div>
        {algorithm === 'rr' && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Quantum:</span>
            <input
              type="range" min={1} max={10} value={quantum}
              onChange={e => onQuantumChange(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs font-mono text-accent w-4 text-right">{quantum}</span>
          </div>
        )}
      </div>

      {/* Process list */}
      <div className="bg-panel rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-mono text-accent uppercase tracking-widest">Processes</div>
          <button
            onClick={onAdd}
            className="text-xs font-mono font-bold text-accent hover:text-white border border-accent hover:bg-accent hover:text-bg transition-all px-3 py-1 rounded-md"
          >
            + ADD
          </button>
        </div>

        {/* Header */}
        <div className="grid grid-cols-12 gap-1 text-xs font-mono text-slate-500 uppercase tracking-wide pb-2 border-b border-border">
          <div className="col-span-2">PID</div>
          <div className="col-span-3">Arrival</div>
          <div className="col-span-3">Burst</div>
          <div className="col-span-3">Priority</div>
          <div className="col-span-1"></div>
        </div>

        <div className="flex flex-col gap-1 mt-2 max-h-64 overflow-y-auto pr-1">
          {processes.map((p, idx) => {
            const color = getProcessColor(idx);
            return (
              <div key={idx} className="process-row grid grid-cols-12 gap-1 items-center">
                {/* PID */}
                <div className="col-span-2">
                  <input
                    type="text"
                    value={p.pid}
                    maxLength={4}
                    onChange={e => onUpdate(idx, 'pid', e.target.value)}
                    style={{ borderColor: color.fill, color: color.fill }}
                    className="w-full bg-bg border rounded px-2 py-1 text-xs font-mono font-bold text-center"
                  />
                </div>
                {/* Arrival */}
                <div className="col-span-3">
                  <input
                    type="number" min={0} max={99} value={p.arrivalTime}
                    onChange={e => onUpdate(idx, 'arrivalTime', e.target.value)}
                    className="w-full"
                  />
                </div>
                {/* Burst */}
                <div className="col-span-3">
                  <input
                    type="number" min={1} max={99} value={p.burstTime}
                    onChange={e => onUpdate(idx, 'burstTime', e.target.value)}
                    className="w-full"
                  />
                </div>
                {/* Priority */}
                <div className="col-span-3">
                  <input
                    type="number" min={1} max={10} value={p.priority}
                    onChange={e => onUpdate(idx, 'priority', e.target.value)}
                    className="w-full"
                  />
                </div>
                {/* Remove */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => onRemove(idx)}
                    className="text-slate-600 hover:text-danger text-sm transition-colors"
                  >✕</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
