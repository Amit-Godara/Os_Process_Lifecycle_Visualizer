import { useState, useCallback } from 'react';
import { fetchSchedule } from '../utils/api';

const DEFAULT_PROCESSES = [
  { pid: 'P1', arrivalTime: 0, burstTime: 6, priority: 2 },
  { pid: 'P2', arrivalTime: 2, burstTime: 4, priority: 1 },
  { pid: 'P3', arrivalTime: 4, burstTime: 2, priority: 3 },
  { pid: 'P4', arrivalTime: 6, burstTime: 3, priority: 2 },
];

export function useScheduler() {
  const [processes, setProcesses] = useState(DEFAULT_PROCESSES);
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animStep, setAnimStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const addProcess = useCallback(() => {
    const n = processes.length + 1;
    setProcesses(prev => [
      ...prev,
      { pid: `P${n}`, arrivalTime: 0, burstTime: 1, priority: 1 },
    ]);
  }, [processes.length]);

  const removeProcess = useCallback((idx) => {
    setProcesses(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateProcess = useCallback((idx, field, value) => {
    setProcesses(prev =>
      prev.map((p, i) => i === idx ? { ...p, [field]: field === 'pid' ? value : Number(value) } : p)
    );
  }, []);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnimStep(0);
    try {
      const data = await fetchSchedule(processes, algorithm, quantum);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [processes, algorithm, quantum]);

  const startAnimation = useCallback(() => {
    if (!result) return;
    setAnimStep(0);
    setIsAnimating(true);
    let step = 0;
    const total = result.timeline.length;
    const interval = setInterval(() => {
      step++;
      setAnimStep(step);
      if (step >= total) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [result]);

  const resetAnimation = useCallback(() => {
    setAnimStep(0);
    setIsAnimating(false);
  }, []);

  return {
    processes, setProcesses,
    algorithm, setAlgorithm,
    quantum, setQuantum,
    result, loading, error,
    animStep, isAnimating,
    addProcess, removeProcess, updateProcess,
    run, startAnimation, resetAnimation,
  };
}
