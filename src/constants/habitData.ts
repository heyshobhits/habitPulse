import {
  Dumbbell,
  BookOpen,
  Brain,
  Heart,
  Zap,
  Coffee,
  Target,
} from 'lucide-react';
import { DayOfWeek, Category, ColorOption, Habit } from '../types/habit';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  { short: 'Mon', full: 'Monday', index: 0 },
  { short: 'Tue', full: 'Tuesday', index: 1 },
  { short: 'Wed', full: 'Wednesday', index: 2 },
  { short: 'Thu', full: 'Thursday', index: 3 },
  { short: 'Fri', full: 'Friday', index: 4 },
  { short: 'Sat', full: 'Saturday', index: 5 },
  { short: 'Sun', full: 'Sunday', index: 6 },
];

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Habits', color: 'bg-slate-500' },
  { id: 'Health', name: 'Health & Fitness', color: 'bg-emerald-500', text: 'text-emerald-500', lightBg: 'bg-emerald-500/10' },
  { id: 'Mindfulness', name: 'Mindfulness', color: 'bg-violet-500', text: 'text-violet-500', lightBg: 'bg-violet-500/10' },
  { id: 'Learning', name: 'Learning', color: 'bg-blue-500', text: 'text-blue-500', lightBg: 'bg-blue-500/10' },
  { id: 'Productivity', name: 'Productivity', color: 'bg-amber-500', text: 'text-amber-500', lightBg: 'bg-amber-500/10' },
];

export const COLOR_PALETTE: ColorOption[] = [
  { name: 'Emerald', hex: '#10b981', bg: 'bg-emerald-500', ring: 'ring-emerald-500', light: 'bg-emerald-500/15', text: 'text-emerald-500' },
  { name: 'Blue', hex: '#3b82f6', bg: 'bg-blue-500', ring: 'ring-blue-500', light: 'bg-blue-500/15', text: 'text-blue-500' },
  { name: 'Violet', hex: '#8b5cf6', bg: 'bg-violet-500', ring: 'ring-violet-500', light: 'bg-violet-500/15', text: 'text-violet-500' },
  { name: 'Rose', hex: '#f43f5e', bg: 'bg-rose-500', ring: 'ring-rose-500', light: 'bg-rose-500/15', text: 'text-rose-500' },
  { name: 'Amber', hex: '#f59e0b', bg: 'bg-amber-500', ring: 'ring-amber-500', light: 'bg-amber-500/15', text: 'text-amber-500' },
  { name: 'Cyan', hex: '#06b6d4', bg: 'bg-cyan-500', ring: 'ring-cyan-500', light: 'bg-cyan-500/15', text: 'text-cyan-500' },
];

export const ICONS = [
  { name: 'Dumbbell', component: Dumbbell },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Brain', component: Brain },
  { name: 'Heart', component: Heart },
  { name: 'Zap', component: Zap },
  { name: 'Coffee', component: Coffee },
  { name: 'Target', component: Target },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    name: 'Morning Hydration (500ml)',
    category: 'Health',
    color: COLOR_PALETTE[1],
    icon: 'Heart',
    targetPerWeek: 7,
    completedDays: [true, true, true, true, true, true, false],
  },
  {
    id: 'h-2',
    name: '45m Strength or Cardio',
    category: 'Health',
    color: COLOR_PALETTE[0],
    icon: 'Dumbbell',
    targetPerWeek: 5,
    completedDays: [true, false, true, true, false, true, false],
  },
  {
    id: 'h-3',
    name: 'Read 20 Pages',
    category: 'Learning',
    color: COLOR_PALETTE[4],
    icon: 'BookOpen',
    targetPerWeek: 6,
    completedDays: [true, true, false, true, true, true, false],
  },
  {
    id: 'h-4',
    name: '15m Mindfulness Meditation',
    category: 'Mindfulness',
    color: COLOR_PALETTE[2],
    icon: 'Brain',
    targetPerWeek: 7,
    completedDays: [false, true, true, true, true, true, false],
  },
  {
    id: 'h-5',
    name: 'Deep Work Session (No Phone)',
    category: 'Productivity',
    color: COLOR_PALETTE[3],
    icon: 'Zap',
    targetPerWeek: 5,
    completedDays: [true, true, true, true, true, false, false],
  },
];
