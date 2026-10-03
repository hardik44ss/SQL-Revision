import React from 'react';
import { SheetCard } from '../data/sqlCheatsheetData';
import { ArrowUp, ArrowDown, RotateCcw, X, Layers, Move } from 'lucide-react';

interface TopicSidebarProps {
  cards: SheetCard[];
  activeCardId: string | null;
  onSelectTopic: (cardId: string) => void;
  onMoveCard: (index: number, direction: 'up' | 'down') => void;
  onResetOrder: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TopicSidebar: React.FC<TopicSidebarProps> = ({
  cards,
  activeCardId,
  onSelectTopic,
  onMoveCard,
  onResetOrder,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-2xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-14 h-screen lg:h-[calc(100vh-3.5rem)] w-72 bg-[#edece6] border-r border-[#b8c3cc] shadow-md z-40 flex flex-col transition-transform duration-200 ease-in-out font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 bg-[#e2e0d8] border-b border-[#b8c3cc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#026a8d]" />
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#2c3e50]">
              SQL Sections & Order ({cards.length})
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onResetOrder}
              title="Reset sections to default order"
              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-black/5 text-[11px] flex items-center gap-1 font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-600 hover:text-black rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reordering Tip */}
        <div className="px-3 py-1.5 bg-[#f6f5f0] border-b border-[#b8c3cc] text-[11px] text-slate-600 flex items-center gap-1.5">
          <Move className="w-3 h-3 text-[#026a8d]" />
          <span>Click to jump · Use ▲ ▼ to reorder sections</span>
        </div>

        {/* Topic List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {cards.map((card, idx) => {
            const isActive = activeCardId === card.id;

            return (
              <div
                key={card.id}
                className={`group flex items-center justify-between p-1.5 rounded-lg border text-xs transition-all ${
                  isActive
                    ? 'bg-white border-[#026a8d] shadow-sm text-[#026a8d] font-bold'
                    : 'bg-[#f9f8f4] hover:bg-white border-[#d2d0c5] text-slate-800'
                }`}
              >
                {/* Topic Title & Click to Jump */}
                <button
                  onClick={() => {
                    onSelectTopic(card.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="flex items-center gap-2 flex-1 text-left min-w-0 pr-1 truncate"
                >
                  <span className="text-sm shrink-0">{card.symbol}</span>
                  <div className="truncate">
                    <span className="block truncate font-medium">{card.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {card.sections.length} sub-sections
                    </span>
                  </div>
                </button>

                {/* Move Up / Down Buttons */}
                <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                  <button
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCard(idx, 'up');
                    }}
                    title="Move section up"
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === cards.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCard(idx, 'down');
                    }}
                    title="Move section down"
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-2.5 bg-[#e2e0d8] border-t border-[#b8c3cc] text-[11px] text-slate-600 text-center font-mono">
          Sections are movable & save automatically
        </div>
      </aside>
    </>
  );
};
