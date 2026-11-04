import React from 'react';
import { CheckCircle2, Sparkles, Check, Flame, Trash2, X, Target } from 'lucide-react';
import { Habit } from '../types/habit';
import { DAYS_OF_WEEK, CATEGORIES, ICONS } from '../constants/habitData';
import { calculateCurrentStreak } from '../utils/streakUtils';

interface HabitTableProps {
  filteredHabits: Habit[];
  selectedCategory: string;
  activeDayIndex: number;
  darkMode: boolean;
  confirmClearId: string | null;
  onSelectCategory: (catId: string) => void;
  onSelectDay: (dayIdx: number) => void;
  onToggleHabitDay: (habitId: string, dayIdx: number) => void;
  onSetConfirmClearId: (id: string | null) => void;
  onDeleteHabit: (id: string) => void;
  onOpenModal: () => void;
}

const renderIcon = (iconName: string, className = 'w-5 h-5') => {
  const found = ICONS.find((i) => i.name === iconName);
  const IconComponent = found ? found.component : Target;
  return <IconComponent className={className} />;
};

export const HabitTable: React.FC<HabitTableProps> = ({
  filteredHabits,
  selectedCategory,
  activeDayIndex,
  darkMode,
  confirmClearId,
  onSelectCategory,
  onSelectDay,
  onToggleHabitDay,
  onSetConfirmClearId,
  onDeleteHabit,
  onOpenModal,
}) => {
  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-colors ${
        darkMode
          ? 'bg-slate-900/70 border-slate-800/90'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div
        className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          darkMode ? 'border-slate-800' : 'border-slate-100'
        }`}
      >
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            Weekly Habit Log
          </h2>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Check off your daily goals to build your weekly streak
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : darkMode
                  ? 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`border-b text-xs font-semibold uppercase tracking-wider ${
                darkMode
                  ? 'border-slate-800/80 text-slate-400 bg-slate-900/40'
                  : 'border-slate-100 text-slate-500 bg-slate-50/70'
              }`}
            >
              <th className="py-3.5 pl-5 pr-3 min-w-[210px]">Habit</th>
              {DAYS_OF_WEEK.map((day, idx) => {
                const isSelectedDay = activeDayIndex === idx;
                return (
                  <th
                    key={day.short}
                    onClick={() => onSelectDay(idx)}
                    className={`py-3.5 px-2 text-center cursor-pointer select-none transition-colors ${
                      isSelectedDay
                        ? darkMode
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'bg-indigo-50 text-indigo-600'
                        : 'hover:text-indigo-400'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{day.short}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          isSelectedDay ? 'bg-indigo-500' : 'bg-transparent'
                        }`}
                      />
                    </div>
                  </th>
                );
              })}
              <th className="py-3.5 px-3 text-center">Streak</th>
              <th className="py-3.5 pl-2 pr-5 text-right">Goal</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-sm ${
              darkMode ? 'divide-slate-800/60' : 'divide-slate-100'
            }`}
          >
            {filteredHabits.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-8 h-8 text-indigo-400 stroke-1" />
                    <p className="font-medium">No habits found in this category.</p>
                    <button
                      onClick={onOpenModal}
                      className="mt-1 text-xs text-indigo-400 hover:underline"
                    >
                      Add your first habit
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredHabits.map((habit) => {
                const completedCount = habit.completedDays.filter(Boolean).length;
                const currentStreak = calculateCurrentStreak(habit.completedDays);
                const progressPct = Math.min(
                  100,
                  Math.round((completedCount / habit.targetPerWeek) * 100)
                );

                return (
                  <tr
                    key={habit.id}
                    className={`group transition-colors ${
                      darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/90'
                    }`}
                  >
                    <td className="py-4 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${habit.color.light} ${habit.color.text}`}
                        >
                          {renderIcon(habit.icon, 'w-5 h-5')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold truncate">{habit.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[11px] font-medium ${
                                darkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              {habit.category}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span
                              className={`text-[11px] ${
                                completedCount >= habit.targetPerWeek
                                  ? 'text-emerald-400 font-semibold'
                                  : darkMode
                                  ? 'text-slate-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {completedCount}/{habit.targetPerWeek}d target
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {habit.completedDays.map((isDone, dayIdx) => {
                      const isSelectedCol = activeDayIndex === dayIdx;
                      return (
                        <td
                          key={dayIdx}
                          className={`py-4 px-1.5 text-center transition-colors ${
                            isSelectedCol
                              ? darkMode
                                ? 'bg-indigo-500/5'
                                : 'bg-indigo-50/50'
                              : ''
                          }`}
                        >
                          <button
                            onClick={() => onToggleHabitDay(habit.id, dayIdx)}
                            aria-label={`Mark ${habit.name} for ${DAYS_OF_WEEK[dayIdx].full}`}
                            className={`w-9 h-9 rounded-xl inline-flex items-center justify-center transition-all duration-200 cursor-pointer ${
                              isDone
                                ? `${habit.color.bg} text-white shadow-md scale-100 hover:opacity-90`
                                : darkMode
                                ? 'bg-slate-800/90 hover:bg-slate-700 text-transparent border border-slate-700/70'
                                : 'bg-slate-100 hover:bg-slate-200 text-transparent border border-slate-200'
                            }`}
                          >
                            <Check
                              className={`w-5 h-5 stroke-[2.5] transition-transform duration-200 ${
                                isDone ? 'scale-100' : 'scale-50'
                              }`}
                            />
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-4 px-3 text-center">
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          currentStreak >= 3
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : currentStreak > 0
                            ? darkMode
                              ? 'bg-slate-800 text-slate-200'
                              : 'bg-slate-100 text-slate-700'
                            : darkMode
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }`}
                      >
                        <Flame
                          className={`w-3.5 h-3.5 ${
                            currentStreak >= 3 ? 'text-amber-400 fill-amber-400' : ''
                          }`}
                        />
                        <span>{currentStreak}d</span>
                      </div>
                    </td>

                    <td className="py-4 pl-2 pr-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-16 hidden sm:block">
                          <div className="flex justify-between text-[11px] font-semibold mb-1">
                            <span>{progressPct}%</span>
                          </div>
                          <div
                            className={`w-full h-1.5 rounded-full overflow-hidden ${
                              darkMode ? 'bg-slate-800' : 'bg-slate-200'
                            }`}
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${habit.color.bg}`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {confirmClearId === habit.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onDeleteHabit(habit.id)}
                              className="px-2 py-1 rounded bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-500"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => onSetConfirmClearId(null)}
                              className="p-1 text-slate-400 hover:text-slate-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSetConfirmClearId(habit.id)}
                            title="Remove habit"
                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
