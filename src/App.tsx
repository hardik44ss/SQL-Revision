import React, { useState, useMemo } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { ExecutionPrioritySection } from './components/ExecutionPrioritySection';
import { CheatSheetCard } from './components/CheatSheetCard';
import { InteractiveRunnerModal } from './components/InteractiveRunnerModal';
import { CardInfoModal } from './components/CardInfoModal';
import { SQL_CHEATSHEET_CARDS, SheetCard } from './data/sqlCheatsheetData';
import { Database, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [activeRunnerCard, setActiveRunnerCard] = useState<SheetCard | null>(null);
  const [activeInfoCard, setActiveInfoCard] = useState<SheetCard | null>(null);

  // Filter cards based on category and search query
  const filteredCards = useMemo(() => {
    return SQL_CHEATSHEET_CARDS.filter((card) => {
      const matchCat =
        selectedCategory === 'all' || card.category === selectedCategory;

      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = card.title.toLowerCase().includes(q);
      const matchDesc = card.description.toLowerCase().includes(q);
      const matchCode = card.sections.some((sec) =>
        sec.lines.some(
          (line) =>
            line.code.toLowerCase().includes(q) ||
            (line.comment && line.comment.toLowerCase().includes(q))
        )
      );
      return matchTitle || matchDesc || matchCode;
    });
  }, [selectedCategory, searchQuery]);

  // Smart Greedy Height-Balancing: packs cards into the shortest column so all columns stay level
  const columns = useMemo(() => {
    const numCols = 3;
    const cols: SheetCard[][] = [[], [], []];
    const heights = [0, 0, 0];

    filteredCards.forEach((card) => {
      // Calculate estimated vertical height of the card
      const cardHeight =
        50 +
        card.sections.reduce((acc, sec) => {
          return acc + (sec.title ? 26 : 0) + sec.lines.length * 22;
        }, 0);

      // Find column with the minimum cumulative height
      let minIdx = 0;
      for (let i = 1; i < numCols; i++) {
        if (heights[i] < heights[minIdx]) {
          minIdx = i;
        }
      }

      cols[minIdx].push(card);
      heights[minIdx] += cardHeight;
    });

    return cols;
  }, [filteredCards]);

  const handleOpenGlobalSandbox = () => {
    setActiveRunnerCard(SQL_CHEATSHEET_CARDS[0]);
  };

  const handleJumpToCard = (cardId: string) => {
    setSelectedCategory('all');
    setSearchQuery('');
    setTimeout(() => {
      const el = document.getElementById(cardId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#cbd4db] text-[#333333] flex flex-col font-sans select-text">
      {/* Top Header & Sub-bar */}
      <HeaderNav
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenGlobalSandbox={handleOpenGlobalSandbox}
        onJumpToCard={handleJumpToCard}
      />

      {/* Main Content Area - 3 Column Layout matching the reference screenshot */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto p-3 sm:p-4">
        {/* Priority Order & Execution Section at the starting of the page */}
        <ExecutionPrioritySection />

        {filteredCards.length === 0 ? (
          <div className="bg-white border border-[#b8c3cc] rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto mt-10">
            <p className="text-slate-600 font-semibold mb-2">
              No SQL commands or cards found matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#026a8d] hover:underline font-bold"
            >
              Reset filters & search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {columns.map((columnCards, colIdx) => (
              <div key={colIdx} className="flex flex-col">
                {columnCards.map((card) => (
                  <div key={card.id} id={card.id}>
                    <CheatSheetCard
                      card={card}
                      onOpenRunner={(c) => setActiveRunnerCard(c)}
                      onShowInfo={(c) => setActiveInfoCard(c)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Interactive Live SQL Runner Modal */}
      <InteractiveRunnerModal
        card={activeRunnerCard}
        isOpen={Boolean(activeRunnerCard)}
        onClose={() => setActiveRunnerCard(null)}
      />

      {/* Card Info Modal */}
      <CardInfoModal
        card={activeInfoCard}
        isOpen={Boolean(activeInfoCard)}
        onClose={() => setActiveInfoCard(null)}
      />

      {/* Footer */}
      <footer className="bg-[#b9c5cf] border-t border-[#a9b7c2] px-4 py-3 text-center text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <span>SQL Cheat Sheet — Interview & Technical Reference Grid</span>
            <span>·</span>
            <span>All Core Functions & Patterns</span>
          </div>
          <div className="text-[11px] text-slate-600 font-mono">
            Click any code line to copy · Click ⤢ to execute live in SQLite sandbox
          </div>
        </div>
      </footer>
    </div>
  );
}
