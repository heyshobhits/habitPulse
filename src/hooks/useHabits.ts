import { useState, useMemo, useCallback } from 'react';
import { Habit, WeekDayInfo } from '../types/habit';

export const getWeekDates = (baseDate: Date = new Date()): WeekDayInfo[] => {
  const current = new Date(baseDate);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.setDate(diff));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      isoDate: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: d.toDateString() === new Date().toDateString(),
    };
  });
};

const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-101',
    tenantId: 'tenant-cognizant-corp',
    userId: 'usr-901',
    name: 'System Design & Distributed Systems Reading',
    category: 'Learning',
    targetDaysPerWeek: 5,
    currentStreak: 12,
    longestStreak: 24,
    completions: {},
  },
  {
    id: 'h-102',
    tenantId: 'tenant-cognizant-corp',
    userId: 'usr-901',
    name: 'Morning Hydration & 30m Mobility',
    category: 'Health',
    targetDaysPerWeek: 7,
    currentStreak: 8,
    longestStreak: 15,
    completions: {},
  },
  {
    id: 'h-103',
    tenantId: 'tenant-cognizant-corp',
    userId: 'usr-901',
    name: 'Deep Work (No Notifications) - 90 mins',
    category: 'Productivity',
    targetDaysPerWeek: 5,
    currentStreak: 4,
    longestStreak: 14,
    completions: {},
  },
];

export const useHabits = () => {
  const weekDays = useMemo(() => getWeekDates(), []);
  const [habits, setHabits] = useState<Habit[]>(() => {
    const [mon, tue, wed, thu] = weekDays.map((d) => d.isoDate);
    return INITIAL_HABITS.map((h, idx) => {
      if (idx === 0) return { ...h, completions: { [mon]: true, [tue]: true, [wed]: true } };
      if (idx === 1) return { ...h, completions: { [mon]: true, [tue]: true, [wed]: true, [thu]: true } };
      return { ...h, completions: { [tue]: true, [wed]: true } };
    });
  });

  const toggleCheckIn = useCallback(async (habitId: string, isoDate: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const nextStatus = !habit.completions[isoDate];

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const streakDelta = nextStatus ? 1 : -1;
        return {
          ...h,
          currentStreak: Math.max(0, h.currentStreak + streakDelta),
          completions: { ...h.completions, [isoDate]: nextStatus },
        };
      })
    );
  }, [habits]);

  const totalWeeklyChecks = useMemo(() => {
    return habits.reduce((acc, h) => {
      const thisWeekCount = weekDays.filter((d) => h.completions[d.isoDate]).length;
      return acc + thisWeekCount;
    }, 0);
  }, [habits, weekDays]);

  const overallAdherence = useMemo(() => {
    const totalPossible = habits.reduce((acc, h) => acc + h.targetDaysPerWeek, 0);
    if (totalPossible === 0) return 0;
    return Math.min(100, Math.round((totalWeeklyChecks / totalPossible) * 100));
  }, [habits, totalWeeklyChecks]);

  const maxStreak = useMemo(() => {
    return Math.max(...habits.map((h) => h.currentStreak), 0);
  }, [habits]);

  return {
    weekDays,
    habits,
    toggleCheckIn,
    totalWeeklyChecks,
    overallAdherence,
    maxStreak,
  };
};
