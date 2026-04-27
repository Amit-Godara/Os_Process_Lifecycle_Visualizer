import React from 'react';

export default function AnimationControls({ onPlay, onReset, isAnimating, hasResult, animStep, totalSteps }) {
  const progress = totalSteps > 0 ? Math.round((animStep / totalSteps) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onReset}
        disabled={!hasResult}
        className="px-3 py-1.5 rounded-lg text-xs font-mono border border-border text-slate-400 hover:text-white hover:border-slate-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ↺ Reset
      </button>
      <button
        onClick={onPlay}
        disabled={!hasResult || isAnimating}
        className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-accent text-bg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isAnimating ? (
          <>
            <span className="inline-block w-2 h-2 rounded-full bg-bg animate-pulse" />
            Animating...
          </>
        ) : (
          <>▶ Animate</>
        )}
      </button>

      {hasResult && (
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-500 w-8 text-right">{progress}%</span>
        </div>
      )}
    </div>
  );
}
