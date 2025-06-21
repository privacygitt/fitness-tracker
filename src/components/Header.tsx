import React, { useEffect, useRef, useState } from 'react';
import {
  Activity, User, Bell, RefreshCcw, ChevronDown, X,
} from 'lucide-react';

const fallbackQuotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Success starts with self-discipline.",
  "Don't limit your challenges. Challenge your limits.",
  "Every workout counts, no matter how small.",
  "You don't have to be extreme, just consistent.",
  "Train like a beast, look like a beauty.",
  "One more rep. One step closer.",
  "No excuses. Just results.",
  "Sore today, strong tomorrow.",
  "Progress, not perfection.",
];

const dummyNotifications = [
  "🔥 You completed your workout streak!",
  "📅 New weekly summary is available.",
  "🎯 80% of your goals are on track.",
  "👟 Time for your next run!",
];

const Header: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('motivationalQuote');
    const count = localStorage.getItem('quoteRefreshCount');
    if (saved) setQuote(saved);
    else refreshQuote();
    if (count) setRefreshCount(Number(count));

    const interval = setInterval(() => setTime(new Date()), 1000);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, []);

  const refreshQuote = () => {
    const newQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    setQuote(newQuote);
    setFadeKey(prev => prev + 1);
    setRefreshCount(prev => {
      const updated = prev + 1;
      localStorage.setItem('quoteRefreshCount', updated.toString());
      return updated;
    });
    localStorage.setItem('motivationalQuote', newQuote);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 20) return 'Good evening';
    return 'Good night';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex justify-center items-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">FitTrack</h1>
              <p className="text-xs text-gray-500">Personal Fitness Dashboard</p>
            </div>
          </div>

          {/* Quote */}
          <div className="flex-1 text-center max-w-xs sm:max-w-md px-2">
            <p key={fadeKey} className="text-sm text-blue-600 font-medium italic animate-fade-in leading-snug">
              “{quote}”
            </p>
            <button
              onClick={refreshQuote}
              className="mt-1 flex items-center justify-center gap-1 text-xs text-blue-500 hover:underline"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Quote ({refreshCount})
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Time & Greeting */}
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-600 font-medium">{getGreeting()}, Vinay 👋</p>
              <p className="text-sm font-mono text-gray-800">{formatTime(time)}</p>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="relative p-2 text-gray-400 hover:text-blue-600"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 max-w-[90vw] bg-white shadow-lg rounded-lg border z-50 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Notifications</p>
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {dummyNotifications.map((note, idx) => (
                      <li key={idx} className="bg-gray-50 p-2 rounded hover:bg-gray-100 transition">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow ring-2 ring-blue-300 relative"
              >
                <User className="w-4 h-4 text-white" />
                <ChevronDown className="w-3 h-3 absolute bottom-0 right-0 text-white" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 max-w-[90vw] bg-white rounded-lg shadow-lg border z-50">
                  <ul className="text-sm text-gray-700 divide-y">
                    {[
                      { label: "🎯 Goal Progress", id: "goal-progress" },
                      { label: "📊 Activity Trends", id: "activity-trends" },
                      { label: "⚡ Quick Actions", id: "quick-actions" },
                      { label: "📝 Workout Summary", id: "workout-summary" },
                    ].map(({ label, id }) => (
                      <li key={id}>
                        <button
                          onClick={() => scrollTo(id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
