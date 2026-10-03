import React, { useState, useEffect } from 'react';

const STEPS = [
  { num: '#1', label: 'FROM / JOIN', tip: 'Step 1: Identifies source tables & processes JOINs' },
  { num: '#2', label: 'WHERE', tip: 'Step 2: Filters individual rows before grouping' },
  { num: '#3', label: 'GROUP BY', tip: 'Step 3: Collapses rows into aggregate buckets' },
  { num: '#4', label: 'HAVING', tip: 'Step 4: Filters grouped summary buckets' },
  { num: '#5', label: 'SELECT', tip: 'Step 5: Computes expressions, window functions & aliases' },
  { num: '#6', label: 'ORDER BY', tip: 'Step 6: Sorts output (1st column has highest priority, next breaks ties)' },
  { num: '#7', label: 'LIMIT / OFFSET', tip: 'Step 7: Restricts final pagination row window' },
];

export const ExecutionPrioritySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-play through the execution pipeline with smooth animation
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="mb-4 bg-[#026a8d] border border-[#01516b] rounded-xl px-3 sm:px-4 py-2.5 shadow-md flex items-center justify-start lg:justify-center overflow-x-auto select-none no-scrollbar"
    >
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 py-0.5">
        {STEPS.map((step, idx) => {
          const isActive = activeStep === idx;

          return (
            <React.Fragment key={step.num}>
              <button
                onClick={() => setActiveStep(idx)}
                title={step.tip}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs sm:text-[13px] font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#ffaa00] text-slate-950 ring-2 ring-white shadow-lg scale-105 z-10'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/40'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold ${
                    isActive ? 'text-slate-900' : 'text-amber-300'
                  }`}
                >
                  {step.num}
                </span>
                <span className="tracking-tight uppercase whitespace-nowrap">
                  {step.label}
                </span>
              </button>

              {idx < STEPS.length - 1 && (
                <span className="text-[#ffb703] font-bold text-xs sm:text-sm px-0.5 animate-pulse">
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
