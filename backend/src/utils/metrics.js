/**
 * Compute aggregate scheduling metrics from per-process results
 */
function computeMetrics(results, timeline) {
  const n = results.length;
  if (n === 0) return {};

  const totalWT = results.reduce((s, r) => s + r.waitingTime, 0);
  const totalTAT = results.reduce((s, r) => s + r.turnaroundTime, 0);
  const totalRT = results.reduce((s, r) => s + (r.responseTime ?? r.waitingTime), 0);

  const totalSpan = timeline.length > 0
    ? timeline[timeline.length - 1].end - timeline[0].start
    : 1;

  const busyTime = timeline
    .filter(t => t.pid !== 'IDLE')
    .reduce((s, t) => s + (t.end - t.start), 0);

  const cpuUtilization = Math.min(100, ((busyTime / totalSpan) * 100)).toFixed(1);
  const throughput = (n / totalSpan).toFixed(3);

  return {
    avgWaitingTime: (totalWT / n).toFixed(2),
    avgTurnaroundTime: (totalTAT / n).toFixed(2),
    avgResponseTime: (totalRT / n).toFixed(2),
    cpuUtilization: parseFloat(cpuUtilization),
    throughput: parseFloat(throughput),
    totalProcesses: n,
    totalTime: totalSpan,
    contextSwitches: timeline.filter(t => t.pid !== 'IDLE').length - 1,
  };
}

module.exports = { computeMetrics };
