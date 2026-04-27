import React, { useEffect, useRef } from 'react';

export default function CPUUsageGraph({ timeline, animStep }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!timeline || timeline.length === 0) return;
    const svg = window.d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const W = container.clientWidth || 700;
    const H = 80;
    const margin = { left: 30, right: 12, top: 8, bottom: 22 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    svg.attr('width', W).attr('height', H);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const totalEnd = timeline[timeline.length - 1].end;
    const xScale = window.d3.scaleLinear().domain([0, totalEnd]).range([0, innerW]);
    const yScale = window.d3.scaleLinear().domain([0, 1]).range([innerH, 0]);

    // Build CPU utilization data: for each time unit, is it busy?
    const dataPoints = [];
    for (let t = 0; t <= totalEnd; t += 0.5) {
      const visTimeline = timeline.slice(0, animStep !== undefined ? animStep : timeline.length);
      const busy = visTimeline.some(s => s.pid !== 'IDLE' && s.start <= t && s.end > t);
      dataPoints.push({ t, v: busy ? 1 : 0 });
    }

    // Smooth with rolling average
    const windowSize = 4;
    const smoothed = dataPoints.map((d, i) => {
      const from = Math.max(0, i - windowSize);
      const slice = dataPoints.slice(from, i + 1);
      return { t: d.t, v: slice.reduce((s, x) => s + x.v, 0) / slice.length };
    });

    // Area
    const area = window.d3.area()
      .x(d => xScale(d.t))
      .y0(innerH)
      .y1(d => yScale(d.v))
      .curve(window.d3.curveMonotoneX);

    const line = window.d3.line()
      .x(d => xScale(d.t))
      .y(d => yScale(d.v))
      .curve(window.d3.curveMonotoneX);

    // Gradient
    const defs = svg.append('defs');
    const grad = defs.append('linearGradient')
      .attr('id', 'cpuGrad').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1);
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#00e5ff').attr('stop-opacity', 0.35);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#00e5ff').attr('stop-opacity', 0.02);

    g.append('path').datum(smoothed)
      .attr('fill', 'url(#cpuGrad)')
      .attr('d', area);

    g.append('path').datum(smoothed)
      .attr('fill', 'none')
      .attr('stroke', '#00e5ff')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Axes
    g.append('g').attr('transform', `translate(0,${innerH})`)
      .call(window.d3.axisBottom(xScale).ticks(Math.min(totalEnd, 15)).tickSize(3))
      .select('.domain').attr('stroke', '#1e2d40');
    g.selectAll('.tick line').attr('stroke', '#334155');
    g.selectAll('.tick text').attr('fill', '#64748b').attr('font-size', 8).attr('font-family', 'Space Mono, monospace');

    g.append('g')
      .call(window.d3.axisLeft(yScale).ticks(2).tickFormat(d => `${d * 100}%`).tickSize(3))
      .select('.domain').attr('stroke', '#1e2d40');
    g.selectAll('.tick text').attr('fill', '#64748b').attr('font-size', 8).attr('font-family', 'Space Mono, monospace');

  }, [timeline, animStep]);

  return <svg ref={svgRef} className="w-full" />;
}
