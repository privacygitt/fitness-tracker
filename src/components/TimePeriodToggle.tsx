import React from 'react';

interface TimePeriodToggleProps {
  selected: 'daily' | 'weekly' | 'monthly';
  onChange: (period: 'daily' | 'weekly' | 'monthly') => void;
}

const TimePeriodToggle: React.FC<TimePeriodToggleProps> = ({ selected, onChange }) => {
  const options = [
    { value: 'daily' as const, label: 'Daily' },
    { value: 'weekly' as const, label: 'Weekly' },
    { value: 'monthly' as const, label: 'Monthly' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex min-w-max bg-gray-100 rounded-full shadow-inner p-1 border border-gray-200">
        {options.map((option) => {
          const isActive = selected === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-5 py-2 sm:px-4 sm:py-1.5 rounded-full text-sm font-medium focus:outline-none transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimePeriodToggle;
