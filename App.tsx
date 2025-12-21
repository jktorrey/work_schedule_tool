import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { DateWheelPicker } from './components/DateWheelPicker';
import styles from './styles';

// Checks device screen size (Apple Watch detection)
const isAppleWatch = () => {
  const { width, height } = { width: 390, height: 450 }; // fallback values for RN
  return Math.min(width, height) < 400;
};

// Persistent theme hook
const usePersistedTheme = (defaultTheme: boolean) => {
  const [isDarkMode, setIsDarkMode] = useState(defaultTheme);

  useEffect(() => {
    // For RN, AsyncStorage could be used instead of localStorage
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleTheme };
};

// Rotation schedule and team start dates
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

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWheelPicker, setShowWheelPicker] = useState(false);

  const { isDarkMode, toggleTheme } = usePersistedTheme(true);

  const shift = useMemo(() => selectedTeam ? getShiftForTeamAndDate(selectedTeam, selectedDate) : null, [selectedTeam, selectedDate]);

  const fetchShift = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
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

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const getDayOfWeek = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'long' });

  const previousDay = new Date(selectedDate);
  previousDay.setDate(previousDay.getDate() - 1);
  const nextDay = new Date(selectedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const previousDayShift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, previousDay) : null;
  const nextDayShift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, nextDay) : null;

  return (
    <View style={[localStyles.container, { backgroundColor: isDarkMode ? '#000' : '#F3F4F6' }]}>
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
        {[1,2,3,4].map(team => (
          <TouchableOpacity
            key={team}
            onPress={() => setSelectedTeam(team)}
            style={[
              localStyles.teamButton,
              { backgroundColor: selectedTeam === team ? '#4F46E5' : isDarkMode ? '#1F2937' : '#E5E7EB' }
            ]}
          >
            <Text style={{ color: selectedTeam === team ? '#FFF' : isDarkMode ? '#D1D5DB' : '#111', fontWeight: '600' }}>
              {team}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Picker */}
      <View style={localStyles.dateContainer}>
        <Button title={formatDate(selectedDate)} onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(e, date) => {
              if (date) setSelectedDate(date);
              setShowDatePicker(false);
            }}
          />
        )}
      </View>

      {/* Shift Display */}
      <View style={localStyles.shiftContainer}>
        {isLoading && (
          <View style={localStyles.loadingSpinner}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {selectedTeam && shift ? (
          <View style={localStyles.currentShiftContainer}>
            <LinearGradient colors={getShiftColor(previousDayShift)} style={localStyles.circle}>
              <Text style={localStyles.circleText}>{previousDayShift}</Text>
            </LinearGradient>

            <LinearGradient colors={getShiftColor(shift)} style={localStyles.circle}>
              <Text style={localStyles.circleTextLarge}>{shift}</Text>
            </LinearGradient>

            <LinearGradient colors={getShiftColor(nextDayShift)} style={localStyles.circle}>
              <Text style={localStyles.circleText}>{nextDayShift}</Text>
            </LinearGradient>
          </View>
        ) : (
          <View style={localStyles.noShift}>
            <Text style={{ color: isDarkMode ? '#6B7280' : '#9CA3AF' }}>Select a team and date</Text>
          </View>
        )}

        {selectedTeam && shift && (
          <Text style={{ color: isDarkMode ? '#A1A1AA' : '#4B5563', marginTop: 12 }}>
            {getDayOfWeek(selectedDate)} - {SHIFT_DESCRIPTIONS[shift]}
          </Text>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 16 },
  header: { width: '100%', alignItems: 'center', marginBottom: 20, position: 'relative' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  themeButton: { position: 'absolute', top: 0, right: 0, padding: 6, borderRadius: 12 },

  teamContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  teamButton: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },

  dateContainer: { marginBottom: 20, width: '100%', alignItems: 'center' },

  shiftContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  currentShiftContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', marginBottom: 12 },

  circle: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
  circleText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  circleTextLarge: { color: '#FFF', fontSize: 24, fontWeight: '700' },

  noShift: { alignItems: 'center', justifyContent: 'center' },
  loadingSpinner: { marginBottom: 16 },
});
