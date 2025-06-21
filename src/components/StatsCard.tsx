import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon: typeof LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    text: 'text-blue-700',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    text: 'text-green-700',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    text: 'text-purple-700',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    text: 'text-orange-700',
  },
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  color,
}) => {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 cursor-pointer">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
        {/* Text content */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>

          {/* Change label */}
          {change !== undefined && (
            <div className="flex items-center mt-1 sm:mt-2 space-x-1">
              <span
                className={`text-sm font-medium ${
                  change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change >= 0 ? '+' : ''}
                {change}%
              </span>
              <span className="text-sm text-gray-400">from yesterday</span>
            </div>
          )}
        </div>

        {/* Icon bubble */}
        <div className={`${colors.bg} p-3 rounded-lg flex items-center justify-center self-end sm:self-auto`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
