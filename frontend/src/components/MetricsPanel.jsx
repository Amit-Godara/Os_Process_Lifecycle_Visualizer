import React from 'react';

const MetricCard = ({ label, value, unit, color }) => (
  <div className="bg-bg rounded-lg border border-border p-3 flex flex-col gap-1">
    <div className="text-xs font-mono text-slate-500 uppercase tracking-wide">{label}</div>
    <div className="flex items-end gap-1">
      <span className="text-2xl font-display font-bold" style={{ color: color || '#00e5ff' }}>{value}</span>
      {unit && <span className="text-xs font-mono text-slate-500 mb-1">{unit}</span>}
    </div>
  </div>
);

export default function MetricsPanel({ metrics }) {
  if (!metrics) return (
    <div className="text-xs font-mono text-slate-600 italic p-4 text-center">
      Run a simulation to see metrics
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <MetricCard label="Avg Waiting Time" value={metrics.avgWaitingTime} unit="units" color="#00e5ff" />
      <MetricCard label="Avg Turnaround" value={metrics.avgTurnaroundTime} unit="units" color="#a855f7" />
      <MetricCard label="CPU Utilization" value={metrics.cpuUtilization} unit="%" color="#22d3ee" />
      <MetricCard label="Avg Response" value={metrics.avgResponseTime} unit="units" color="#fbbf24" />
      <MetricCard label="Throughput" value={metrics.throughput} unit="proc/unit" color="#4ade80" />
      <MetricCard label="Context Switches" value={metrics.contextSwitches} color="#ff6b35" />
    </div>
  );
}
