import React from 'react';
import { Flame, RotateCcw, Sun, Moon, Plus } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onResetWeek: () => void;
  onOpenModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onResetWeek,
  onOpenModal,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
        darkMode
          ? 'bg-slate-950/80 border-slate-800/80'
          : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight">HabitPulse</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                Weekly Tracker
              </span>
            </div>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Build consistency, one day at a time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onResetWeek}
            title="Reset Current Week"
            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              darkMode
                ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Week</span>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className={`p-2.5 rounded-xl border transition-all ${
              darkMode
                ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-amber-400'
                : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenModal}
            className="px-4 py-2.5 rounded-xl font-medium text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
