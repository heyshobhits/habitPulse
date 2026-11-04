export interface DayOfWeek {
  short: string;
  full: string;
  index: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  text?: string;
  lightBg?: string;
}

export interface ColorOption {
  name: string;
  hex: string;
  bg: string;
  ring: string;
  light: string;
  text: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  color: ColorOption;
  icon: string;
  targetPerWeek: number;
  completedDays: boolean[];
}

export interface DailyStat {
  name: string;
  fullName: string;
  completed: number;
  total: number;
  rate: number;
  index: number;
}

export interface HabitStats {
  weeklyCompletionRate: number;
  totalCheckins: number;
  totalTarget: number;
  topStreak: number;
  topStreakHabit: string;
  perfectDaysCount: number;
  dailyData: DailyStat[];
}
