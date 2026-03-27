import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../contexts/AppContext";
import { TEMPLATE_WORKOUTS } from "../constants/workoutTemplates";
import { Workout } from "../types";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function RoutineScreen() {
  const app = useApp();
  const [pickingDay, setPickingDay] = useState<number | null>(null);

  const allWorkouts: Workout[] = [...TEMPLATE_WORKOUTS, ...app.customWorkouts];

  function getRoutineForDay(day: number) {
    return app.routine.find((d) => d.dayOfWeek === day);
  }

  function selectWorkout(workout: Workout) {
    if (pickingDay === null) return;
    app.setRoutineDay({
      dayOfWeek:   pickingDay,
      workoutId:   workout.id,
      workoutName: workout.name,
    });
    setPickingDay(null);
  }

  function clearDay(day: number) {
    app.removeRoutineDay(day);
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-4 pb-6">
          <Text className="text-zinc-400 text-sm">
            Configure qual treino você fará em cada dia da semana.
          </Text>
        </View>

        {DAYS.map((day, i) => {
          const scheduled = getRoutineForDay(i);
          return (
            <View key={i} className="flex-row items-center px-5 mb-3">
              {/* Dia */}
              <View className="w-12 h-12 bg-zinc-900 rounded-xl items-center justify-center mr-3 border border-zinc-800">
                <Text className="text-white text-sm font-semibold">{day}</Text>
              </View>

              {/* Treino */}
              {scheduled ? (
                <TouchableOpacity
                  onPress={() => setPickingDay(i)}
                  activeOpacity={0.7}
                  className="flex-1 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 flex-row items-center"
                >
                  <View className="flex-1">
                    <Text className="text-indigo-300 text-sm font-medium" numberOfLines={1}>
                      {scheduled.workoutName}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => clearDay(i)} className="ml-2 p-1">
                    <Ionicons name="close-circle" size={18} color="#6366f1" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setPickingDay(i)}
                  activeOpacity={0.7}
                  className="flex-1 bg-zinc-900 border border-dashed border-zinc-700 rounded-xl px-4 py-3 flex-row items-center justify-center gap-2"
                >
                  <Ionicons name="add" size={16} color="#52525b" />
                  <Text className="text-zinc-500 text-sm">Adicionar treino</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Modal seleção de treino */}
      <Modal visible={pickingDay !== null} transparent animationType="slide">
        <TouchableOpacity
          className="flex-1 bg-black/60"
          activeOpacity={1}
          onPress={() => setPickingDay(null)}
        />
        <View className="bg-zinc-900 rounded-t-3xl px-5 pt-5 pb-8" style={{ maxHeight: "75%" }}>
          <Text className="text-white text-lg font-bold mb-1">
            {pickingDay !== null ? DAYS[pickingDay] : ""} — Selecione o treino
          </Text>
          <Text className="text-zinc-500 text-sm mb-4">Templates e treinos personalizados</Text>
          <FlatList
            data={allWorkouts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectWorkout(item)}
                activeOpacity={0.7}
                className="flex-row items-center py-3.5 border-b border-zinc-800"
              >
                <View className="w-8 h-8 bg-indigo-500/10 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="barbell-outline" size={16} color="#6366f1" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-medium">{item.name}</Text>
                  <Text className="text-zinc-500 text-xs mt-0.5">
                    {item.exercises.length} exercícios
                    {item.splitLabel ? ` · ${item.splitLabel}` : " · Personalizado"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#3f3f46" />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
