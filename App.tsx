import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// --- Apple Watch detection ---
const isAppleWatch = () => {
  const { width, height } = { width: 390, height: 450 }; // fallback values
  return Math.min(width, height) < 400;
};

// --- Theme hook ---
const usePersistedTheme = (defaultTheme: boolean) => {
  const [isDarkMode, setIsDarkMode] = useState(defaultTheme);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  return { isDarkMode, toggleTheme };
};

// --- Rotation schedule and team start dates ---
const ROTATION_SCHEDULE = [
  'Straight','Straight','Straight','Straight','Straight','Straight','Straight',
  'Mid','Mid','Mid','Mid','Break','Break','Break',
  'Mid','Mid','Mid','Break','Break','Break','Break',
  'Day','Day','Day','Break','Break','Break','Break',
  'Day','Day','Day','Day','Break','Break','Break',
  'Break','Break','Break','Day','Day','Day','Day',
  'Break','Break','Break','Break','Day','Day','Day',
  'Break','Break','Break','Break','Mid','Mid','Mid',
  'Break','Break','Break','Mid','Mid','Mid','Mid',
  'Straight','Straight','Straight','Straight','Straight','Straight','Straight'
];

const TEAM_START_DATES: Record<number, Date> = {
  1: new Date('2025-02-02'),
  2: new Date('2025-02-16'),
  3: new Date('2025-03-02'),
  4: new Date('2025-01-05'),
};

function getShiftForTeamAndDate(team: number, date: Date): string {
  const start = TEAM_START_DATES[team];
  const daysDiff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const dayInRotation = ((daysDiff % 70) + 70) % 70;
  return ROTATION_SCHEDULE[dayInRotation];
}

const SHIFT_DESCRIPTIONS: Record<string, string> = {
  'Straight': 'Duty Hours: Flexible (weekends/holidays permitted only when covering)',
  'Mid': 'Duty Hours: 1700-0500',
  'Break': 'Duty Hours: None',
  'Day': 'Duty Hours: 0500-1700',
};

// --- ShiftCircle component ---
interface ShiftCircleProps {
  shift: string | null;
  colors: string[];
  large?: boolean;
}

const ShiftCircle: React.FC<ShiftCircleProps> = ({ shift, colors, large = false }) => {
  return (
    <LinearGradient
      colors={colors}
      style={[
        localStyles.circle,
        large && { width: 90, height: 90, borderRadius: 45 },
      ]}
    >
      <Text style={large ? localStyles.circleTextLarge : localStyles.circleText}>
        {shift}
      </Text>
    </LinearGradient>
  );
};

// --- Main App ---
export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { isDarkMode, toggleTheme } = usePersistedTheme(true);

  const shift = useMemo(
    () => selectedTeam ? getShiftForTeamAndDate(selectedTeam, selectedDate) : null,
    [selectedTeam, selectedDate]
  );

  const fetchShift = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  useEffect(() => {
    if (selectedTeam) fetchShift();
  }, [selectedTeam, selectedDate]);

  const getShiftColor = (shift: string | null) => {
    switch (shift) {
      case 'Straight': return ['#A78BFA', '#7C3AED'];
      case 'Mid': return ['#4F46E5', '#6366F1'];
      case 'Break': return ['#34D399', '#10B981'];
      case 'Day': return ['#FBBF24', '#F59E0B'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getDayOfWeek = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long' });

  const previousDay = new Date(selectedDate); previousDay.setDate(previousDay.getDate() - 1);
  const nextDay = new Date(selectedDate); nextDay.setDate(nextDay.getDate() + 1);

  const previousDayShift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, previousDay) : null;
  const nextDayShift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, nextDay) : null;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'left', 'right', 'bottom']}
        style={[localStyles.container, { backgroundColor: isDarkMode ? '#000' : '#F3F4F6' }]}
      >
        {/* Header */}
        <View style={localStyles.header}>
          <Text style={[localStyles.title, { color: isDarkMode ? '#FFF' : '#111' }]}>Shift Happens</Text>
          <Text style={{ color: isDarkMode ? '#A1A1AA' : '#4B5563' }}>Select team & date</Text>
          <TouchableOpacity onPress={toggleTheme} style={localStyles.themeButton}>
            {isDarkMode ? <Feather name="sun" size={24} color="#FFD700" /> : <Feather name="moon" size={24} color="#1F2937" />}
          </TouchableOpacity>
        </View>

        {/* Team Selection */}
        <View style={localStyles.teamContainer}>
          {[1, 2, 3, 4].map(team => (
            <TouchableOpacity
              key={team}
              onPress={() => setSelectedTeam(team)}
              style={[
                localStyles.teamButton,
                {
                  backgroundColor: selectedTeam === team ? '#4F46E5' : isDarkMode ? '#1F2937' : '#E5E7EB',
                },
              ]}
            >
              <Text
                style={[
                  localStyles.teamButtonText,
                  { color: selectedTeam === team ? '#FFF' : isDarkMode ? '#D1D5DB' : '#111' },
                ]}
              >
                {team}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Picker */}
        <TouchableOpacity
          style={[localStyles.dateText, { backgroundColor: isDarkMode ? '#1F2937' : '#E5E7EB' }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: isDarkMode ? '#FFF' : '#111', fontWeight: '600', textAlign: 'center' }}>
            {formatDate(selectedDate)}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            themeVariant={isDarkMode ? 'dark' : 'light'}
            textColor={isDarkMode ? '#FFF' : '#000'}
            onChange={(e, date) => {
              if (date) setSelectedDate(date);
              setShowDatePicker(false);
            }}
          />
        )}

        {/* Shift Display */}
        <View style={localStyles.shiftContainer}>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" style={{ marginBottom: 16 }} />}

          {selectedTeam && shift ? (
            <View style={localStyles.currentShiftContainer}>
              <ShiftCircle shift={previousDayShift} colors={getShiftColor(previousDayShift)} />
              <ShiftCircle shift={shift} colors={getShiftColor(shift)} large />
              <ShiftCircle shift={nextDayShift} colors={getShiftColor(nextDayShift)} />
            </View>
          ) : (
            <Text style={{ color: isDarkMode ? '#6B7280' : '#9CA3AF', marginTop: 12 }}>
              Select a team and date
            </Text>
          )}

          {selectedTeam && shift && (
            <Text style={{ color: isDarkMode ? '#A1A1AA' : '#4B5563', marginTop: 12 }}>
              {getDayOfWeek(selectedDate)} - {SHIFT_DESCRIPTIONS[shift]}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
  },
  header: { width: '100%', alignItems: 'center', marginBottom: 20, position: 'relative' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  themeButton: { position: 'absolute', top: 0, right: 0, padding: 6, borderRadius: 12 },

  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  teamButton: {
    flex: 1,
    minWidth: 50,
    maxWidth: 100,
    paddingVertical: 14,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  teamButtonText: { fontWeight: '600', textAlign: 'center' },

  dateText: {
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: 20,
  },

  shiftContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  currentShiftContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginBottom: 12 },

  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  circleText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  circleTextLarge: { color: '#FFF', fontSize: 24, fontWeight: '700' },
});
