import { Tabs } from "expo-router";
import '../../global.css';
import '../../i18n';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="two" options={{ title: "Profile" }} />
    </Tabs>
  );
}
