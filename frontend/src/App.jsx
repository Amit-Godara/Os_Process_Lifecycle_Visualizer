import React, { useState } from 'react';
import { useScheduler } from './hooks/useScheduler';
import ProcessPanel from './components/ProcessPanel';
import GanttChart from './components/GanttChart';
import CPUUsageGraph from './components/CPUUsageGraph';
import ReadyQueue from './components/ReadyQueue';
import StateTransitionPanel from './components/StateTransitionPanel';
import MetricsPanel from './components/MetricsPanel';
import ResultsTable from './components/ResultsTable';
import AnimationControls from './components/AnimationControls';

const ALGO_LABELS = { fcfs: 'First Come First Served', sjf: 'Shortest Job First', rr: 'Round Robin' };
const TABS = ['Gantt', 'States', 'Table'];

export default function App() {
  const {
    processes, algorithm, setAlgorithm, quantum, setQuantum,
    result, loading, error,
    animStep, isAnimating,
    addProcess, removeProcess, updateProcess,
    run, startAnimation, resetAnimation,
  } = useScheduler();

  const [activeTab, setActiveTab] = useState('Gantt');

  return (
    <div className="min-h-screen bg-bg text-slate-200" style={{ fontFamily: 'Syne, sans-serif' }}>
      {/* Header */}
      <header className="border-b border-border bg-panel/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent text-sm font-mono font-bold">OS</span>
            </div>
            <div>
              <h1 className="text-sm font-display font-bold tracking-wide text-white leading-none">
                Process Lifecycle Visualizer
              </h1>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                CPU Scheduling Simulator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-bg border border-border rounded-lg px-3 py-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-warn animate-pulse' : result ? 'bg-success' : 'bg-slate-600'}`} />
              <span className="text-xs font-mono text-slate-400">
                {loading ? 'Running...' : result ? ALGO_LABELS[result.algorithm] : 'Idle'}
              </span>
            </div>
            <button
              onClick={run}
              disabled={loading || processes.length === 0}
              className="px-4 py-1.5 bg-accent text-bg text-xs font-mono font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <><span className="inline-block w-3 h-3 border-2 border-bg border-t-transparent rounded-full animate-spin" /> Running</>
              ) : '▶ Run Simulation'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT: Config */}
        <aside className="lg:col-span-1 flex flex-col gap-4">
          <ProcessPanel
            processes={processes}
            onAdd={addProcess}
            onRemove={removeProcess}
            onUpdate={updateProcess}
            algorithm={algorithm}
            quantum={quantum}
            onAlgoChange={setAlgorithm}
            onQuantumChange={setQuantum}
          />

          {/* Metrics */}
          <div className="bg-panel rounded-xl border border-border p-4">
            <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Metrics</div>
            <MetricsPanel metrics={result?.metrics} />
          </div>
        </aside>

        {/* RIGHT: Visualizations */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Error */}
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-xs font-mono rounded-lg px-4 py-3 animate-fade-in">
              ⚠ {error}
            </div>
          )}

          {/* Animation Controls */}
          {result && (
            <div className="bg-panel rounded-xl border border-border p-4">
              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Playback</div>
              <AnimationControls
                onPlay={startAnimation}
                onReset={resetAnimation}
                isAnimating={isAnimating}
                hasResult={!!result}
                animStep={animStep}
                totalSteps={result?.timeline?.length || 0}
              />
            </div>
          )}

          {/* Ready Queue + CPU */}
          {result && (
            <div className="bg-panel rounded-xl border border-border p-4">
              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Ready Queue & CPU State</div>
              <ReadyQueue
                snapshots={result.readyQueueSnapshots}
                animStep={animStep}
                processes={processes}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="bg-panel rounded-xl border border-border overflow-hidden">
            {/* Tab Bar */}
            <div className="flex border-b border-border">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-xs font-mono uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? 'text-accent border-b-2 border-accent bg-accent/5'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === 'Gantt' && (
                <div className="flex flex-col gap-5">
                  {result ? (
                    <>
                      {/* Gantt chart */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Gantt Chart</div>
                          <div className="flex gap-2 flex-wrap">
                            {processes.map((p, i) => {
                              const colors = ['#00e5ff','#ff6b35','#a855f7','#22d3ee','#fbbf24','#f87171','#4ade80','#e879f9'];
                              const c = colors[i % colors.length];
                              return (
                                <div key={p.pid} className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
                                  <span className="text-xs font-mono text-slate-400">{p.pid}</span>
                                </div>
                              );
                            })}
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-sm bg-slate-700" />
                              <span className="text-xs font-mono text-slate-400">IDLE</span>
                            </div>
                          </div>
                        </div>
                        <GanttChart
                          timeline={result.timeline}
                          processes={processes}
                          animStep={isAnimating || animStep > 0 ? animStep : result.timeline.length}
                        />
                      </div>

                      {/* CPU Usage Graph */}
                      <div>
                        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">CPU Utilization</div>
                        <CPUUsageGraph
                          timeline={result.timeline}
                          animStep={isAnimating || animStep > 0 ? animStep : result.timeline.length}
                        />
                      </div>
                    </>
                  ) : (
                    <EmptyState message="Add processes and run a simulation to see the Gantt chart." />
                  )}
                </div>
              )}

              {activeTab === 'States' && (
                <div>
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Process State Transitions</div>
                  {result ? (
                    <StateTransitionPanel
                      transitions={result.transitions}
                      processes={processes}
                      animStep={isAnimating || animStep > 0 ? animStep : result.timeline.length}
                      timeline={result.timeline}
                    />
                  ) : (
                    <EmptyState message="Run a simulation to see state transitions." />
                  )}
                </div>
              )}

              {activeTab === 'Table' && (
                <div>
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Per-Process Results</div>
                  {result ? (
                    <ResultsTable results={result.results} processes={processes} />
                  ) : (
                    <EmptyState message="Run a simulation to see detailed process results." />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer info */}
          {result && (
            <div className="text-xs font-mono text-slate-600 text-center pb-2 animate-fade-in">
              Algorithm: <span className="text-slate-400">{ALGO_LABELS[result.algorithm]}</span>
              {result.quantum && <> · Quantum: <span className="text-slate-400">{result.quantum}</span></>}
              {' '}· Total time: <span className="text-slate-400">{result.metrics.totalTime}</span>
              {' '}· {result.metrics.totalProcesses} processes
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-slate-600 text-lg">
        ○
      </div>
      <p className="text-xs font-mono text-slate-600 text-center max-w-xs">{message}</p>
    </div>
  );
}
