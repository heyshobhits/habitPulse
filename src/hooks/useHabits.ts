import { useState, useMemo, useEffect } from 'react';
import { Habit, HabitStats } from '../types/habit';
import { INITIAL_HABITS, DAYS_OF_WEEK } from '../constants/habitData';
import { calculateBestWeekStreak } from '../utils/streakUtils';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('habitpulse_data_v1');
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(5);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
  const [confirmClearId, setConfirmClearId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('habitpulse_data_v1', JSON.stringify(habits));
    } catch (e) {
      console.error('Could not save habits to storage', e);
    }
  }, [habits]);

  const toggleHabitDay = (habitId: string, dayIdx: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const updatedDays = [...h.completedDays];
        updatedDays[dayIdx] = !updatedDays[dayIdx];
        return { ...h, completedDays: updatedDays };
      })
    );
  };

  const handleAddHabit = (newHabit: Habit) => {
    setHabits((prev) => [...prev, newHabit]);
    setIsModalOpen(false);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setConfirmClearId(null);
  };

  const markAllForDay = (dayIdx: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        const updated = [...h.completedDays];
        updated[dayIdx] = true;
        return { ...h, completedDays: updated };
      })
    );
  };

  const resetWeek = () => {
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        completedDays: [false, false, false, false, false, false, false],
      }))
    );
  };

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'all') return habits;
    return habits.filter((h) => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const stats: HabitStats = useMemo(() => {
    const totalHabits = habits.length;
    if (totalHabits === 0) {
      return {
        weeklyCompletionRate: 0,
        totalCheckins: 0,
        totalTarget: 0,
        topStreak: 0,
        topStreakHabit: 'None',
        perfectDaysCount: 0,
        dailyData: DAYS_OF_WEEK.map((d) => ({
          name: d.short,
          fullName: d.full,
          completed: 0,
          total: 0,
          rate: 0,
          index: d.index,
        })),
      };
    }

    let totalCheckins = 0;
    let totalTarget = 0;
    let topStreak = 0;
    let topStreakHabit = 'None';

    habits.forEach((h) => {
      const checkins = h.completedDays.filter(Boolean).length;
      totalCheckins += checkins;
      totalTarget += h.targetPerWeek;
      const best = calculateBestWeekStreak(h.completedDays);
      if (best > topStreak) {
        topStreak = best;
        topStreakHabit = h.name;
      }
    });

    const weeklyCompletionRate = Math.min(
      100,
      Math.round((totalCheckins / (totalHabits * 7)) * 100)
    );

    let perfectDaysCount = 0;
    const dailyData = DAYS_OF_WEEK.map((day, idx) => {
      const completedOnDay = habits.filter((h) => h.completedDays[idx]).length;
      const rate = Math.round((completedOnDay / totalHabits) * 100);
      if (completedOnDay === totalHabits && totalHabits > 0) perfectDaysCount++;
      return {
        name: day.short,
        fullName: day.full,
        completed: completedOnDay,
        total: totalHabits,
        rate,
        index: idx,
      };
    });

    return {
      weeklyCompletionRate,
      totalCheckins,
      totalTarget,
      topStreak,
      topStreakHabit,
      perfectDaysCount,
      dailyData,
    };
  }, [habits]);

  return {
    habits,
    darkMode,
    setDarkMode,
    selectedCategory,
    setSelectedCategory,
    activeDayIndex,
    setActiveDayIndex,
    isModalOpen,
    setIsModalOpen,
    chartType,
    setChartType,
    confirmClearId,
    setConfirmClearId,
    toggleHabitDay,
    handleAddHabit,
    handleDeleteHabit,
    markAllForDay,
    resetWeek,
    filteredHabits,
    stats,
  };
};
