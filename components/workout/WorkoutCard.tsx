import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Workout } from "../../types";

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const groups = [...new Set(workout.exercises.map((e) => e.muscleGroup))].slice(0, 2);
  const hasLocation = !!workout.location;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-zinc-900 rounded-2xl px-4 py-4 mb-3"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-white font-semibold text-base flex-1 mr-2" numberOfLines={1}>
          {workout.name}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#52525b" />
      </View>

      <View className="flex-row items-center gap-3 mt-2">
        <Text className="text-zinc-500 text-xs">{formatDate(workout.date)}</Text>
        {workout.duration > 0 && (
          <Text className="text-zinc-500 text-xs">{workout.duration} min</Text>
        )}
        <Text className="text-zinc-500 text-xs">
          {workout.exercises.length} exerc.
        </Text>
        {groups.map((g) => (
          <Text key={g} className="text-orange-500/70 text-xs">{g}</Text>
        ))}
        {hasLocation && (
          <Ionicons name="location-outline" size={12} color="#52525b" style={{ marginLeft: "auto" }} />
        )}
      </View>
    </TouchableOpacity>
  );
}
