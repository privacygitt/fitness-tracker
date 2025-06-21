import React, { useState, useMemo } from 'react';
import {
  Calendar, Clock, Flame, Pencil, Trash2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { WorkoutData, workoutData as initialData } from '../data/fitnessData';

const ActivityLog: React.FC = () => {
  const [data, setData] = useState<WorkoutData[]>(initialData);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'calories'>('date');
  const [editId, setEditId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<WorkoutData>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    return data
      .filter((w) =>
        (filter === 'all' || w.type.toLowerCase().includes(filter.toLowerCase())) &&
        (w.type.toLowerCase().includes(search.toLowerCase()) ||
          w.intensity.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'duration') return b.duration - a.duration;
        return b.calories - a.calories;
      });
  }, [data, filter, search, sortBy]);

  const pageData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const updateWorkout = (id: string) => {
    setData(prev =>
      prev.map(w => w.id === id ? { ...w, ...editFields } as WorkoutData : w)
    );
    setEditId(null);
  };

  const deleteWorkout = (id: string) => {
    setData(prev => prev.filter(w => w.id !== id));
  };

  const stats = useMemo(() => {
    const totalTime = filtered.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = filtered.reduce((sum, w) => sum + w.calories, 0);
    const avg = filtered.length ? Math.round(totalCalories / filtered.length) : 0;
    return { total: filtered.length, totalTime, totalCalories, avg };
  }, [filtered]);

  const getColor = (level: string) => ({
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-700',
  }[level] || 'bg-gray-100 text-gray-700');

  return (
    <div className="p-4 sm:p-6 bg-white shadow-xl border rounded-xl space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">📝 Activity Log</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <input
            placeholder="🔍 Search..."
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm w-full sm:w-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-lg border text-sm border-gray-300 w-full sm:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Yoga">Yoga</option>
            <option value="Swimming">Swimming</option>
            <option value="Weight Training">Weight Training</option>
            <option value="Pilates">Pilates</option>
          </select>
          <select
            className="px-3 py-2 rounded-lg border text-sm border-gray-300 w-full sm:w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="date">Sort by Date</option>
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 font-medium">
            <tr>
              <th className="p-3">Activity</th>
              <th className="p-3">Date</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Calories</th>
              <th className="p-3">Intensity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((workout) => (
              <tr key={workout.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium capitalize">
                  {editId === workout.id ? (
                    <input
                      value={editFields.type || workout.type}
                      onChange={(e) => setEditFields({ ...editFields, type: e.target.value })}
                      className="border p-1 rounded w-28"
                    />
                  ) : (
                    workout.type
                  )}
                </td>
                <td className="p-3 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(workout.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-3 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {workout.duration} min
                  </div>
                </td>
                <td className="p-3 text-gray-700">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {workout.calories} kcal
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getColor(workout.intensity)}`}>
                    {workout.intensity}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {editId === workout.id ? (
                    <button
                      onClick={() => updateWorkout(workout.id)}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditId(workout.id);
                        setEditFields(workout);
                      }}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm gap-2">
        <div className="text-gray-600">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-gray-700 font-medium">📊 Summary</p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-2 text-sm text-gray-600">
          <span>🔥 Total Calories: <strong>{stats.totalCalories} kcal</strong></span>
          <span>⏱️ Total Time: <strong>{stats.totalTime} min</strong></span>
          <span>🏋️‍♂️ Total Workouts: <strong>{stats.total}</strong></span>
          <span>📈 Avg Calories: <strong>{stats.avg} kcal</strong></span>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
