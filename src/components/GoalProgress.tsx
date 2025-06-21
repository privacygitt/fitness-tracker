import React, { useState } from 'react';
import {
  Target,
  Pencil,
  Sparkles,
  Medal,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { goals } from '../data/fitnessData';

const GoalProgress: React.FC = () => {
  const [editableGoalId, setEditableGoalId] = useState<string | null>(null);
  const [editedTargets, setEditedTargets] = useState<{ [goalId: string]: number }>({});
  const [showAll, setShowAll] = useState(false);

  const getProgressPercentage = (current: number, target: number) =>
    Math.min((current / target) * 100, 100);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  const getBadge = (percentage: number) => {
    if (percentage >= 100)
      return (
        <span className="text-yellow-500 font-bold flex items-center">
          <Medal className="w-4 h-4 mr-1" /> Gold
        </span>
      );
    if (percentage >= 75) return <span className="text-gray-700 font-semibold">Silver</span>;
    if (percentage >= 50) return <span className="text-orange-400 font-semibold">Bronze</span>;
    return null;
  };

  const getMotivation = (percentage: number) => {
    if (percentage >= 100) return '🌟 You’ve nailed it! Time to set a new goal!';
    if (percentage >= 75) return '🚀 Almost there, don’t stop now!';
    if (percentage >= 50) return '💡 You’re halfway. Keep pushing!';
    return '🔥 Let’s kick it off today!';
  };

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `${diff} day(s) left` : `⚠️ Overdue by ${Math.abs(diff)} day(s)`;
  };

  const handleTargetEdit = (goalId: string) => {
    setEditableGoalId(goalId);
    setEditedTargets((prev) => ({
      ...prev,
      [goalId]: goals.find((g) => g.id === goalId)?.target || 0,
    }));
  };

  const saveEditedTarget = (goalId: string) => {
    const newTarget = editedTargets[goalId];
    const goal = goals.find((g) => g.id === goalId);
    if (goal && newTarget && newTarget > 0) {
      goal.target = newTarget;
    }
    setEditableGoalId(null);
  };

  const visibleGoals = showAll ? goals : goals.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
        <Target className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        {visibleGoals.map((goal) => {
          const target =
            editableGoalId === goal.id ? editedTargets[goal.id] : goal.target;
          const percentage = getProgressPercentage(goal.current, target);
          const progressColor = getProgressColor(percentage);
          const badge = getBadge(percentage);
          const deadlineDisplay = getDaysLeft((goal as any).deadline);

          return (
            <div key={goal.id} className="space-y-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">{goal.type} goal</p>
                </div>
                <div className="text-sm text-right sm:text-left">
                  {editableGoalId === goal.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        className="border rounded px-2 py-1 w-20 text-sm"
                        value={editedTargets[goal.id]}
                        onChange={(e) =>
                          setEditedTargets((prev) => ({
                            ...prev,
                            [goal.id]: parseInt(e.target.value),
                          }))
                        }
                      />
                      <button
                        onClick={() => saveEditedTarget(goal.id)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-900">
                        {goal.current.toLocaleString()} / {target.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{goal.unit}</p>
                      <button
                        onClick={() => handleTargetEdit(goal.id)}
                        className="text-xs text-blue-500 hover:underline mt-1 flex items-center justify-end"
                      >
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 ${progressColor} rounded-full transition-all duration-700`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 gap-2">
                <span>{percentage.toFixed(1)}% complete</span>
                <div className="flex gap-2 items-center flex-wrap">
                  {badge}
                  {deadlineDisplay && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays className="w-4 h-4" />
                      {deadlineDisplay}
                    </div>
                  )}
                </div>
              </div>

              {/* Motivation */}
              <div className="flex items-center gap-2 text-blue-600 text-xs font-medium mt-1">
                <Sparkles className="w-4 h-4" />
                {getMotivation(percentage)}
              </div>

              <hr className="border-gray-100" />
            </div>
          );
        })}
      </div>

      {/* Toggle Button */}
      {goals.length > 3 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            {showAll ? 'Show Less' : 'Show More'}
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
