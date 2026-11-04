import React from 'react';
import { CheckCircle2, Circle, Flame } from 'lucide-react';
import { Habit, WeekDayInfo } from '../types/habit';

interface HabitRowProps {
  habit: Habit;
  weekDays: WeekDayInfo[];
  onToggle: (habitId: string, isoDate: string) => void;
}

export const HabitRow: React.FC<HabitRowProps> = ({ habit, weekDays, onToggle }) => {
  const completedDaysCount = weekDays.filter((d) => habit.completions[d.isoDate]).length;

  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="py-4 px-6">
        <div className="font-medium text-slate-200 text-sm">{habit.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {habit.category}
          </span>
        </div>
      </td>

      <td className="py-4 px-3 text-center">
        <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          <span>{habit.currentStreak}d</span>
        </div>
      </td>

      {weekDays.map((day) => {
        const isChecked = !!habit.completions[day.isoDate];
        return (
          <td key={day.isoDate} className="py-4 px-3 text-center">
            <button
              onClick={() => onToggle(habit.id, day.isoDate)}
              className={`p-1.5 rounded-lg transition-all transform active:scale-90 ${
                isChecked
                  ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800'
              }`}
              aria-label={`Toggle ${habit.name} on ${day.dayName}`}
            >
              {isChecked ? (
                <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
          </td>
        );
      })}

      <td className="py-4 px-4 text-center">
        <span
          className={`text-xs font-mono font-medium ${
            completedDaysCount >= habit.targetDaysPerWeek ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          {completedDaysCount} / {habit.targetDaysPerWeek}d
        </span>
      </td>
    </tr>
  );
};
