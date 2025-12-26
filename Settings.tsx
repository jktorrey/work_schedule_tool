import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';


// Stepper component
const Stepper = ({
  value,
  setValue,
  min = 0,
  max = 100,
  textColor,
}: {
  value: number;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
  textColor: string;
}) => (
  <View style={styles.stepperContainer}>
    <TouchableOpacity onPress={() => setValue(Math.max(min, value - 1))} style={styles.stepperButton}>
      <Text style={styles.stepperButtonText}>−</Text>
    </TouchableOpacity>
    <Text style={[styles.stepperValue, { color: textColor }]}>{value}</Text>
    <TouchableOpacity onPress={() => setValue(Math.min(max, value + 1))} style={styles.stepperButton}>
      <Text style={styles.stepperButtonText}>+</Text>
    </TouchableOpacity>
  </View>
);


interface SettingsScreenProps {
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}


export default function SettingsScreen({ isDarkMode, setIsDarkMode }: SettingsScreenProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    appearance: true,
    notifications: false,
    teamConfig: false,
    shiftConfig: false,
  });
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };


  // Appearance
  const [highContrast, setHighContrast] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState<'None' | 'Deuteranopia' | 'Protanopia' | 'Tritanopia'>('None');


  // Notifications
  const [shiftChangeAlert, setShiftChangeAlert] = useState(1);


  // Teams
  const [numTeams, setNumTeams] = useState(4);
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2', 'Team 3', 'Team 4']);
  const [teamStartDates, setTeamStartDates] = useState([new Date(), new Date(), new Date(), new Date()]);
  const [showDatePickerIdx, setShowDatePickerIdx] = useState<number | null>(null);


  // Shifts
  const [numShifts, setNumShifts] = useState(4);
  const [shiftNames, setShiftNames] = useState(['Day', 'Mid', 'Break', 'Straight']);
  const [shiftDescriptions, setShiftDescriptions] = useState(['0500-1700', '1700-0500', 'Off', 'Flexible']);
  const [rotationLength, setRotationLength] = useState(10);
  const [rotationUnit, setRotationUnit] = useState<'Days' | 'Weeks'>('Weeks');


  const textColor = isDarkMode ? '#FFF' : '#111827';
  const sectionBg = isDarkMode ? '#000' : '#FFF'; // match page background in dark mode


  const renderCardHeader = (label: string, sectionKey: string) => (
    <TouchableOpacity
      onPress={() => toggleSection(sectionKey)}
      style={[styles.card, { backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6' }]}
    >
      <Text style={[styles.cardHeader, { color: textColor }]}>{label}</Text>
      <MaterialIcons
        name={expandedSections[sectionKey] ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
        size={24}
        color={textColor}
      />
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: sectionBg }]}>
      <ScrollView>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: isDarkMode ? '#111827' : '#E5E7EB' }]}>
          <Text style={[styles.headerText, { color: textColor }]}>Settings</Text>
        </View>


        {/* Appearance */}
        {renderCardHeader('Appearance', 'appearance')}
        <Collapsible collapsed={!expandedSections.appearance}>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            {[
              { label: 'Dark Mode', value: isDarkMode, setter: setIsDarkMode, type: 'toggle' },
              { label: 'High Contrast', value: highContrast, setter: setHighContrast, type: 'toggle' },
              { label: 'Haptic Feedback', value: hapticFeedback, setter: setHapticFeedback, type: 'toggle' },
            ].map((item, idx) => (
              <View key={idx} style={[styles.subCard, { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }]}>
                <View style={styles.row}>
                  <Text style={{ color: textColor }}>{item.label}</Text>
                  <Switch value={item.value as boolean} onValueChange={item.setter as any} />
                </View>
              </View>
            ))}
            {/* Color Blind Mode row */}
            <View style={[styles.subCard, { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
              <Text style={{ color: textColor }}>Color Blind Mode</Text>
              <TouchableOpacity
                onPress={() => {
                  const options = ['None', 'Deuteranopia', 'Protanopia', 'Tritanopia'];
                  const currentIndex = options.indexOf(colorBlindMode);
                  const nextIndex = (currentIndex + 1) % options.length;
                  setColorBlindMode(options[nextIndex]);
                }}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ color: textColor, marginRight: 4 }}>{colorBlindMode}</Text>
                <MaterialIcons name="keyboard-arrow-right" size={20} color={textColor} />
              </TouchableOpacity>
            </View>
          </View>
        </Collapsible>


        {/* Notifications */}
        {renderCardHeader('Notifications', 'notifications')}
        <Collapsible collapsed={!expandedSections.notifications}>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <View style={[styles.subCard, { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }]}>
              <View style={styles.row}>
                <Text style={{ color: textColor }}>Shift Change Alert (days)</Text>
                <Stepper value={shiftChangeAlert} setValue={setShiftChangeAlert} min={0} max={120} textColor={textColor} />
              </View>
            </View>
          </View>
        </Collapsible>


          {/* Team Configuration */}
          {renderCardHeader('Team Configuration', 'teamConfig')}
          <Collapsible collapsed={!expandedSections.teamConfig}>
            <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
              {/* Number of Teams */}
              <View style={[styles.subCard, { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }]}>
                <View style={styles.row}>
                  <Text style={{ color: textColor }}>Number of Teams</Text>
                  <Stepper value={numTeams} setValue={setNumTeams} min={1} max={10} textColor={textColor} />
                </View>
              </View>


              {/* Individual Team Names and Start Dates */}
              {teamNames.map((name, idx) => (
                <View key={idx} style={[styles.subCard, { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                  {/* Team Name */}
                  <View style={{ flex: 0.48 }}>
                    <Text style={{ color: textColor }}>Team {idx + 1} Name</Text>
                    <TextInput
                      style={[styles.input, { borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', color: textColor }]}
                      value={name}
                      onChangeText={(text) => {
                        const newNames = [...teamNames];
                        newNames[idx] = text;
                        setTeamNames(newNames);
                      }}
                    />
                  </View>


                  {/* Team Start Date */}
                  <View style={{ flex: 0.48 }}>
                    <Text style={{ color: textColor, marginBottom: 4 }}>Start Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePickerIdx(idx)} style={{ padding: 8 }}>
                      <Text style={{ color: isDarkMode ? '#4F46E5' : '#111827' }}>
                        {teamStartDates[idx].toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}


              {/* Overlay modal rendered at top level */}
              {showDatePickerIdx !== null && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: isDarkMode ? '#111827' : '#FFF',
                      borderRadius: 16,
                      padding: 16,
                      alignItems: 'center',
                      width: '80%',
                    }}
                  >
                    <DateTimePicker
                      value={teamStartDates[showDatePickerIdx]}
                      mode="date"
                      display="spinner"
                      onChange={(_, d) => {
                        if (d) {
                          const newDates = [...teamStartDates];
                          newDates[showDatePickerIdx] = d;
                          setTeamStartDates(newDates);
                        }
                      }}
                      themeVariant={isDarkMode ? 'dark' : 'light'}
                      textColor={isDarkMode ? '#FFF' : '#000'}
                    />
                    <TouchableOpacity
                      onPress={() => setShowDatePickerIdx(null)}
                      style={{
                        marginTop: 12,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        backgroundColor: isDarkMode ? '#4F46E5' : '#E5E7EB',
                      }}
                    >
                      <Text style={{ color: isDarkMode ? '#FFF' : '#111827', fontWeight: '600' }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </Collapsible>


          {/* Shift Configuration */}
        {renderCardHeader('Shift Configuration', 'shiftConfig')}
        <Collapsible collapsed={!expandedSections.shiftConfig}>
          <View style={[styles.sectionContent, { backgroundColor: sectionBg }]}>
            <View style={[styles.subCard, { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }]}>
              <View style={styles.row}>
                <Text style={{ color: textColor }}>Number of Shifts</Text>
                <Stepper value={numShifts} setValue={setNumShifts} min={1} max={10} textColor={textColor} />
              </View>
            </View>


            {shiftNames.map((shift, idx) => (
              <View
                key={idx}
                style={[styles.subCard, { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
              >
                <View style={{ flex: 0.48 }}>
                  <Text style={{ color: textColor }}>Shift {idx + 1} Name</Text>
                  <TextInput
                    style={[styles.input, { borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', color: textColor }]}
                    value={shift}
                    onChangeText={(text) => {
                      const newShiftNames = [...shiftNames];
                      newShiftNames[idx] = text;
                      setShiftNames(newShiftNames);
                    }}
                  />
                </View>
                <View style={{ flex: 0.48 }}>
                  <Text style={{ color: textColor }}>Short Description</Text>
                  <TextInput
                    style={[styles.input, { borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', color: textColor }]}
                    value={shiftDescriptions[idx]}
                    onChangeText={(text) => {
                      const newDesc = [...shiftDescriptions];
                      newDesc[idx] = text;
                      setShiftDescriptions(newDesc);
                    }}
                  />
                </View>
              </View>
            ))}


            <View style={[styles.subCard, { backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }]}>
              <View style={styles.row}>
                <Text style={{ color: textColor }}>Rotation Length</Text>
                <Stepper value={rotationLength} setValue={setRotationLength} min={1} max={52} textColor={textColor} />
                <TouchableOpacity onPress={() => setRotationUnit(rotationUnit === 'Days' ? 'Weeks' : 'Days')}>
                  <Text style={{ color: textColor, marginLeft: 8 }}>{rotationUnit}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Collapsible>


        {/* Reset Button */}
        <View style={{ padding: 16 }}>
          <Button title="Reset to Defaults" onPress={() => {}} color={isDarkMode ? '#4F46E5' : undefined} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1 },
  headerText: { fontSize: 24, fontWeight: '700' },
  card: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeader: { fontSize: 18, fontWeight: '600' },
  sectionContent: { marginHorizontal: 16, marginBottom: 12, borderRadius: 12, overflow: 'hidden' },
  subCard: { padding: 12, borderRadius: 10, marginVertical: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: 8, padding: 8, marginTop: 4 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center' },
  stepperButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#4F46E5', borderRadius: 6 },
  stepperButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  stepperValue: { marginHorizontal: 12, fontSize: 16 },
});

