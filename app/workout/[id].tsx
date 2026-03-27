import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  FlatList, Modal, TextInput, Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../contexts/AppContext";
import { WorkoutExercise } from "../../types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function WorkoutDetailScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const app       = useApp();
  const workout   = app.getWorkoutById(id as string);

  const [logModal, setLogModal]     = useState(false);
  const [duration, setDuration]     = useState("");
  const [weights, setWeights]       = useState<Record<string, string>>({});

  // Histórico de logs deste treino
  const workoutLogs = useMemo(() =>
    app.logs.filter((l) => l.workoutId === id).slice(0, 5),
  [app.logs, id]);

  if (!workout) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center">
        <Text className="text-zinc-500">Treino não encontrado</Text>
      </View>
    );
  }

  function openLogModal() {
    const initial: Record<string, string> = {};
    workout!.exercises.forEach((e) => {
      const hist = app.getExerciseHistory(e.name);
      initial[e.id] = hist.length > 0 ? String(hist[hist.length - 1].maxWeight) : "";
    });
    setWeights(initial);
    setDuration("");
    setLogModal(true);
  }

  function saveLog() {
    const dur = parseInt(duration);
    if (!dur || dur < 1) {
      Alert.alert("Duração inválida", "Informe a duração em minutos.");
      return;
    }
    app.logWorkout({
      workoutId:   workout!.id,
      workoutName: workout!.name,
      date:        new Date().toISOString(),
      duration:    dur,
      exercises:   workout!.exercises.map((e) => ({
        name:        e.name,
        muscleGroup: e.muscleGroup,
        maxWeight:   parseFloat(weights[e.id] ?? "0") || 0,
      })),
    });
    setLogModal(false);
    Alert.alert("Treino registrado!", "Ótimo trabalho!");
  }

  const renderExercise = ({ item }: { item: WorkoutExercise }) => (
    <View className="flex-row items-center py-3.5 border-b border-zinc-900">
      <View className="w-8 h-8 bg-indigo-500/10 rounded-lg items-center justify-center mr-3">
        <Ionicons name="barbell-outline" size={16} color="#6366f1" />
      </View>
      <View className="flex-1">
        <Text className="text-white text-sm font-medium">{item.name}</Text>
        <Text className="text-zinc-500 text-xs mt-0.5">{item.muscleGroup}</Text>
      </View>
      <Text className="text-zinc-400 text-sm">{item.sets}×{item.reps}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Info */}
        <View className="px-5 pt-4 pb-2">
          {workout.splitLabel && (
            <View className="bg-indigo-500/10 self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-indigo-400 text-xs font-medium">{workout.splitLabel}</Text>
            </View>
          )}
          <Text className="text-white text-2xl font-bold">{workout.name}</Text>
          <Text className="text-zinc-500 text-sm mt-1">
            {workout.exercises.length} exercícios
            {workout.isCustom ? " · Personalizado" : ""}
          </Text>
        </View>

        {/* Exercícios */}
        <View className="px-5 mt-4">
          <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Exercícios</Text>
          <FlatList
            data={workout.exercises}
            renderItem={renderExercise}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Histórico de sessões */}
        {workoutLogs.length > 0 && (
          <View className="px-5 mt-6">
            <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Histórico</Text>
            {workoutLogs.map((log) => (
              <View key={log.id} className="flex-row items-center py-3 border-b border-zinc-900">
                <Ionicons name="calendar-outline" size={16} color="#52525b" style={{ marginRight: 10 }} />
                <Text className="text-zinc-400 text-sm flex-1">{fmtDate(log.date)}</Text>
                <Text className="text-zinc-500 text-sm">{log.duration} min</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Botão registrar */}
      <View className="absolute bottom-6 left-5 right-5">
        <TouchableOpacity
          onPress={openLogModal}
          className="bg-indigo-500 h-14 rounded-2xl items-center justify-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Registrar treino</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de log */}
      <Modal visible={logModal} transparent animationType="slide">
        <TouchableOpacity className="flex-1 bg-black/60" activeOpacity={1} onPress={() => setLogModal(false)} />
        <View className="bg-zinc-900 rounded-t-3xl px-6 pt-6 pb-8" style={{ maxHeight: "80%" }}>
          <Text className="text-white text-lg font-bold mb-1">Registrar sessão</Text>
          <Text className="text-zinc-500 text-sm mb-5">{workout.name}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Duração */}
            <Text className="text-zinc-500 text-xs mb-1.5">Duração (minutos)</Text>
            <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 h-12 mb-5">
              <TextInput
                className="flex-1 text-white"
                placeholder="Ex: 60"
                placeholderTextColor="#52525b"
                keyboardType="number-pad"
                value={duration}
                onChangeText={setDuration}
              />
              <Text className="text-zinc-500 text-sm">min</Text>
            </View>

            {/* Cargas por exercício */}
            <Text className="text-zinc-500 text-xs mb-3">Carga máxima por exercício (kg)</Text>
            {workout.exercises.map((e) => (
              <View key={e.id} className="flex-row items-center mb-3">
                <Text className="text-zinc-300 text-sm flex-1" numberOfLines={1}>{e.name}</Text>
                <View className="flex-row items-center bg-zinc-800 rounded-xl px-3 h-10 w-28">
                  <TextInput
                    className="flex-1 text-white text-sm"
                    placeholder="0"
                    placeholderTextColor="#52525b"
                    keyboardType="decimal-pad"
                    value={weights[e.id] ?? ""}
                    onChangeText={(v) => setWeights((prev) => ({ ...prev, [e.id]: v }))}
                  />
                  <Text className="text-zinc-500 text-xs">kg</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={saveLog}
              className="bg-indigo-500 h-12 rounded-xl items-center justify-center mt-4"
            >
              <Text className="text-white font-bold">Concluir treino</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
