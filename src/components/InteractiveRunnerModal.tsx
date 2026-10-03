import React, { useState, useEffect } from 'react';
import { SheetCard } from '../data/sqlCheatsheetData';
import { executeQuery, resetDatabase, SCHEMA_DEFINITIONS } from '../services/sqlEngine';
import { QueryResult } from '../types';
import { Play, RotateCcw, X, Terminal, Check, Copy, Database, Table, Clock } from 'lucide-react';

interface InteractiveRunnerModalProps {
  card: SheetCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveRunnerModal: React.FC<InteractiveRunnerModalProps> = ({
  card,
  isOpen,
  onClose,
}) => {
  const [userCode, setUserCode] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('employees');

  useEffect(() => {
    if (card) {
      if (card.interactiveDemo) {
        setUserCode(card.interactiveDemo.code);
      } else {
        const firstExecutable = card.sections[0]?.lines[0]?.code || 'SELECT * FROM employees LIMIT 5;';
        setUserCode(firstExecutable);
      }
      setQueryResult(null);
    }
  }, [card]);

  if (!isOpen || !card) return null;

  const handleRun = async () => {
    if (!userCode.trim()) return;
    setIsRunning(true);
    try {
      const res = await executeQuery(userCode);
      setQueryResult(res);
    } catch (err: any) {
      setQueryResult({
        columns: [],
        values: [],
        executionTimeMs: 0,
        rowCount: 0,
        error: err?.message || String(err),
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sampleTemplates = [
    { label: 'Employees', sql: 'SELECT * FROM employees LIMIT 10;' },
    { label: '2nd Highest Salary', sql: 'SELECT DISTINCT salary AS SecondHighestSalary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 1;' },
    { label: 'Dept Avg Salary', sql: 'SELECT d.name, COUNT(e.id) as staff_cnt, ROUND(AVG(e.salary), 2) as avg_salary\nFROM departments d\nJOIN employees e ON d.id = e.department_id\nGROUP BY d.id, d.name\nHAVING COUNT(e.id) >= 2;' },
    { label: 'Running Total', sql: 'SELECT id, order_date, total_amount,\n  ROUND(SUM(total_amount) OVER (ORDER BY order_date, id), 2) AS running_total\nFROM orders;' },
    { label: 'Self Join', sql: 'SELECT e.name AS employee, e.salary, m.name AS manager, m.salary AS mgr_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.id\nWHERE e.salary > m.salary;' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#9faeb9] rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#026a8d] text-white select-none">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-300" />
            <h3 className="font-bold text-sm font-sans tracking-tight">
              Interactive SQLite Sandbox — {card.title} {card.symbol}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-[#f4f7f9]">
          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
            <span className="text-slate-500 font-bold whitespace-nowrap">Load Preset:</span>
            {sampleTemplates.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setUserCode(t.sql)}
                className="whitespace-nowrap px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Editor Header Bar */}
          <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
            <span>SQL Query (Target tables: employees, departments, customers, orders):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => {
                  if (card.interactiveDemo) setUserCode(card.interactiveDemo.code);
                  setQueryResult(null);
                }}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Code Textarea */}
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            spellCheck={false}
            rows={5}
            className="w-full p-3 font-mono text-xs bg-white text-slate-900 border border-[#b8c3cc] rounded-lg shadow-inner focus:outline-none focus:border-[#026a8d] leading-relaxed resize-none"
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#026a8d] hover:bg-[#035570] text-white font-bold text-xs rounded-md shadow-sm transition-colors disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 fill-current text-amber-300 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Executing...' : 'Execute SQL Query'}</span>
            </button>

            {queryResult && (
              <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{queryResult.executionTimeMs} ms</span>
                </span>
                {!queryResult.error && (
                  <span className="font-bold text-[#026a8d]">
                    {queryResult.rowCount} rows returned
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Query Results Viewer */}
          <div className="border border-[#b8c3cc] rounded-lg bg-white overflow-hidden shadow-xs">
            <div className="px-3 py-1.5 bg-[#edece6] border-b border-[#b8c3cc] flex items-center justify-between text-xs font-bold text-[#2c3e50] font-sans">
              <div className="flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-[#026a8d]" />
                <span>Query Result Output</span>
              </div>
            </div>

            <div className="overflow-auto max-h-56">
              {queryResult?.error ? (
                <div className="p-3 bg-rose-50 text-rose-800 font-mono text-xs border-l-4 border-rose-500">
                  <span className="font-bold block mb-1">SQL Error:</span>
                  <pre className="whitespace-pre-wrap">{queryResult.error}</pre>
                </div>
              ) : queryResult && queryResult.columns.length > 0 ? (
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f3e9d2] border-b border-[#ebdcb9] text-[#443a2b]">
                      <th className="p-2 w-8 text-center text-slate-500">#</th>
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="p-2 font-bold whitespace-nowrap border-r border-[#ebdcb9] last:border-r-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {queryResult.values.length === 0 ? (
                      <tr>
                        <td colSpan={queryResult.columns.length + 1} className="p-6 text-center text-slate-500 italic">
                          Query returned 0 rows.
                        </td>
                      </tr>
                    ) : (
                      queryResult.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          <td className="p-2 text-center text-[10px] text-slate-400">{rIdx + 1}</td>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 whitespace-nowrap border-r border-slate-100 last:border-r-0">
                              {cell === null ? (
                                <span className="text-slate-400 italic font-sans text-[11px]">NULL</span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-500 font-mono text-xs">
                  Click "Execute SQL Query" to view live SQLite rows here.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-200 bg-white flex justify-between items-center text-xs text-slate-500">
          <span>In-Memory SQLite Engine (Zero Server Latency)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
