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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#000' : '#fff',
      }}
    >
      <Text
        style={{
          color: isDarkMode ? '#fff' : '#000',
          fontSize: 18,
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



