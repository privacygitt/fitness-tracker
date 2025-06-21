import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const baseColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

const weekLabels = ['Running', 'Cycling', 'Yoga', 'Weights'];
const weekValues = [3, 2, 1, 2];

const monthLabels = ['Running', 'Cycling', 'Yoga', 'Weights', 'Swimming', 'HIIT'];
const monthValues = [10, 8, 4, 6, 5, 3];

const WorkoutChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('month');
  const [displayTotal, setDisplayTotal] = useState(0);
  const [visible, setVisible] = useState<boolean[]>([]);

  const labels = timeframe === 'week' ? weekLabels : monthLabels;
  const values = timeframe === 'week' ? weekValues : monthValues;

  useEffect(() => {
    setVisible(new Array(labels.length).fill(true));
  }, [timeframe]);

  const filteredLabels = labels.filter((_, i) => visible[i]);
  const filteredValues = values.filter((_, i) => visible[i]);
  const filteredColors = baseColors.filter((_, i) => visible[i]);

  const chartData = {
    labels: filteredLabels,
    datasets: [
      {
        data: filteredValues,
        backgroundColor: filteredColors,
      },
    ],
  };

  const totalActual = filteredValues.reduce((sum, val) => sum + val, 0);

  useEffect(() => {
    let frame = 0;
    const steps = 30;
    const increment = totalActual / steps;
    setDisplayTotal(0);
    const animate = () => {
      frame++;
      setDisplayTotal((prev) => {
        const next = prev + increment;
        return next >= totalActual ? totalActual : next;
      });
      if (frame < steps) requestAnimationFrame(animate);
    };
    animate();
  }, [chartData]);

  const toggleVisibility = (index: number) => {
    setVisible((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const getInsight = () => {
    if (!filteredValues.length) return 'No workout data selected';
    const max = Math.max(...filteredValues);
    const i = filteredValues.indexOf(max);
    return `Focus area: ${filteredLabels[i]}`;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percent}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 4,
        borderColor: 'white',
        hoverOffset: 12,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Workout Distribution</h3>
          <p className="text-sm text-gray-500">{timeframe === 'week' ? 'Past 7 Days' : 'This Month'}</p>
        </div>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
              timeframe === 'week'
                ? 'bg-blue-600 text-white'
                : 'text-blue-600 border border-blue-200 hover:bg-blue-100'
            } transition`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
              timeframe === 'month'
                ? 'bg-purple-600 text-white'
                : 'text-purple-600 border border-purple-200 hover:bg-purple-100'
            } transition`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-56 sm:h-64 w-full">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white px-3 py-2 rounded-full shadow-md text-center">
            <p className="text-lg font-semibold text-gray-900">{Math.round(displayTotal)}</p>
            <p className="text-xs text-gray-500">Total Workouts</p>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 text-sm text-center sm:text-left text-blue-600 font-medium">
        {getInsight()}
      </div>

      {/* Toggle Chips */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => toggleVisibility(i)}
            className={`text-xs px-3 py-1 rounded-full border ${
              visible[i]
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-gray-100 text-gray-400 border-gray-200 line-through'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkoutChart;
