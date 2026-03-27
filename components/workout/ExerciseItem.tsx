import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "../../types";
import { Badge } from "../ui/Badge";

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  editable?: boolean;
  onDelete?: () => void;
}

export function ExerciseItem({
  exercise,
  index,
  editable = false,
  onDelete,
}: ExerciseItemProps) {
  const [expanded, setExpanded] = useState(true);

  const completedSets = exercise.sets.filter((s) => s.completed).length;

  return (
    <View className="bg-zinc-800 rounded-xl mb-3 overflow-hidden">
      {/* Exercise Header */}
      <TouchableOpacity
        className="flex-row items-center p-3.5"
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <View className="bg-orange-500 w-7 h-7 rounded-lg items-center justify-center mr-3">
          <Text className="text-white text-xs font-bold">{index + 1}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">
            {exercise.name}
          </Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <Badge label={exercise.muscleGroup} variant="zinc" />
            <Text className="text-zinc-400 text-xs">
              {completedSets}/{exercise.sets.length} séries
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          {editable && onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          )}
          <Ionicons
            name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={18}
            color="#71717a"
          />
        </View>
      </TouchableOpacity>

      {/* Sets table */}
      {expanded && (
        <View className="border-t border-zinc-700 px-3.5 pb-3">
          {/* Header */}
          <View className="flex-row py-2">
            <Text className="text-zinc-500 text-xs font-medium w-10 text-center">
              Série
            </Text>
            <Text className="text-zinc-500 text-xs font-medium flex-1 text-center">
              Peso (kg)
            </Text>
            <Text className="text-zinc-500 text-xs font-medium flex-1 text-center">
              Reps
            </Text>
            <Text className="text-zinc-500 text-xs font-medium w-14 text-center">
              Status
            </Text>
          </View>

          {exercise.sets.map((set, idx) => (
            <View
              key={set.id}
              className={`flex-row items-center py-2 rounded-lg px-1 ${
                set.completed ? "bg-green-500/5" : ""
              }`}
            >
              <Text className="text-zinc-300 text-sm w-10 text-center font-medium">
                {idx + 1}
              </Text>
              <Text className="text-white text-sm flex-1 text-center font-semibold">
                {set.weight > 0 ? set.weight : "—"}
              </Text>
              <Text className="text-white text-sm flex-1 text-center font-semibold">
                {set.reps}
              </Text>
              <View className="w-14 items-center">
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center ${
                    set.completed ? "bg-green-500" : "bg-zinc-700"
                  }`}
                >
                  {set.completed && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
