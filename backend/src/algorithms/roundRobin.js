/**
 * Round Robin Scheduling
 * Each process gets a fixed time quantum; preemptive
 */
function roundRobin(processes, quantum = 2) {
  const procs = processes
    .map(p => ({ ...p, remaining: p.burstTime, firstRun: -1 }))
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  const timeline = [];
  const queue = [];
  let currentTime = 0;
  let idx = 0; // pointer into sorted arrivals
  const results = {};

  procs.forEach(p => {
    results[p.pid] = {
      pid: p.pid,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      startTime: -1,
      endTime: -1,
      waitingTime: 0,
      turnaroundTime: 0,
      responseTime: -1,
    };
  });

  // Enqueue initially arrived processes
  while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
    queue.push(procs[idx++]);
  }

  while (queue.length > 0 || idx < procs.length) {
    if (queue.length === 0) {
      // CPU idle - jump to next arrival
      const next = procs[idx];
      timeline.push({ pid: 'IDLE', start: currentTime, end: next.arrivalTime });
      currentTime = next.arrivalTime;
      while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
        queue.push(procs[idx++]);
      }
      continue;
    }

    const proc = queue.shift();
    const execTime = Math.min(quantum, proc.remaining);
    const startSlice = currentTime;
    const endSlice = currentTime + execTime;

    if (results[proc.pid].startTime === -1) {
      results[proc.pid].startTime = startSlice;
      results[proc.pid].responseTime = startSlice - proc.arrivalTime;
    }

    timeline.push({ pid: proc.pid, start: startSlice, end: endSlice, burst: proc.burstTime });

    proc.remaining -= execTime;
    currentTime = endSlice;

    // Enqueue newly arrived processes
    while (idx < procs.length && procs[idx].arrivalTime <= currentTime) {
      queue.push(procs[idx++]);
    }

    if (proc.remaining > 0) {
      queue.push(proc); // re-queue
    } else {
      results[proc.pid].endTime = currentTime;
      results[proc.pid].turnaroundTime = currentTime - proc.arrivalTime;
      results[proc.pid].waitingTime = results[proc.pid].turnaroundTime - proc.burstTime;
    }
  }

  return { timeline, results: Object.values(results) };
}

module.exports = { roundRobin };
