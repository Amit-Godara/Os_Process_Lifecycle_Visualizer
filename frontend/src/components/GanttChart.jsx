import React, { useEffect, useRef } from 'react';
import { getPidColor } from '../utils/colors';

export default function GanttChart({ timeline, processes, animStep }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!timeline || timeline.length === 0) return;
    const svg = window.d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const W = container.clientWidth || 700;
    const H = 90;
    const margin = { left: 12, right: 12, top: 10, bottom: 28 };
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    svg.attr('width', W).attr('height', H);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const totalEnd = timeline[timeline.length - 1].end;
    const xScale = window.d3.scaleLinear().domain([0, totalEnd]).range([0, innerW]);

    // Grid lines
    const ticks = xScale.ticks(Math.min(totalEnd, 20));
    g.selectAll('.grid-line')
      .data(ticks)
      .enter().append('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#1e2d40').attr('stroke-dasharray', '3,3');

    // Bars
    const visibleTimeline = timeline.slice(0, animStep !== undefined ? animStep : timeline.length);

    visibleTimeline.forEach((slot, i) => {
      const color = slot.pid === 'IDLE'
        ? { fill: '#1e2d40', text: '#475569', glow: 'transparent' }
        : getPidColor(slot.pid, processes);

      const x = xScale(slot.start);
      const w = Math.max(1, xScale(slot.end) - xScale(slot.start));

      // Bar background glow
      if (slot.pid !== 'IDLE') {
        g.append('rect')
          .attr('x', x).attr('y', -2)
          .attr('width', w).attr('height', innerH + 4)
          .attr('fill', color.glow || 'none')
          .attr('rx', 3).attr('opacity', 0.15);
      }

      // Main bar
      const bar = g.append('rect')
        .attr('class', 'gantt-bar')
        .attr('x', x + 1).attr('y', 2)
        .attr('width', Math.max(0, w - 2)).attr('height', innerH - 4)
        .attr('fill', slot.pid === 'IDLE' ? '#111827' : color.fill)
        .attr('stroke', color.fill)
        .attr('stroke-width', slot.pid === 'IDLE' ? 1 : 1.5)
        .attr('rx', 4)
        .style('cursor', 'pointer')
        .style('opacity', slot.pid === 'IDLE' ? 0.4 : 1);

      // Label
      if (w > 18) {
        g.append('text')
          .attr('x', x + w / 2).attr('y', innerH / 2 + 4)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'Space Mono, monospace')
          .attr('font-size', Math.min(11, w / 3))
          .attr('font-weight', 'bold')
          .attr('fill', slot.pid === 'IDLE' ? '#475569' : color.text)
          .text(slot.pid);
      }

      // Tooltip
      bar.on('mousemove', function(event) {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;
        tooltip.style.display = 'block';
        tooltip.style.left = (event.clientX + 12) + 'px';
        tooltip.style.top = (event.clientY - 32) + 'px';
        tooltip.innerHTML = `<span style="color:${color.fill};font-weight:bold">${slot.pid}</span> &nbsp;|&nbsp; t=${slot.start}→${slot.end} &nbsp;|&nbsp; dur=${slot.end - slot.start}`;
      }).on('mouseleave', function() {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      });
    });

    // X Axis
    const axis = window.d3.axisBottom(xScale)
      .ticks(Math.min(totalEnd, 20))
      .tickSize(4)
      .tickFormat(d => d);

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(axis)
      .select('.domain').attr('stroke', '#1e2d40');

    g.selectAll('.tick line').attr('stroke', '#334155');
    g.selectAll('.tick text')
      .attr('fill', '#64748b')
      .attr('font-family', 'Space Mono, monospace')
      .attr('font-size', 9);

  }, [timeline, processes, animStep]);

  return (
    <div className="relative w-full">
      <svg ref={svgRef} className="w-full" />
      <div
        ref={tooltipRef}
        className="tooltip bg-panel border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300"
        style={{ display: 'none' }}
      />
    </div>
  );
}
