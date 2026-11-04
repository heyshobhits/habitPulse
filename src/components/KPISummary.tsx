import React from 'react';
import { TrendingUp, Flame, Trophy, Calendar } from 'lucide-react';
import { HabitStats } from '../types/habit';
import { DAYS_OF_WEEK } from '../constants/habitData';

interface KPISummaryProps {
  stats: HabitStats;
  totalHabitsCount: number;
  activeDayIndex: number;
  darkMode: boolean;
  onMarkAllForDay: (dayIdx: number) => void;
}

export const KPISummary: React.FC<KPISummaryProps> = ({
  stats,
  totalHabitsCount,
  activeDayIndex,
  darkMode,
  onMarkAllForDay,
}) => {
  const cardClass = `p-5 rounded-2xl border transition-all ${
    darkMode
      ? 'bg-slate-900/70 border-slate-800/90'
      : 'bg-white border-slate-200/80 shadow-sm'
  }`;
  const labelClass = `text-xs font-semibold uppercase tracking-wider ${
    darkMode ? 'text-slate-400' : 'text-slate-500'
  }`;
  const mutedClass = `text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <span className={labelClass}>Weekly Completion</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold">{stats.weeklyCompletionRate}%</span>
          <span className={mutedClass}>
            {stats.totalCheckins}/{totalHabitsCount * 7} check-ins
          </span>
        </div>
        <div className="mt-3 w-full h-2 rounded-full bg-slate-800/40 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${stats.weeklyCompletionRate}%` }}
          />
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <span className={labelClass}>Best Active Streak</span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Flame className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold">{stats.topStreak}</span>
          <span className="text-sm font-semibold text-amber-500">
            {stats.topStreak === 1 ? 'Day' : 'Days'}
          </span>
        </div>
        <p className={`mt-2 truncate ${mutedClass}`} title={stats.topStreakHabit}>
          Lead: <span className="font-medium text-amber-500">{stats.topStreakHabit}</span>
        </p>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <span className={labelClass}>100% Perfect Days</span>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold">{stats.perfectDaysCount}</span>
          <span className={mutedClass}>/ 7 days this week</span>
        </div>
        <div className="mt-3 flex gap-1.5">
          {stats.dailyData.map((d, i) => (
            <div
              key={i}
              title={`${d.fullName}: ${d.rate}%`}
              className={`flex-1 h-2 rounded-full transition-all ${
                d.rate === 100
                  ? 'bg-indigo-500'
                  : d.rate >= 50
                  ? 'bg-indigo-500/40'
                  : darkMode
                  ? 'bg-slate-800'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <span className={labelClass}>{DAYS_OF_WEEK[activeDayIndex].full} Focus</span>
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">
              {stats.dailyData[activeDayIndex]?.completed || 0}/{totalHabitsCount}
            </span>
            <span className={mutedClass}>completed</span>
          </div>
          <button
            onClick={() => onMarkAllForDay(activeDayIndex)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
          >
            Complete All
          </button>
        </div>
        <p className={`mt-2 ${mutedClass}`}>Click any day column below to switch focus day</p>
      </div>
    </section>
  );
};
