export interface WorkoutData {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  intensity: 'Low' | 'Medium' | 'High';
}

export interface DailyStats {
  date: string;
  steps: number;
  calories: number;
  sleep: number;
  workouts: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  type: 'daily' | 'weekly' | 'monthly';
  deadline?: string; 
}

// Generate dummy workout data
export const workoutData: WorkoutData[] = [
  { id: '1', date: '2024-01-15', type: 'Running', duration: 45, calories: 450, intensity: 'High' },
  { id: '2', date: '2024-01-14', type: 'Weight Training', duration: 60, calories: 300, intensity: 'High' },
  { id: '3', date: '2024-01-13', type: 'Yoga', duration: 30, calories: 120, intensity: 'Low' },
  { id: '4', date: '2024-01-12', type: 'Cycling', duration: 40, calories: 380, intensity: 'Medium' },
  { id: '5', date: '2024-01-11', type: 'Swimming', duration: 35, calories: 420, intensity: 'High' },
  { id: '6', date: '2024-01-10', type: 'Running', duration: 50, calories: 500, intensity: 'High' },
  { id: '7', date: '2024-01-09', type: 'Pilates', duration: 45, calories: 200, intensity: 'Medium' },
  { id: '8', date: '2024-01-08', type: 'Weight Training', duration: 55, calories: 280, intensity: 'High' },
];

// Generate daily stats for the last 30 days
export const dailyStats: DailyStats[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    date: date.toISOString().split('T')[0],
    steps: Math.floor(Math.random() * 5000) + 8000,
    calories: Math.floor(Math.random() * 800) + 1800,
    sleep: Math.floor(Math.random() * 3) + 6,
    workouts: Math.floor(Math.random() * 3),
  };
}).reverse();

export const goals: Goal[] = [
  {
    id: '1',
    name: 'Daily Steps',
    target: 10000,
    current: 8500,
    unit: 'steps',
    type: 'daily',
    deadline: '2025-07-01',
  },
  {
    id: '2',
    name: 'Weekly Workouts',
    target: 5,
    current: 3,
    unit: 'sessions',
    type: 'weekly',
    deadline: '2025-06-22',
  },
  {
    id: '3',
    name: 'Monthly Calories',
    target: 60000,
    current: 42000,
    unit: 'kcal',
    type: 'monthly',
    deadline: '2025-06-30',
  },
  {
    id: '4',
    name: 'Daily Sleep',
    target: 8,
    current: 7.5,
    unit: 'hours',
    type: 'daily',
    deadline: '2025-07-01',
  },
  {
    id: '5',
    name: 'Water Intake',
    target: 3000,
    current: 1800,
    unit: 'ml',
    type: 'daily',
    deadline: '2025-07-01',
  },
  {
    id: '6',
    name: 'Monthly Distance Run',
    target: 60,
    current: 42,
    unit: 'km',
    type: 'monthly',
    deadline: '2025-06-30',
  },
];



export const getChartData = (period: 'daily' | 'weekly' | 'monthly') => {
  let filteredStats = [...dailyStats];
  let labels: string[] = [];
  let stepsData: number[] = [];
  let caloriesData: number[] = [];

  if (period === 'daily') {
    filteredStats = filteredStats.slice(-7);
    labels = filteredStats.map((d) =>
      new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })
    );
    stepsData = filteredStats.map((d) => d.steps);
    caloriesData = filteredStats.map((d) => d.calories);
  }

  if (period === 'weekly') {
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const week = filteredStats.slice(-((i + 1) * 7), -(i * 7) || undefined);
      if (week.length) {
        const weekSteps = week.reduce((acc, cur) => acc + cur.steps, 0);
        const weekCalories = week.reduce((acc, cur) => acc + cur.calories, 0);
        stepsData.unshift(weekSteps);
        caloriesData.unshift(weekCalories);
        const start = new Date(week[0].date);
        const end = new Date(week[week.length - 1].date);
        labels.unshift(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
      }
    }
  }

  if (period === 'monthly') {
    const monthly = new Map<string, { steps: number; calories: number }>();
    filteredStats.forEach((d) => {
      const month = new Date(d.date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      if (!monthly.has(month)) {
        monthly.set(month, { steps: d.steps, calories: d.calories });
      } else {
        const current = monthly.get(month)!;
        monthly.set(month, {
          steps: current.steps + d.steps,
          calories: current.calories + d.calories,
        });
      }
    });

    const entries = Array.from(monthly.entries()).slice(-6);
    labels = entries.map((entry) => entry[0]);
    stepsData = entries.map((entry) => entry[1].steps);
    caloriesData = entries.map((entry) => entry[1].calories);
  }

  return {
    labels,
    datasets: [
      {
        label: 'Steps',
        data: stepsData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Calories',
        data: caloriesData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
};


export const getWorkoutChartData = () => {
  const workoutTypes = workoutData.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(workoutTypes),
    datasets: [
      {
        data: Object.values(workoutTypes),
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#06B6D4',
        ],
        borderWidth: 0,
      },
    ],
  };
};