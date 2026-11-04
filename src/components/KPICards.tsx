import React from 'react';
import { TrendingUp, CheckCircle2, Flame } from 'lucide-react';

interface KPICardsProps {
  overallAdherence: number;
  totalWeeklyChecks: number;
  maxStreak: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  overallAdherence,
  totalWeeklyChecks,
  maxStreak,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Week Target Adherence</p>
          <h3 className="text-2xl font-bold text-white mt-1">{overallAdherence}%</h3>
        </div>
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Check-ins</p>
          <h3 className="text-2xl font-bold text-white mt-1">{totalWeeklyChecks} logged</h3>
        </div>
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Max Active Streak</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{maxStreak} Days</h3>
        </div>
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
          <Flame className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
