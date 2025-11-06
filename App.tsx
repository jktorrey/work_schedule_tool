import { useState } from 'react';
import { DateWheelPicker } from './components/DateWheelPicker';
import { Sun, Moon } from 'lucide-react';

// 10-week rotation schedule (70 days)
// S = Straight, M = Mid, B = Break, D = Day
const ROTATION_SCHEDULE = [
  // Week 1
  'Straight', 'Straight', 'Straight', 'Straight', 'Straight', 'Straight', 'Straight',
  // Week 2
  'Mid', 'Mid', 'Mid', 'Mid', 'Break', 'Break', 'Break',
  // Week 3
  'Mid', 'Mid', 'Mid', 'Break', 'Break', 'Break', 'Break',
  // Week 4
  'Day', 'Day', 'Day', 'Break', 'Break', 'Break', 'Break',
  // Week 5
  'Day', 'Day', 'Day', 'Day', 'Break', 'Break', 'Break',
  // Week 6
  'Break', 'Break', 'Break', 'Day', 'Day', 'Day', 'Day',
  // Week 7
  'Break', 'Break', 'Break', 'Break', 'Day', 'Day', 'Day',
  // Week 8
  'Break', 'Break', 'Break', 'Break', 'Mid', 'Mid', 'Mid',
  // Week 9
  'Break', 'Break', 'Break', 'Mid', 'Mid', 'Mid', 'Mid',
  // Week 10
  'Straight', 'Straight', 'Straight', 'Straight', 'Straight', 'Straight', 'Straight'
];

// Team start dates - each team starts at a different point in the rotation
const TEAM_START_DATES = {
  1: new Date('2025-02-02'),
  2: new Date('2025-02-16'),
  3: new Date('2025-03-02'),
  4: new Date('2025-01-05'),
};

function getShiftForTeamAndDate(team: number, date: Date): string {
  const teamStartDate = TEAM_START_DATES[team as keyof typeof TEAM_START_DATES];
  const daysDiff = Math.floor((date.getTime() - teamStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const rotationLength = 70; // 10 weeks * 7 days
  const dayInRotation = ((daysDiff % rotationLength) + rotationLength) % rotationLength;
  
  return ROTATION_SCHEDULE[dayInRotation];
}

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showWheelPicker, setShowWheelPicker] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const shift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, selectedDate) : null;
  
  // Calculate shifts for previous and next day
  const getPreviousDay = (date: Date) => {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    return prevDay;
  };
  
  const getNextDay = (date: Date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };
  
  const previousDayShift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, getPreviousDay(selectedDate)) : null;
  const nextDayShift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, getNextDay(selectedDate)) : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDayOfWeek = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getShiftColor = (shift: string | null) => {
    switch (shift) {
      case 'Straight':
        return 'bg-purple-600';
      case 'Mid':
        return 'bg-indigo-600';
      case 'Break':
        return 'bg-emerald-600';
      case 'Day':
        return 'bg-amber-500';
      default:
        return 'bg-gray-600';
    }
  };

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left = go to next day
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
    }
    
    if (isRightSwipe) {
      // Swipe right = go to previous day
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setSelectedDate(prevDay);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gray-100'} flex items-center justify-center p-4`}>
      {/* Apple Watch Container */}
      <div className={`relative w-[390px] h-[450px] ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-black border-gray-800' : 'bg-gradient-to-br from-gray-200 to-white border-gray-300'} rounded-[60px] border-8 shadow-2xl overflow-hidden`}>
        {/* Screen */}
        <div className={`w-full h-full ${isDarkMode ? 'bg-black' : 'bg-white'} p-6 flex flex-col`}>
          {/* Header */}
          <div className="text-center mb-6 relative">
            <h1 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 text-2xl`}>Shift Happens</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>Select Team & Date</p>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`absolute top-0 right-0 p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors`}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          {/* Team Selection */}
          <div className="mb-6">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base mb-2 text-center`}>Team</p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((team) => (
                <button
                  key={team}
                  onClick={() => setSelectedTeam(team)}
                  className={`h-12 rounded-2xl transition-all flex items-center justify-center text-lg ${
                    selectedTeam === team
                      ? 'bg-blue-600 text-white scale-105'
                      : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-3">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base mb-2 text-center`}>Date</p>
            <button
              onClick={() => setShowWheelPicker(true)}
              className={`w-full h-10 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'} rounded-2xl flex items-center justify-center gap-2 transition-colors`}
            >
              <span className="text-base">{formatDate(selectedDate)}</span>
            </button>
          </div>

          {/* Shift Display */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {selectedTeam && shift ? (
              <div 
                className="text-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="flex items-center justify-center gap-4 mb-3">
                  {/* Previous Day */}
                  <div className={`w-16 h-16 rounded-full ${getShiftColor(previousDayShift)} flex items-center justify-center shadow-md opacity-60`}>
                    <span className="text-white text-sm">{previousDayShift}</span>
                  </div>
                  
                  {/* Current Day */}
                  <div className={`w-32 h-32 rounded-full ${getShiftColor(shift)} flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-3xl">{shift}</span>
                  </div>
                  
                  {/* Next Day */}
                  <div className={`w-16 h-16 rounded-full ${getShiftColor(nextDayShift)} flex items-center justify-center shadow-md opacity-60`}>
                    <span className="text-white text-sm">{nextDayShift}</span>
                  </div>
                </div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                  {getDayOfWeek(selectedDate)}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} flex items-center justify-center mb-3`}>
                  <span className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} text-3xl`}>--</span>
                </div>
                <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-600'} text-base`}>
                  {!selectedTeam ? 'Select a team' : 'Select a date'}
                </p>
              </div>
            )}
          </div>

          {/* Wheel Picker Overlay */}
          {showWheelPicker && (
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-white/90'} flex flex-col items-center justify-center p-6 z-50`}>
              <DateWheelPicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                isDarkMode={isDarkMode}
              />
              <button
                onClick={() => setShowWheelPicker(false)}
                className="w-full mt-4 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center text-lg"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
