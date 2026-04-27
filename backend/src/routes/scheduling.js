const express = require('express');
const router = express.Router();
const { fcfs } = require('../algorithms/fcfs');
const { sjf } = require('../algorithms/sjf');
const { roundRobin } = require('../algorithms/roundRobin');
const { computeMetrics } = require('../utils/metrics');
const { buildStateTransitions } = require('../utils/stateTransitions');

/**
 * POST /api/schedule
 * Body: { processes: [...], algorithm: 'fcfs'|'sjf'|'rr', quantum?: number }
 */
router.post('/schedule', (req, res) => {
  const { processes, algorithm, quantum = 2 } = req.body;

  if (!processes || !Array.isArray(processes) || processes.length === 0) {
    return res.status(400).json({ error: 'processes array is required' });
  }

  // Validate each process
  for (const p of processes) {
    if (!p.pid || p.arrivalTime == null || p.burstTime == null) {
      return res.status(400).json({ error: `Each process needs pid, arrivalTime, burstTime` });
    }
    if (p.burstTime <= 0) {
      return res.status(400).json({ error: `burstTime must be > 0 for process ${p.pid}` });
    }
  }

  let timeline, results;

  try {
    switch (algorithm) {
      case 'fcfs':
        ({ timeline, results } = fcfs(processes));
        break;
      case 'sjf':
        ({ timeline, results } = sjf(processes));
        break;
      case 'rr':
        ({ timeline, results } = roundRobin(processes, quantum));
        break;
      default:
        return res.status(400).json({ error: `Unknown algorithm: ${algorithm}` });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  const metrics = computeMetrics(results, timeline);
  const { transitions, readyQueueSnapshots } = buildStateTransitions(processes, timeline, algorithm);

  res.json({
    algorithm,
    quantum: algorithm === 'rr' ? quantum : null,
    timeline,
    results,
    metrics,
    transitions,
    readyQueueSnapshots,
  });
});

/**
 * GET /api/algorithms
 * Returns list of supported algorithms
 */
router.get('/algorithms', (req, res) => {
  res.json([
    { id: 'fcfs', name: 'First Come First Served', description: 'Non-preemptive. Processes run in arrival order.', preemptive: false },
    { id: 'sjf', name: 'Shortest Job First', description: 'Non-preemptive. Picks shortest burst time from available.', preemptive: false },
    { id: 'rr', name: 'Round Robin', description: 'Preemptive. Each process gets a fixed time quantum.', preemptive: true },
  ]);
});

module.exports = router;
