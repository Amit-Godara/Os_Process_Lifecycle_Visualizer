/**
 * Build a state transition log for each process:
 *   NEW → READY → RUNNING → (WAITING?) → TERMINATED
 * Also tracks READY queue snapshots over time.
 */
function buildStateTransitions(processes, timeline, algorithm) {
  const transitions = {};
  const processMap = {};

  processes.forEach(p => {
    processMap[p.pid] = p;
    transitions[p.pid] = [
      { state: 'NEW', time: 0, note: 'Process created' },
      { state: 'READY', time: p.arrivalTime, note: 'Entered ready queue' },
    ];
  });

  // Walk timeline to add RUNNING and TERMINATED states
  for (let i = 0; i < timeline.length; i++) {
    const slot = timeline[i];
    if (slot.pid === 'IDLE') continue;

    const prev = i > 0 ? timeline[i - 1] : null;

    // If this is the first time this PID runs, or re-scheduled (RR context switch)
    const alreadyRan = transitions[slot.pid].some(t => t.state === 'RUNNING');
    transitions[slot.pid].push({
      state: 'RUNNING',
      time: slot.start,
      note: alreadyRan
        ? `Resumed on CPU (context switch)`
        : `Dispatched to CPU`,
    });

    // If preempted (next slot is different pid and process not done)
    const isLastSlot = i === timeline.length - 1;
    const nextSlot = !isLastSlot ? timeline[i + 1] : null;
    if (nextSlot && nextSlot.pid !== slot.pid) {
      if (algorithm === 'rr') {
        transitions[slot.pid].push({
          state: 'READY',
          time: slot.end,
          note: 'Quantum expired – preempted back to ready queue',
        });
      }
    }
  }

  // Add TERMINATED for each process
  processes.forEach(p => {
    const lastRun = timeline
      .filter(t => t.pid === p.pid)
      .sort((a, b) => b.end - a.end)[0];
    if (lastRun) {
      transitions[p.pid].push({
        state: 'TERMINATED',
        time: lastRun.end,
        note: 'Process finished execution',
      });
    }
  });

  // Build ready queue snapshots at each unique time point
  const allTimes = [...new Set(
    timeline.flatMap(t => [t.start, t.end])
  )].sort((a, b) => a - b);

  const readyQueueSnapshots = allTimes.map(time => {
    const running = timeline.find(t => t.pid !== 'IDLE' && t.start <= time && t.end > time);
    const ready = processes.filter(p => {
      const arrivedBefore = p.arrivalTime <= time;
      const terminated = transitions[p.pid]?.some(t => t.state === 'TERMINATED' && t.time <= time);
      const isRunning = running?.pid === p.pid;
      return arrivedBefore && !terminated && !isRunning;
    });
    return {
      time,
      running: running?.pid ?? 'IDLE',
      ready: ready.map(p => p.pid),
    };
  });

  return { transitions, readyQueueSnapshots };
}

module.exports = { buildStateTransitions };
