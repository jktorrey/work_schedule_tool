import { useState, useEffect, useRef } from 'react';

interface WheelPickerProps {
  values: (string | number)[];
  selectedIndex: number;
  onChange: (index: number) => void;
  height?: number;
  isDarkMode?: boolean;
}

function WheelPicker({ values, selectedIndex, onChange, height = 200, isDarkMode = true }: WheelPickerProps) {
  const [scrollIndex, setScrollIndex] = useState(selectedIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollIndex(selectedIndex);
  }, [selectedIndex]);

  const handleScroll = (direction: 'up' | 'down') => {
    const newIndex = direction === 'up' 
      ? Math.max(0, scrollIndex - 1)
      : Math.min(values.length - 1, scrollIndex + 1);
    setScrollIndex(newIndex);
    onChange(newIndex);
  };

  const itemHeight = 48;
  const visibleItems = 3;

  return (
    <div className="relative flex flex-col items-center" style={{ height: `${height}px` }}>
      {/* Up arrow */}
      <button
        onClick={() => handleScroll('up')}
        className={`w-full h-10 flex items-center justify-center ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
        disabled={scrollIndex === 0}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Picker container */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full overflow-hidden"
        style={{ height: `${itemHeight * visibleItems}px` }}
      >
        {/* Center highlight bar */}
        <div 
          className={`absolute left-0 right-0 ${isDarkMode ? 'bg-gray-700/30 border-y border-gray-600' : 'bg-gray-300/30 border-y border-gray-400'} pointer-events-none z-10`}
          style={{
            top: `${itemHeight}px`,
            height: `${itemHeight}px`,
          }}
        />

        {/* Items */}
        <div className="relative w-full h-full flex flex-col items-center justify-start pt-12">
          {values.map((value, index) => {
            const offset = index - scrollIndex;
            const absOffset = Math.abs(offset);
            const opacity = Math.max(0.2, 1 - absOffset * 0.4);
            const scale = Math.max(0.75, 1 - absOffset * 0.2);
            
            return (
              <button
                key={index}
                onClick={() => {
                  setScrollIndex(index);
                  onChange(index);
                }}
                className={`flex items-center justify-center ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-all duration-200`}
                style={{
                  height: `${itemHeight}px`,
                  opacity,
                  transform: `scale(${scale})`,
                }}
              >
                <span className={index === scrollIndex ? '' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Down arrow */}
      <button
        onClick={() => handleScroll('down')}
        className={`w-full h-10 flex items-center justify-center ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
        disabled={scrollIndex === values.length - 1}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

interface DateWheelPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isDarkMode?: boolean;
}

export function DateWheelPicker({ selectedDate, onDateChange, isDarkMode = true }: DateWheelPickerProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const [monthIndex, setMonthIndex] = useState(selectedDate.getMonth());
  const [day, setDay] = useState(selectedDate.getDate());
  const [yearIndex, setYearIndex] = useState(years.indexOf(selectedDate.getFullYear()));

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(monthIndex, years[yearIndex] || currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    // Adjust day if it exceeds the number of days in the selected month
    const maxDay = getDaysInMonth(monthIndex, years[yearIndex] || currentYear);
    const validDay = Math.min(day, maxDay);
    
    const newDate = new Date(years[yearIndex] || currentYear, monthIndex, validDay);
    onDateChange(newDate);
  }, [monthIndex, day, yearIndex]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'} rounded-2xl p-5 border w-full max-w-md`}>
      <div className="grid grid-cols-3 gap-4">
        <WheelPicker
          values={months}
          selectedIndex={monthIndex}
          onChange={setMonthIndex}
          height={192}
          isDarkMode={isDarkMode}
        />
        <WheelPicker
          values={days}
          selectedIndex={days.indexOf(day)}
          onChange={(index) => setDay(days[index])}
          height={192}
          isDarkMode={isDarkMode}
        />
        <WheelPicker
          values={years}
          selectedIndex={yearIndex}
          onChange={setYearIndex}
          height={192}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}
