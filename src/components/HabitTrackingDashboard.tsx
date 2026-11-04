import React from 'react';
import { useHabits } from '../hooks/useHabits';
import { Header } from './Header';
import { KPISummary } from './KPISummary';
import { HabitTable } from './HabitTable';
import { StreakChart } from './StreakChart';
import { Leaderboard } from './Leaderboard';
import { AddHabitModal } from './AddHabitModal';

export default function HabitTrackingDashboard() {
  const {
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
  } = useHabits();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onResetWeek={resetWeek}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <KPISummary
          stats={stats}
          totalHabitsCount={habits.length}
          activeDayIndex={activeDayIndex}
          darkMode={darkMode}
          onMarkAllForDay={markAllForDay}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <HabitTable
              filteredHabits={filteredHabits}
              selectedCategory={selectedCategory}
              activeDayIndex={activeDayIndex}
              darkMode={darkMode}
              confirmClearId={confirmClearId}
              onSelectCategory={setSelectedCategory}
              onSelectDay={setActiveDayIndex}
              onToggleHabitDay={toggleHabitDay}
              onSetConfirmClearId={setConfirmClearId}
              onDeleteHabit={handleDeleteHabit}
              onOpenModal={() => setIsModalOpen(true)}
            />
          </div>

          <div className="space-y-6">
            <StreakChart
              dailyData={stats.dailyData}
              activeDayIndex={activeDayIndex}
              chartType={chartType}
              darkMode={darkMode}
              onSetChartType={setChartType}
              onSelectDay={setActiveDayIndex}
            />
            <Leaderboard habits={habits} darkMode={darkMode} />
          </div>
        </div>
      </main>

      <AddHabitModal
        isOpen={isModalOpen}
        darkMode={darkMode}
        onClose={() => setIsModalOpen(false)}
        onAddHabit={handleAddHabit}
      />
    </div>
  );
}
