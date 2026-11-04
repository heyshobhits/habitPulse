import React from 'react';
import { createRoot } from 'react-dom/client';
import HabitTrackingDashboard from './components/HabitTrackingDashboard';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HabitTrackingDashboard />
  </React.StrictMode>
);
