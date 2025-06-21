import React, { useMemo, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dailyStats } from '../data/fitnessData';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ActivityChartProps {
  period: 'daily' | 'weekly' | 'monthly';
}

const metricLabels = {
  steps: 'Steps',
  calories: 'Calories',
  sleep: 'Sleep (hrs)',
};

const periodTextMap: Record<ActivityChartProps['period'], string> = {
  daily: 'Past 7 Days',
  weekly: 'Last 4 Weeks',
  monthly: 'Last 6 Months',
};

const metricColors: Record<string, string> = {
  steps: '#3B82F6',
  calories: '#10B981',
  sleep: '#F59E0B',
};

const ActivityChart: React.FC<ActivityChartProps> = ({ period }) => {
  const [selectedMetric, setSelectedMetric] = useState<'steps' | 'calories' | 'sleep' | 'all'>('steps');
  const chartRef = useRef<any>(null);

  const stats = [...dailyStats];

  const generateData = (metric: 'steps' | 'calories' | 'sleep') => {
    const labels: string[] = [];
    const dataPoints: number[] = [];
    const previousData: number[] = [];

    if (period === 'daily') {
      const recent = stats.slice(-7);
      const prev = stats.slice(-14, -7);
      for (let i = 0; i < 7; i++) {
        labels.push(new Date(recent[i].date).toLocaleDateString('en-US', { weekday: 'short' }));
        dataPoints.push(recent[i][metric]);
        if (prev[i]) previousData.push(prev[i][metric]);
      }
    } else if (period === 'weekly') {
      for (let i = 0; i < 4; i++) {
        const week = stats.slice(-((i + 1) * 7), -(i * 7) || undefined);
        if (week.length) {
          labels.unshift(`W${4 - i}`);
          dataPoints.unshift(week.reduce((s, e) => s + e[metric], 0));
        }
      }
      for (let i = 4; i < 8; i++) {
        const week = stats.slice(-((i + 1) * 7), -(i * 7) || undefined);
        if (week.length) previousData.unshift(week.reduce((s, e) => s + e[metric], 0));
      }
    } else {
      const groupByMonth = (entries: typeof stats) => {
        const monthMap = new Map<string, number>();
        for (const entry of entries) {
          const key = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          monthMap.set(key, (monthMap.get(key) || 0) + entry[metric]);
        }
        return Array.from(monthMap.entries());
      };
      const all = groupByMonth(stats);
      const recent = all.slice(-6);
      const prev = all.slice(-12, -6);
      labels.push(...recent.map(([k]) => k));
      dataPoints.push(...recent.map(([_, v]) => v));
      previousData.push(...prev.map(([_, v]) => v));
    }

    return { labels, dataPoints, previousData };
  };

  const allLabels = generateData('steps').labels;

  const chartData = useMemo(() => {
    if (selectedMetric === 'all') {
      return {
        labels: allLabels,
        datasets: (['steps', 'calories', 'sleep'] as const).map((metric) => ({
          label: metricLabels[metric],
          data: generateData(metric).dataPoints,
          borderColor: metricColors[metric],
          backgroundColor: `${metricColors[metric]}33`,
          fill: false,
          tension: 0.4,
        })),
      };
    }

    const { labels, dataPoints } = generateData(selectedMetric);
    return {
      labels,
      datasets: [
        {
          label: metricLabels[selectedMetric],
          data: dataPoints,
          borderColor: metricColors[selectedMetric],
          backgroundColor: `${metricColors[selectedMetric]}33`,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [selectedMetric, period]);

  const { dataPoints, previousData } = generateData(selectedMetric !== 'all' ? selectedMetric : 'steps');
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;
  const avgCurr = Math.round(avg(dataPoints));
  const avgPrev = Math.round(avg(previousData));
  const change = avgPrev ? Math.round(((avgCurr - avgPrev) / avgPrev) * 100) : 0;
  const isUp = change >= 0;

  const handleExportImage = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = 'activity-trend.png';
      link.href = chartRef.current.toBase64Image();
      link.click();
    }
  };

  const handleExportPDF = async () => {
    const canvas = chartRef.current?.canvas;
    if (!canvas) return;

    const image = await html2canvas(canvas);
    const imageData = image.toDataURL('image/png');

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
    pdf.setFont('helvetica');
    pdf.setFontSize(18);
    pdf.text('📊 Activity Report', 40, 40);

    pdf.setFontSize(12);
    pdf.text(`Metric: ${selectedMetric === 'all' ? 'All Metrics' : metricLabels[selectedMetric]}`, 40, 70);
    pdf.text(`Period: ${periodTextMap[period]}`, 40, 90);

    if (selectedMetric !== 'all') {
      pdf.text(`Average: ${avgCurr}`, 40, 110);
      pdf.text(`Change: ${isUp ? '↑' : '↓'} ${Math.abs(change)}%`, 40, 130);
    }

    pdf.addImage(imageData, 'PNG', 40, selectedMetric !== 'all' ? 150 : 100, 500, 250);
    pdf.save('activity-report.pdf');
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const label = context.dataset.label;
            const unit =
              label === 'Steps' ? 'steps' :
              label === 'Calories' ? 'kcal' :
              'hrs';
            return ` ${label}: ${value.toLocaleString()} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        border: { display: false },
        ticks: {
          callback: (val: number | string) =>
            typeof val === 'number' && val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val,
        },
      },
    },
    interaction: { mode: 'nearest' as const, axis: 'x' as const, intersect: false },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 2,
      },
      line: {
        borderWidth: 3,
        tension: 0.4,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Trends</h3>
          <p className="text-sm text-gray-500">{periodTextMap[period]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['steps', 'calories', 'sleep', 'all'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMetric(m)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedMetric === m
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {m === 'all' ? 'All' : metricLabels[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[300px] sm:h-[360px] md:h-[400px] mb-6">
        <Line data={chartData} options={chartOptions} ref={chartRef} />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            onClick={handleExportImage}
            className="bg-white text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md text-xs flex items-center gap-1 shadow-sm"
          >
            <Download className="w-3 h-3" /> Image
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-white text-green-600 hover:bg-green-50 px-2 py-1 rounded-md text-xs flex items-center gap-1 shadow-sm"
          >
            <Download className="w-3 h-3" /> PDF
          </button>
        </div>
      </div>

      {selectedMetric !== 'all' && (
        <div className="text-sm text-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
          <p>
            Avg {metricLabels[selectedMetric]}: <strong>{avgCurr.toLocaleString()}</strong>
          </p>
          <p className={`${isUp ? 'text-green-600' : 'text-red-500'}`}>
            {isUp ? '📈' : '📉'} {Math.abs(change)}% {isUp ? '↑ vs previous' : '↓ vs previous'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityChart;
