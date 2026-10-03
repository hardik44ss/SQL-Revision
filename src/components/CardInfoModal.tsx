import React from 'react';
import { SheetCard } from '../data/sqlCheatsheetData';
import { X, BookOpen, Lightbulb } from 'lucide-react';

interface CardInfoModalProps {
  card: SheetCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CardInfoModal: React.FC<CardInfoModalProps> = ({ card, isOpen, onClose }) => {
  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#b8c3cc] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden font-sans text-slate-800">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#026a8d] text-white">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-300" />
            <h3 className="font-bold text-sm">
              {card.title} {card.symbol} — Interview Talking Points
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 text-xs text-slate-700 leading-relaxed">
          <p className="font-medium text-slate-900 text-sm">
            {card.description}
          </p>

          <div className="bg-[#f3e9d2] p-3 rounded-lg border border-[#ebdcb9] space-y-1.5">
            <span className="font-bold text-[#443a2b] flex items-center gap-1.5 text-xs">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>Core Sections & Commands Covered:</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-800 font-mono text-[11.5px]">
              {card.sections.map((s, i) => (
                <li key={i}>
                  <strong className="text-slate-900 font-sans">{s.title || 'Standard Queries'}</strong> ({s.lines.length} command lines)
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-900 font-sans space-y-1">
            <span className="font-bold text-xs block">Interviewer Tip:</span>
            <span>
              Always state the logical order of execution (FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; ORDER BY) when asked why column aliases cannot be used in WHERE clauses!
            </span>
          </div>
        </div>

        <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">Click ⤢ to execute live queries in Sandbox</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
