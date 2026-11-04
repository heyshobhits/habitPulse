export type HabitCategory = 'Health' | 'Productivity' | 'Mindfulness' | 'Learning';

export interface Habit {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  category: HabitCategory;
  targetDaysPerWeek: number;
  currentStreak: number;
  longestStreak: number;
  completions: Record<string, boolean>; // key: YYYY-MM-DD
}

export interface WeekDayInfo {
  isoDate: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

export interface CheckInPayload {
  tenant_id: string;
  user_id: string;
  habit_id: string;
  local_completion_date: string;
  action: 'COMPLETED' | 'UNCHECKED';
  source_client: string;
}
