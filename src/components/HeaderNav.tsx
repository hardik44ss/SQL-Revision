import React, { useState } from 'react';
import { Search, ChevronDown, Database, Terminal, Filter, BookOpen } from 'lucide-react';
import { SQL_CHEATSHEET_CARDS } from '../data/sqlCheatsheetData';

interface HeaderNavProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenGlobalSandbox: () => void;
  onJumpToCard: (cardId: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onOpenGlobalSandbox,
  onJumpToCard,
}) => {
  const [showSectionsDropdown, setShowSectionsDropdown] = useState(false);

  const categories = [
    { id: 'all', label: 'All Cards', color: '#005b7a' },
    { id: 'core', label: 'Core & Queries', color: '#034a66' },
    { id: 'functions', label: 'Functions (String/Date/Math)', color: '#026a8d' },
    { id: 'joins', label: 'Joins & Sets', color: '#085472' },
    { id: 'window', label: 'Window Functions', color: '#c28b00' },
    { id: 'interview', label: 'Interview Questions', color: '#b83c1b' },
    { id: 'schema', label: 'DDL & Constraints', color: '#006655' },
    { id: 'perf', label: 'Indexing & ACID', color: '#7a3b00' },
  ];

  return (
    <header className="sticky top-0 z-30 shadow-md">
      {/* Primary Top Bar matching htmlcheatsheet header */}
      <div className="bg-[#026a8d] px-3 sm:px-6 h-12 flex items-center justify-between text-white select-none">
        {/* Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => {
            onSelectCategory('all');
            setSearchQuery('');
          }}
        >
          <div className="w-7 h-7 rounded bg-white/20 border border-white/40 flex items-center justify-center font-bold text-white shadow-inner">
            <Database className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight font-sans drop-shadow-xs">
              SQL Cheat Sheet
            </span>
            <span className="hidden md:inline ml-2 text-[10px] uppercase font-mono tracking-widest bg-white/15 px-1.5 py-0.5 rounded text-amber-200 border border-white/20">
              Interview & Reference Edition
            </span>
          </div>
        </div>

        {/* Right Nav: Jump to Sections + Live Sandbox */}
        <div className="flex items-center h-full gap-1">
          {/* Quick Jump Dropdown */}
          <div className="relative h-full flex items-center">
            <button
              onClick={() => setShowSectionsDropdown(!showSectionsDropdown)}
              className="flex items-center gap-1.5 px-3 h-full hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Jump to Topic</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showSectionsDropdown && (
              <div className="absolute top-12 right-0 w-64 bg-white text-slate-800 rounded-b-lg shadow-xl border border-slate-300 py-1.5 z-40 max-h-96 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  Select SQL Topic
                </div>
                {SQL_CHEATSHEET_CARDS.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => {
                      onJumpToCard(card.id);
                      setShowSectionsDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center justify-between font-medium transition-colors"
                  >
                    <span className="truncate">{card.title}</span>
                    <span className="text-slate-400 text-sm ml-2">{card.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive SQL Sandbox Button */}
          <button
            onClick={onOpenGlobalSandbox}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c28b00] hover:bg-[#a87800] text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>Live SQL Sandbox</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Category Tabs & Real-Time Search */}
      <div className="bg-[#b9c5cf] border-b border-[#a9b7c2] px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <Filter className="w-3 h-3 text-slate-600 mr-1 hidden sm:inline" />
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  backgroundColor: isActive ? cat.color : '#ffffff',
                  color: isActive ? '#ffffff' : '#2c3e50',
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                  isActive
                    ? 'border-transparent shadow-xs'
                    : 'border-[#a9b7c2] hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SQL commands (e.g. DENSE_RANK, HAVING, JOIN)..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-[#a9b7c2] rounded shadow-2xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#026a8d] font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
