import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthContext";
import { AppProvider } from "../contexts/AppContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <AuthProvider>
          <AppProvider>
            <StatusBar style="light" backgroundColor="#09090b" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="routine"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: "#09090b" },
                  headerTintColor: "#6366f1",
                  headerTitle: "Minha Rotina",
                  headerBackTitle: "Voltar",
                }}
              />
              <Stack.Screen
                name="workout/[id]"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: "#09090b" },
                  headerTintColor: "#6366f1",
                  headerTitle: "Treino",
                  headerBackTitle: "Voltar",
                }}
              />
              <Stack.Screen
                name="workout/new"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: "#09090b" },
                  headerTintColor: "#6366f1",
                  headerTitle: "Novo Treino",
                  headerBackTitle: "Cancelar",
                }}
              />
              <Stack.Screen
                name="workout/edit/[id]"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: "#09090b" },
                  headerTintColor: "#6366f1",
                  headerTitle: "Editar Treino",
                  headerBackTitle: "Cancelar",
                }}
              />
            </Stack>
          </AppProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
