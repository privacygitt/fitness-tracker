import React, { useEffect, useState } from 'react';
import {
  Footprints,
  Flame,
  Moon,
  Dumbbell,
  Play,
  PlusCircle,
  BarChart,
} from 'lucide-react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import TimePeriodToggle from './components/TimePeriodToggle';
import ActivityChart from './components/ActivityChart';
import WorkoutChart from './components/WorkoutChart';
import ActivityLog from './components/ActivityLog';
import GoalProgress from './components/GoalProgress';
import WorkoutSummary from './components/WorkoutSummary';
import { dailyStats, workoutData } from './data/fitnessData';

const MAX_DURATION = 60 * 60;

function App() {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [completedSessions, setCompletedSessions] = useState<{ duration: number; date: string }[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const todayStats = dailyStats[dailyStats.length - 1];
  const yesterdayStats = dailyStats[dailyStats.length - 2];

  useEffect(() => {
    const saved = localStorage.getItem('completedWorkouts');
    if (saved) setCompletedSessions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('completedWorkouts', JSON.stringify(completedSessions));
  }, [completedSessions]);

  useEffect(() => {
    if (isTimerRunning) {
      const id = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
  }, [isTimerRunning]);

  useEffect(() => {
    if (timer >= MAX_DURATION && isTimerRunning) {
      if (intervalId) clearInterval(intervalId);
      setIsTimerRunning(false);
      setCompletedSessions([...completedSessions, { duration: timer, date: new Date().toLocaleDateString() }]);
      setTimer(0);
    }
  }, [timer, isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const calculateChange = (today: number, yesterday: number) => {
    if (!yesterday) return 0;
    return Math.round(((today - yesterday) / yesterday) * 100);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'Start Workout') {
      if (!isTimerRunning) {
        setTimer(0);
        setIsTimerRunning(true);
      }
    }

    if (action === 'Stop Workout') {
      if (intervalId) clearInterval(intervalId);
      const now = new Date();
      setCompletedSessions([...completedSessions, { duration: timer, date: now.toLocaleDateString() }]);
      setIsTimerRunning(false);
      setTimer(0);
    }

    if (action === 'Log Activity') {
      setShowLog(prev => !prev);
      setShowReports(false);
    }

    if (action === 'View Reports') {
      setShowReports(prev => !prev);
      setShowLog(false);
    }
  };

  const exportCSV = () => {
    const headers = 'Date,Duration (in seconds)\n';
    const rows = completedSessions.map(s => `${s.date},${s.duration}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout_sessions.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatsCard title="Daily Steps" value={todayStats.steps.toLocaleString()} unit="steps" change={calculateChange(todayStats.steps, yesterdayStats.steps)} icon={Footprints} color="blue" />
          <StatsCard title="Calories Burned" value={todayStats.calories.toLocaleString()} unit="kcal" change={calculateChange(todayStats.calories, yesterdayStats.calories)} icon={Flame} color="orange" />
          <StatsCard title="Workouts" value={todayStats.workouts} unit="sessions" change={calculateChange(todayStats.workouts || 1, yesterdayStats.workouts || 1)} icon={Dumbbell} color="purple" />
          <StatsCard title="Sleep" value={todayStats.sleep} unit="hours" change={calculateChange(todayStats.sleep, yesterdayStats.sleep)} icon={Moon} color="green" />
        </div>

        {/* Time Period Toggle */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <TimePeriodToggle selected={timePeriod} onChange={setTimePeriod} />
        </div>

        {/* Activity Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="lg:col-span-2">
            <ActivityChart period={timePeriod} />
          </div>
          <div>
            <WorkoutChart />
          </div>
        </div>

        {/* Goal Progress, Workout Summary, Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <GoalProgress />
          <WorkoutSummary />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {!isTimerRunning ? (
                  <button onClick={() => handleQuickAction('Start Workout')} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg hover:scale-[1.02] transition-transform text-sm sm:text-base">
                    <Play className="w-4 h-4" />
                    Start Workout
                  </button>
                ) : (
                  <button onClick={() => handleQuickAction('Stop Workout')} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition text-sm sm:text-base">
                    🛑 Stop Workout
                  </button>
                )}

                <button onClick={() => handleQuickAction('Log Activity')} className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base">
                  <PlusCircle className="w-4 h-4" />
                  Log Activity
                </button>
                <button onClick={() => handleQuickAction('View Reports')} className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base">
                  <BarChart className="w-4 h-4" />
                  View Reports
                </button>
              </div>
            </div>

            {/* Timer */}
            {isTimerRunning && (
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-blue-500" strokeWidth="3" strokeDasharray={`${(timer / MAX_DURATION) * 100}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-mono text-blue-600">{formatTime(timer)}</p>
                  <p className="text-sm font-semibold text-blue-700">Workout in Progress</p>
                  <button onClick={() => handleQuickAction('Stop Workout')} className="mt-1 px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
                    Stop Workout
                  </button>
                </div>
              </div>
            )}

            {/* Log */}
            {showLog && (
              <div className="mt-6 text-sm text-gray-700">
                <h4 className="font-semibold mb-2">Recent Activities</h4>
                <ul className="list-disc pl-5">
                  {workoutData.slice(0, 3).map(w => (
                    <li key={w.id}>
                      {w.date}: {w.type} - {w.duration} min
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reports */}
            {showReports && (
              <div className="mt-6 text-sm text-gray-700">
                <h4 className="font-semibold mb-2">Workout Sessions</h4>
                {completedSessions.length === 0 ? (
                  <p>No completed workouts.</p>
                ) : (
                  <>
                    <ul className="list-disc pl-5 mb-3">
                      {completedSessions.map((s, idx) => (
                        <li key={idx}>
                          {s.date} — {formatTime(s.duration)}
                        </li>
                      ))}
                    </ul>
                    <button onClick={exportCSV} className="text-blue-600 hover:underline text-sm">
                      ⬇ Download as CSV
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Activity Log Table */}
        <div className="mb-8">
          <ActivityLog />
        </div>
      </main>
    </div>
  );
}

export default App;
