import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import { Habit, ColorOption } from '../types/habit';
import { CATEGORIES, COLOR_PALETTE, ICONS } from '../constants/habitData';

interface AddHabitModalProps {
  isOpen: boolean;
  darkMode: boolean;
  onClose: () => void;
  onAddHabit: (habit: Habit) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  darkMode,
  onClose,
  onAddHabit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [color, setColor] = useState<ColorOption>(COLOR_PALETTE[0]);
  const [icon, setIcon] = useState('Target');
  const [target, setTarget] = useState(7);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddHabit({
      id: `h-${Date.now()}`,
      name: name.trim(),
      category,
      color,
      icon,
      targetPerWeek: Number(target),
      completedDays: [false, false, false, false, false, false, false],
    });
    setName('');
  };

  const labelClass = 'block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-400';
  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
    darkMode
      ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
          darkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Create New Habit</h3>
              <p className="text-xs text-slate-400">Define your daily goal and weekly frequency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className={labelClass}>Habit Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Read 20 pages, Drink 2L water..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Weekly Goal: {target} days</label>
              <input
                type="range"
                min="1"
                max="7"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full accent-indigo-500 mt-2.5 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Choose Icon</label>
            <div className="flex items-center gap-2 flex-wrap">
              {ICONS.map((item) => {
                const IconComp = item.component;
                const isSelected = icon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setIcon(item.name)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 scale-105'
                        : darkMode
                        ? 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Accent Color</label>
            <div className="flex items-center gap-2.5">
              {COLOR_PALETTE.map((col) => {
                const isSelected = color.name === col.name;
                return (
                  <button
                    type="button"
                    key={col.name}
                    onClick={() => setColor(col)}
                    className={`w-8 h-8 rounded-full ${col.bg} transition-transform cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Save Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
