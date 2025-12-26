import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableScreens } from 'react-native-screens';
import SettingsScreen from './Settings';

enableScreens();
const Stack = createNativeStackNavigator();

/* =========================
   Rotation schedule and team start dates
   ========================= */
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
  const dayInRotation = ((daysDiff % 70) + 70) % 70; // wrap correctly for negative days
  return ROTATION_SCHEDULE[dayInRotation];
}

const SHIFT_DESCRIPTIONS: Record<string, string> = {
  'Straight': 'Duty Hours: Flexible (weekends/holidays permitted only when covering)',
  'Mid': 'Duty Hours: 1700-0500',
  'Break': 'Duty Hours: None',
  'Day': 'Duty Hours: 0500-1700',
};

/* =========================
   Shift Circle
   ========================= */
function ShiftCircle({ shift, colors, large = false }: { shift: string | null; colors: string[]; large?: boolean }) {
  const SIZE = large ? 110 : 70;
  return (
    <LinearGradient
      colors={colors}
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#FFF', fontWeight: '600', textAlign: 'center' }}>
        {shift ?? ''}
      </Text>
    </LinearGradient>
  );
}

/* =========================
   Home Screen
   ========================= */
function HomeScreen({ navigation, isDarkMode, selectedTeam, setSelectedTeam, selectedDate, setSelectedDate }: any) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedTeam) {
      setIsLoading(true);
      const t = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(t);
    }
  }, [selectedTeam, selectedDate]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const screenBg = isDarkMode ? '#000000' : '#F3F4F6';
  const cardBg = isDarkMode ? '#111827' : '#FFFFFF';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#111827';
  const textSecondary = isDarkMode ? '#9CA3AF' : '#4B5563';

  // Persist team and date
  useEffect(() => {
    if (selectedTeam !== null) AsyncStorage.setItem('@selectedTeam', selectedTeam.toString());
  }, [selectedTeam]);

  useEffect(() => {
    AsyncStorage.setItem('@selectedDate', selectedDate.toISOString());
  }, [selectedDate]);

  // Get current shift and neighboring shifts
  const shift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, selectedDate) : null;
  const prevShift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000)) : null;
  const nextShift = selectedTeam ? getShiftForTeamAndDate(selectedTeam, new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)) : null;

  const getShiftColor = (s: string | null) => {
    switch (s) {
      case 'Day': return ['#FBBF24', '#F59E0B'];
      case 'Mid': return ['#6366F1', '#4F46E5'];
      case 'Break': return ['#34D399', '#10B981'];
      case 'Straight': return ['#F472B6', '#EC4899'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: screenBg }}>
      {/* Header */}
      <View style={{ padding: 16, backgroundColor: cardBg, alignItems: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: textPrimary }}>Shift Happens</Text>
        <Text style={{ color: textSecondary }}>Select team & date</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={{ position: 'absolute', right: 16, top: 16 }}
        >
          <Text style={{ color: textSecondary, fontSize: 18 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Team Buttons */}
      <View style={{ flexDirection: 'row', padding: 16, justifyContent: 'space-between' }}>
        {[1, 2, 3, 4].map((team) => (
          <TouchableOpacity
            key={team}
            onPress={() => setSelectedTeam(team)}
            style={{
              flex: 1,
              marginHorizontal: 4,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: selectedTeam === team ? '#4F46E5' : isDarkMode ? '#1F2937' : '#E5E7EB',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: selectedTeam === team ? '#FFFFFF' : isDarkMode ? '#D1D5DB' : '#111827', fontWeight: '600' }}>
              Team {team}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Picker Toggle */}
      <TouchableOpacity
        onPress={() => setShowDatePicker((prev) => !prev)}
        style={{ marginHorizontal: 16, padding: 14, borderRadius: 12, backgroundColor: cardBg, alignItems: 'center' }}
      >
        <Text style={{ color: textPrimary, fontWeight: '600' }}>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>

      {/* Inline Date Picker */}
          {showDatePicker && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: isDarkMode ? '#111827' : '#FFF',
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  themeVariant={isDarkMode ? 'dark' : 'light'}
                  textColor={isDarkMode ? '#FFFFFF' : '#000000'}
                  onChange={(_, d) => {
                    if (d) setSelectedDate(d); // update date live
                  }}
                />

                {/* Done button to close the picker */}
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={{
                    marginTop: 12,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: isDarkMode ? '#4F46E5' : '#E5E7EB',
                  }}
                >
                  <Text style={{ color: isDarkMode ? '#FFF' : '#111827', fontWeight: '600' }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}




      {/* Shift Display */}
      <View
        style={{
          flex: 1,
          backgroundColor: cardBg,
          margin: 16,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : selectedTeam ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center' }}>
            <ShiftCircle shift={prevShift} colors={getShiftColor(prevShift)} />
            <ShiftCircle shift={shift} colors={getShiftColor(shift)} large />
            <ShiftCircle shift={nextShift} colors={getShiftColor(nextShift)} />
          </View>
        ) : (
          <Text style={{ color: textSecondary }}>Select a team and date</Text>
        )}
        {shift && (
          <Text style={{ color: textSecondary, marginTop: 8, textAlign: 'center', paddingHorizontal: 16 }}>
            {SHIFT_DESCRIPTIONS[shift]}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

/* =========================
   App Entry
   ========================= */
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load persisted values
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const dark = await AsyncStorage.getItem('@isDarkMode');
        if (dark !== null) setIsDarkMode(dark === 'true');

        const team = await AsyncStorage.getItem('@selectedTeam');
        if (team !== null) setSelectedTeam(parseInt(team, 10));

        const date = await AsyncStorage.getItem('@selectedDate');
        if (date !== null) setSelectedDate(new Date(date));
      } catch (e) {
        console.log('Error loading settings', e);
      }
    };
    loadSettings();
  }, []);

  // Persist dark mode
  useEffect(() => { AsyncStorage.setItem('@isDarkMode', isDarkMode.toString()); }, [isDarkMode]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen
                {...props}
                isDarkMode={isDarkMode}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Settings">
            {(props) => (
              <SettingsScreen
                {...props}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


