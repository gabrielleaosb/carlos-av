import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Icon = keyof typeof Ionicons.glyphMap;

function icon(active: Icon, inactive: Icon) {
  return ({ focused }: { focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={24} color={focused ? "#6366f1" : "#52525b"} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#09090b",
          borderTopColor: "#18181b",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor:   "#6366f1",
        tabBarInactiveTintColor: "#52525b",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: "Início",    tabBarIcon: icon("home",        "home-outline")        }} />
      <Tabs.Screen name="workouts" options={{ title: "Treinos",   tabBarIcon: icon("barbell",     "barbell-outline")     }} />
      <Tabs.Screen name="progress" options={{ title: "Progresso", tabBarIcon: icon("trending-up", "trending-up-outline") }} />
      <Tabs.Screen name="profile"  options={{ title: "Perfil",    tabBarIcon: icon("person",      "person-outline")      }} />
    </Tabs>
  );
}
