import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/components/godmode-ui";
const icons: Record<string, keyof typeof Ionicons.glyphMap> = { index: "grid-outline", analyzer: "scan-outline", evaluator: "shield-checkmark-outline", "prompt-studio": "sparkles-outline", dataset: "file-tray-stacked-outline", settings: "settings-outline" };
export default function TabLayout() { const insets = useSafeAreaInsets(); const bottom = Platform.OS === "web" ? 8 : Math.max(insets.bottom, 8); return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: C.blue, tabBarInactiveTintColor: C.muted, tabBarStyle: { backgroundColor: C.bg, borderTopColor: C.border, borderTopWidth: 1, height: 58 + bottom, paddingTop: 7, paddingBottom: bottom }, tabBarLabelStyle: { fontSize: 10, fontWeight: "700" }, tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] ?? "ellipse-outline"} color={color} size={size} /> })}>
  <Tabs.Screen name="index" options={{ title: "Dashboard" }} /><Tabs.Screen name="analyzer" options={{ title: "Analyze" }} /><Tabs.Screen name="evaluator" options={{ title: "Evaluate" }} /><Tabs.Screen name="prompt-studio" options={{ title: "AI Studio" }} /><Tabs.Screen name="dataset" options={{ title: "Dataset" }} /><Tabs.Screen name="settings" options={{ title: "More" }} /><Tabs.Screen name="genesis" options={{ href: null }} /><Tabs.Screen name="history" options={{ href: null }} /><Tabs.Screen name="about" options={{ href: null }} />
 </Tabs>; }
