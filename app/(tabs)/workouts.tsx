import React, { useState, useCallback, useMemo } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, SectionList, Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../contexts/AppContext";
import { TEMPLATE_WORKOUTS } from "../../constants/workoutTemplates";
import { Workout } from "../../types";

type Filter = "Todos" | "1x" | "2x" | "3x" | "4x" | "5x" | "Meus";

const FILTERS: Filter[] = ["Todos", "1x", "2x", "3x", "4x", "5x", "Meus"];

const SPLIT_META: Record<string, { freq: string; label: string; days: string }> = {
  Fullbody: { freq: "1x",  label: "Fullbody",   days: "1 dia/semana" },
  AB:       { freq: "2x",  label: "A/B",         days: "2 dias/semana" },
  ABC:      { freq: "3x",  label: "A/B/C",       days: "3 dias/semana" },
  ABCD:     { freq: "4x",  label: "A/B/C/D",     days: "4 dias/semana" },
  ABCDE:    { freq: "5x",  label: "A/B/C/D/E",   days: "5 dias/semana" },
};

interface Section {
  title:    string;
  subtitle: string;
  freq:     string;
  data:     Workout[];
}

export default function WorkoutsScreen() {
  const app = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Todos");

  const sections: Section[] = useMemo(() => {
    const splitOrder = ["Fullbody", "AB", "ABC", "ABCD", "ABCDE"];
    const built: Section[] = splitOrder.map((split) => {
      const meta = SPLIT_META[split];
      return {
        title:    meta.label,
        subtitle: meta.days,
        freq:     meta.freq,
        data:     TEMPLATE_WORKOUTS.filter((w) => w.splitLabel === split),
      };
    });
    if (app.customWorkouts.length > 0 || filter === "Meus") {
      built.push({
        title:    "Personalizados",
        subtitle: "Treinos criados por você",
        freq:     "Meus",
        data:     app.customWorkouts,
      });
    }
    return built;
  }, [app.customWorkouts]);

  const filtered = useMemo(() => {
    return sections
      .filter((s) => filter === "Todos" || s.freq === filter)
      .map((s) => ({
        ...s,
        data: s.data.filter(
          (w) => !search.trim() || w.name.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((s) => s.data.length > 0);
  }, [sections, filter, search]);

  function handleDelete(id: string) {
    Alert.alert("Excluir", "Deseja excluir este treino?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => app.deleteCustomWorkout(id) },
    ]);
  }

  function handleEdit(workout: Workout) {
    if (workout.isCustom) {
      router.push(`/workout/edit/${workout.id}`);
    } else {
      // Cria uma cópia editável do template
      Alert.alert(
        "Editar template",
        "Isso vai criar uma cópia personalizada deste treino para você editar.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Criar cópia",
            onPress: () => {
              app.addCustomWorkout({
                name:       `${workout.name} (cópia)`,
                exercises:  workout.exercises,
                splitLabel: undefined,
              });
              Alert.alert("Cópia criada!", "Encontre em Personalizados para editar.");
            },
          },
        ]
      );
    }
  }

  const renderWorkout = useCallback(({ item }: { item: Workout }) => {
    const groups = [...new Set(item.exercises.map((e) => e.muscleGroup))].slice(0, 3);
    return (
      <TouchableOpacity
        onPress={() => router.push(`/workout/${item.id}`)}
        activeOpacity={0.7}
        className="bg-zinc-900 rounded-2xl px-4 py-4 mb-2 border border-zinc-800"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>{item.name}</Text>
            <Text className="text-zinc-500 text-xs mt-0.5">
              {item.exercises.length} exercícios
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Ionicons name="create-outline" size={18} color="#6366f1" />
            </TouchableOpacity>
            {item.isCustom && (
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={16} color="#52525b" />
              </TouchableOpacity>
            )}
            <Ionicons name="chevron-forward" size={16} color="#3f3f46" />
          </View>
        </View>
        <View className="flex-row flex-wrap gap-1.5 mt-2.5">
          {groups.map((g) => (
            <View key={g} className="bg-indigo-500/10 px-2 py-0.5 rounded-full">
              <Text className="text-indigo-400 text-xs">{g}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  }, [app.customWorkouts]);

  const renderSectionHeader = useCallback(({ section }: { section: Section }) => (
    <View className="flex-row items-center justify-between mb-2 mt-4">
      <View>
        <Text className="text-white font-semibold text-base">{section.title}</Text>
        <Text className="text-zinc-500 text-xs">{section.subtitle}</Text>
      </View>
      {section.freq !== "Meus" && (
        <View className="bg-indigo-500/10 px-3 py-1 rounded-full">
          <Text className="text-indigo-400 text-xs font-semibold">{section.freq} / semana</Text>
        </View>
      )}
    </View>
  ), []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-5 pt-5 pb-3">
        <Text className="text-white text-2xl font-bold">Treinos</Text>
      </View>

      {/* Search */}
      <View className="mx-5 mb-3">
        <View className="flex-row items-center bg-zinc-900 rounded-xl px-3 h-11 border border-zinc-800">
          <Ionicons name="search-outline" size={16} color="#52525b" />
          <TextInput
            className="flex-1 text-white text-sm ml-2"
            placeholder="Buscar treino..."
            placeholderTextColor="#52525b"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#52525b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View className="mb-3">
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setFilter(item)}
              activeOpacity={0.7}
              className={`px-4 py-1.5 rounded-full border ${
                filter === item ? "bg-indigo-500 border-indigo-500" : "bg-zinc-900 border-zinc-800"
              }`}
            >
              <Text className={`text-sm font-medium ${filter === item ? "text-white" : "text-zinc-400"}`}>
                {item === "Todos" ? "Todos" : item === "Meus" ? "Meus" : `${item}/sem`}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sections */}
      <SectionList
        sections={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkout}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="barbell-outline" size={40} color="#27272a" />
            <Text className="text-zinc-500 text-base font-semibold mt-4">Nenhum treino encontrado</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-indigo-500 w-14 h-14 rounded-full items-center justify-center"
        onPress={() => router.push("/workout/new")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
