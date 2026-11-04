import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { DailyStat } from '../types/habit';

interface StreakChartProps {
  dailyData: DailyStat[];
  activeDayIndex: number;
  chartType: 'bar' | 'area';
  darkMode: boolean;
  onSetChartType: (type: 'bar' | 'area') => void;
  onSelectDay: (idx: number) => void;
}

const ChartTooltip = ({ active, payload, darkMode }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DailyStat;
    return (
      <div
        className={`px-3 py-2 rounded-xl border shadow-xl text-xs ${
          darkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <p className="font-bold mb-1">{data.fullName}</p>
        <p className="text-indigo-400 font-semibold">Completion: {data.rate}%</p>
        <p className="text-slate-400">
          {data.completed} of {data.total} habits done
        </p>
      </div>
    );
  }
  return null;
};

export const StreakChart: React.FC<StreakChartProps> = ({
  dailyData,
  activeDayIndex,
  chartType,
  darkMode,
  onSetChartType,
  onSelectDay,
}) => {
  const gridStroke = darkMode ? '#1e293b' : '#e2e8f0';
  const tickColor = darkMode ? '#94a3b8' : '#64748b';

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
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Weekly Streak Chart
          </h3>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Daily completion rate across all habits
          </p>
        </div>

        <div
          className={`flex rounded-lg p-0.5 border text-xs ${
            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {(['bar', 'area'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onSetChartType(type)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                chartType === type
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              {type === 'bar' ? 'Bars' : 'Trend'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-60 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={dailyData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: tickColor, fontSize: 11 }}
              />
              <Tooltip
                cursor={{
                  fill: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                }}
                content={<ChartTooltip darkMode={darkMode} />}
              />
              <Bar
                dataKey="rate"
                radius={[8, 8, 2, 2]}
                onClick={(data: any) => {
                  if (data && typeof data.index === 'number') {
                    onSelectDay(data.index);
                  }
                }}
                className="cursor-pointer"
              >
                {dailyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.rate === 100
                        ? '#10b981'
                        : index === activeDayIndex
                        ? '#6366f1'
                        : darkMode
                        ? '#334155'
                        : '#cbd5e1'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: tickColor, fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: tickColor, fontSize: 11 }}
              />
              <Tooltip content={<ChartTooltip darkMode={darkMode} />} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRate)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
          <span>100% Perfect Day</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" />
          <span>Selected Day</span>
        </div>
      </div>
    </div>
  );
};
