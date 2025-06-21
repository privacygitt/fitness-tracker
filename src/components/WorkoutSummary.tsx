import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Calendar,
  Clock,
  Flame,
  Trophy,
  AlertCircle,
  Bolt,
  Download,
} from 'lucide-react';
import { workoutData } from '../data/fitnessData';

const WorkoutSummary: React.FC = () => {
  const thisWeekWorkouts = workoutData.slice(0, 7);
  const totalWorkouts = thisWeekWorkouts.length;
  const totalDuration = thisWeekWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = thisWeekWorkouts.reduce((sum, workout) => sum + workout.calories, 0);
  const averageIntensity =
    (thisWeekWorkouts.filter((w) => w.intensity === 'High').length / totalWorkouts) * 100;

  const stats = [
    {
      icon: Calendar,
      label: 'Workouts',
      value: totalWorkouts,
      unit: 'sessions',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
    },
    {
      icon: Clock,
      label: 'Total Time',
      value: totalDuration,
      unit: 'minutes',
      bg: 'bg-purple-100',
      text: 'text-purple-700',
    },
    {
      icon: Flame,
      label: 'Calories Burned',
      value: totalCalories,
      unit: 'kcal',
      bg: 'bg-orange-100',
      text: 'text-orange-700',
    },
    {
      icon: Trophy,
      label: 'High Intensity',
      value: Math.round(averageIntensity),
      unit: '%',
      bg: 'bg-green-100',
      text: 'text-green-700',
    },
  ];

  const weeklyTarget = 5;
  const completionPercent = Math.min((totalWorkouts / weeklyTarget) * 100, 100);
  const goalStatus = completionPercent >= 100
    ? { label: '🥇 Goal Met', color: 'text-green-600', Icon: Trophy }
    : completionPercent >= 60
      ? { label: '⚡ On Track', color: 'text-blue-600', Icon: Bolt }
      : { label: '💤 Behind Target', color: 'text-red-600', Icon: AlertCircle };

  const insight = () => {
    const intenseDay = thisWeekWorkouts.find((w) => w.intensity === 'High');
    return intenseDay ? `🔥 Most intense: ${intenseDay.date} (${intenseDay.type})` : '🏃 Keep moving!';
  };

  const exportToPDF = async () => {
    const node = document.getElementById('workout-summary');
    if (!node) return;

    const canvas = await html2canvas(node);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 10, pageWidth, imgHeight);
    pdf.save('Workout_Summary.pdf');
  };

  return (
    <div
      id="workout-summary"
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">This Week's Summary</h3>
          <p className="text-sm text-gray-500">Week of Jun 14 - Jun 20</p>
        </div>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`rounded-lg p-4 ${stat.bg} ${stat.text} shadow-sm flex flex-col justify-between min-h-[110px]`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold">{stat.value}</span>
            </div>
            <p className="text-sm font-medium">
              {stat.label} <span className="text-gray-600 text-xs">({stat.unit})</span>
            </p>
          </div>
        ))}
      </div>

      {/* Weekly Goal */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Weekly Goal Progress</p>
            <p className="text-xs text-gray-500">{weeklyTarget} workouts target</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">
              {totalWorkouts}/{weeklyTarget}
            </p>
            <p className="text-xs text-gray-500">{Math.round(completionPercent)}% complete</p>
          </div>
        </div>

        <div className="w-full bg-white rounded-full h-2">
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm font-medium">
          <goalStatus.Icon className={`w-4 h-4 ${goalStatus.color}`} />
          <span className={goalStatus.color}>{goalStatus.label}</span>
        </div>

        <p className="mt-2 text-xs text-blue-700 flex items-center gap-1">
          <Bolt className="w-4 h-4" />
          <span>{insight()}</span>
        </p>
      </div>
    </div>
  );
};

export default WorkoutSummary;
