import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createNativeStackNavigator();

/* =========================
   Shift Circle
   ========================= */
function ShiftCircle({
  shift,
  colors,
  large = false,
}: {
  shift: string | null;
  colors: string[];
  large?: boolean;
}) {
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
      <Text style={{ color: '#FFF', fontWeight: '600' }}>
        {shift ?? ''}
      </Text>
    </LinearGradient>
  );
}

/* =========================
   Home Screen
   ========================= */
function HomeScreen({
  navigation,
  isDarkMode,
}: {
  navigation: any;
  isDarkMode: boolean;
}) {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const shift = selectedTeam ? 'Day' : null;
  const prevShift = selectedTeam ? 'Break' : null;
  const nextShift = selectedTeam ? 'Mid' : null;

  const getShiftColor = (s: string | null) => {
    switch (s) {
      case 'Day':
        return ['#FBBF24', '#F59E0B'];
      case 'Mid':
        return ['#6366F1', '#4F46E5'];
      case 'Break':
        return ['#34D399', '#10B981'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const screenBg = isDarkMode ? '#000000' : '#F3F4F6';
  const cardBg = isDarkMode ? '#111827' : '#FFFFFF';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#111827';
  const textSecondary = isDarkMode ? '#9CA3AF' : '#4B5563';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: screenBg }}>
      {/* Header */}
      <View
        style={{
          padding: 16,
          backgroundColor: cardBg,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '700', color: textPrimary }}>
          Shift Happens
        </Text>
        <Text style={{ color: textSecondary }}>
          Select team & date
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={{ position: 'absolute', right: 16, top: 16 }}
        >
          <Text style={{ color: textSecondary, fontSize: 18 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Team Buttons */}
      <View
        style={{
          flexDirection: 'row',
          padding: 16,
          justifyContent: 'space-between',
        }}
      >
        {[1, 2, 3, 4].map((team) => (
          <TouchableOpacity
            key={team}
            onPress={() => setSelectedTeam(team)}
            style={{
              flex: 1,
              marginHorizontal: 4,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor:
                selectedTeam === team
                  ? '#4F46E5'
                  : isDarkMode
                  ? '#1F2937'
                  : '#E5E7EB',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color:
                  selectedTeam === team
                    ? '#FFFFFF'
                    : isDarkMode
                    ? '#D1D5DB'
                    : '#111827',
                fontWeight: '600',
              }}
            >
              Team {team}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Picker */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          marginHorizontal: 16,
          padding: 14,
          borderRadius: 12,
          backgroundColor: cardBg,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: textPrimary, fontWeight: '600' }}>
          {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          themeVariant={isDarkMode ? 'dark' : 'light'}
          textColor={isDarkMode ? '#FFFFFF' : '#000000'}
          onChange={(_, d) => {
            if (d) setSelectedDate(d);
            setShowDatePicker(false);
          }}
        />
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignItems: 'center',
            }}
          >
            <ShiftCircle shift={prevShift} colors={getShiftColor(prevShift)} />
            <ShiftCircle shift={shift} colors={getShiftColor(shift)} large />
            <ShiftCircle shift={nextShift} colors={getShiftColor(nextShift)} />
          </View>
        ) : (
          <Text style={{ color: textSecondary }}>
            Select a team and date
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

/* =========================
   Settings Screen
   ========================= */
function SettingsScreen({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: isDarkMode ? '#FFFFFF' : '#000000',
          marginBottom: 12,
        }}
      >
        Dark Mode
      </Text>

      <Switch
        value={isDarkMode}
        onValueChange={setIsDarkMode}
      />
    </SafeAreaView>
  );
}

/* =========================
   App Entry
   ========================= */
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen
                {...props}
                isDarkMode={isDarkMode}
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


