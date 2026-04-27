const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export async function fetchSchedule(processes, algorithm, quantum) {
  const res = await fetch(`${BASE}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ processes, algorithm, quantum }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Server error');
  }
  return res.json();
}

export async function fetchAlgorithms() {
  const res = await fetch(`${BASE}/algorithms`);
  return res.json();
}
