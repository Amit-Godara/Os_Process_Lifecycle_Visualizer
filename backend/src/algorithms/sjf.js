/**
 * Shortest Job First (SJF) Scheduling - Non-preemptive
 * Picks the process with smallest burst time from available processes
 */
function sjf(processes) {
  const procs = processes.map(p => ({ ...p, remaining: p.burstTime, completed: false }));
  const timeline = [];
  const results = [];
  let currentTime = 0;
  let completed = 0;
  const n = procs.length;

  while (completed < n) {
    // Get available processes (arrived and not done)
    const available = procs.filter(p => !p.completed && p.arrivalTime <= currentTime);

    if (available.length === 0) {
      // Fast-forward to next arrival
      const next = procs
        .filter(p => !p.completed)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (next) {
        timeline.push({ pid: 'IDLE', start: currentTime, end: next.arrivalTime });
        currentTime = next.arrivalTime;
      }
      continue;
    }

    // Pick shortest burst
    available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);
    const proc = available[0];
    const startTime = currentTime;
    const endTime = currentTime + proc.burstTime;

    timeline.push({ pid: proc.pid, start: startTime, end: endTime, burst: proc.burstTime });

    results.push({
      pid: proc.pid,
      arrivalTime: proc.arrivalTime,
      burstTime: proc.burstTime,
      priority: proc.priority,
      startTime,
      endTime,
      waitingTime: startTime - proc.arrivalTime,
      turnaroundTime: endTime - proc.arrivalTime,
      responseTime: startTime - proc.arrivalTime,
    });

    proc.completed = true;
    completed++;
    currentTime = endTime;
  }

  return { timeline, results };
}

module.exports = { sjf };
