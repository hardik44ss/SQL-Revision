import React, { useState } from 'react';
import { SheetCard } from '../data/sqlCheatsheetData';
import { SyntaxHighlighter } from './SyntaxHighlighter';
import { Copy, Check, ExternalLink, HelpCircle, Code } from 'lucide-react';

interface CheatSheetCardProps {
  card: SheetCard;
  onOpenRunner: (card: SheetCard) => void;
  onShowInfo: (card: SheetCard) => void;
}

export const CheatSheetCard: React.FC<CheatSheetCardProps> = ({
  card,
  onOpenRunner,
  onShowInfo,
}) => {
  const [copied, setCopied] = useState(false);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<string | null>(null);
  const [copiedLine, setCopiedLine] = useState<string | null>(null);

  const getAllCardText = () => {
    let full = `// === ${card.title} ===\n`;
    card.sections.forEach((sec) => {
      if (sec.title) full += `\n// --- ${sec.title} ---\n`;
      sec.lines.forEach((l) => {
        full += l.code + (l.comment ? `  ${l.comment}` : '') + '\n';
      });
    });
    return full;
  };

  const handleCopyCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getAllCardText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyLine = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLine(id);
    setTimeout(() => setCopiedLine(null), 1200);
  };

  return (
    <div className="flex flex-col mb-4 select-text">
      {/* Folder Tab Header Bar */}
      <div className="flex items-end justify-between px-1">
        {/* Protruding Tab */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#edece6] border-t border-l border-r border-[#b8c3cc] rounded-t-xl -mb-[1px] z-10 shadow-sm">
          <span className="font-bold text-[#2c3e50] text-[15px] font-sans tracking-tight">
            {card.title}
          </span>
          <span className="text-[#3b4b5c] font-bold text-sm ml-0.5">
            {card.symbol}
          </span>
        </div>

        {/* Action icons on right */}
        <div className="flex items-center gap-1.5 mb-1 text-slate-500">
          <button
            onClick={() => onShowInfo(card)}
            title="Card Information & Tips"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-[#dfe5eb] hover:bg-[#cfd7df] text-slate-600 text-xs font-bold transition-colors"
          >
            ?
          </button>

          <button
            onClick={() => onOpenRunner(card)}
            title="Open Interactive Live Sandbox"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-[#dfe5eb] hover:bg-[#cfd7df] text-slate-600 text-xs transition-colors"
          >
            ⤢
          </button>

          <button
            onClick={handleCopyCard}
            title="Copy whole card code to clipboard"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-[#dfe5eb] hover:bg-[#cfd7df] text-slate-600 text-[11px] transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : '📋'}
          </button>
        </div>
      </div>

      {/* Main Card Box */}
      <div className="bg-white border border-[#b8c3cc] rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden text-[12.5px] leading-relaxed">
        {card.sections.map((section, sIdx) => (
          <div key={sIdx}>
            {/* Tan ribbon section header if present */}
            {section.title && (
              <div className="px-3 py-1 bg-[#f3e9d2] text-[#443a2b] font-bold text-[11.5px] border-t border-b border-[#ebdcb9] font-sans tracking-wide">
                {section.title}
              </div>
            )}

            {/* Code Lines with two-column look (code left, green comment right) */}
            <div className="py-1 px-3 space-y-0.5 font-mono">
              {section.lines.map((line, lIdx) => {
                const lineId = `${sIdx}-${lIdx}`;
                const isHovered = hoveredLineIndex === lineId;
                const isLineCopied = copiedLine === lineId;

                return (
                  <div
                    key={lIdx}
                    onMouseEnter={() => setHoveredLineIndex(lineId)}
                    onMouseLeave={() => setHoveredLineIndex(null)}
                    onClick={() => handleCopyLine(line.code, lineId)}
                    title="Click to copy line"
                    className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-2.5 py-0.5 px-1 rounded hover:bg-[#f6f9fc] cursor-pointer group transition-colors leading-tight"
                  >
                    {/* Code syntax */}
                    <div className="font-mono text-[#111111] break-words flex-1 min-w-0">
                      <SyntaxHighlighter code={line.code} />
                      {isLineCopied && (
                        <span className="ml-2 text-[10px] text-emerald-700 font-sans font-bold bg-emerald-50 px-1 rounded border border-emerald-300">
                          copied!
                        </span>
                      )}
                    </div>

                    {/* Green comment (only if present) */}
                    {line.comment && (
                      <div className="text-[#008000] font-mono text-[11.5px] shrink-0 sm:text-right sm:max-w-[48%]">
                        {line.comment}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
