/**
 * First Come First Served (FCFS) Scheduling
 * Non-preemptive: processes run to completion in arrival order
 */
function fcfs(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timeline = [];
  const results = [];
  let currentTime = 0;

  for (const proc of sorted) {
    if (currentTime < proc.arrivalTime) {
      // CPU idle gap
      timeline.push({ pid: 'IDLE', start: currentTime, end: proc.arrivalTime });
      currentTime = proc.arrivalTime;
    }
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

    currentTime = endTime;
  }

  return { timeline, results };
}

module.exports = { fcfs };
