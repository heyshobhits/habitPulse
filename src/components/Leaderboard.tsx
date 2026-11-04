import React from 'react';
import { Award, Flame } from 'lucide-react';
import { Habit } from '../types/habit';
import { DAYS_OF_WEEK } from '../constants/habitData';
import { calculateBestWeekStreak } from '../utils/streakUtils';

interface LeaderboardProps {
  habits: Habit[];
  darkMode: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ habits, darkMode }) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition-colors ${
        darkMode
          ? 'bg-slate-900/70 border-slate-800/90'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Habit Streak Breakdown
          </h3>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Best contiguous streaks this week
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {habits.map((h) => {
          const bestStreak = calculateBestWeekStreak(h.completedDays);
          const totalDone = h.completedDays.filter(Boolean).length;
          return (
            <div key={h.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium truncate max-w-[180px]">{h.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {totalDone}/7 days
                  </span>
                  <span className="font-bold text-amber-400 flex items-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    {bestStreak}d
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {h.completedDays.map((done, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-sm transition-all ${
                      done ? h.color.bg : darkMode ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                    title={`${DAYS_OF_WEEK[i].full}: ${done ? 'Completed' : 'Missed'}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
