import React, { useState, useMemo } from 'react';
import { Plus, Filter, Sparkles } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { KPICards } from './KPICards';
import { HabitRow } from './HabitRow';

const CATEGORIES = ['All', 'Health', 'Productivity', 'Mindfulness', 'Learning'] as const;

export const HabitTrackingDashboard: React.FC = () => {
  const { weekDays, habits, toggleCheckIn, totalWeeklyChecks, overallAdherence, maxStreak } = useHabits();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'All') return habits;
    return habits.filter((h) => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                HabitPulse Enterprise
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              High-throughput workforce wellbeing & personal execution matrix
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-medium text-sm rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
            <Plus className="w-4 h-4" /> Add Habit
          </button>
        </header>

        <KPICards
          overallAdherence={overallAdherence}
          totalWeeklyChecks={totalWeeklyChecks}
          maxStreak={maxStreak}
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="py-4 px-6 font-semibold text-xs text-slate-400 uppercase tracking-wider min-w-[280px]">
                    Habit Details
                  </th>
                  <th className="py-4 px-3 font-semibold text-xs text-slate-400 uppercase tracking-wider text-center">
                    Streak
                  </th>
                  {weekDays.map((d) => (
                    <th
                      key={d.isoDate}
                      className={`py-4 px-3 text-center text-xs font-semibold tracking-wider ${
                        d.isToday ? 'text-indigo-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <div className="uppercase">{d.dayName}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{d.dayNumber}</div>
                    </th>
                  ))}
                  <th className="py-4 px-4 font-semibold text-xs text-slate-400 uppercase tracking-wider text-center">
                    Goal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-slate-800/60">
                {filteredHabits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    weekDays={weekDays}
                    onToggle={toggleCheckIn}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTrackingDashboard;
