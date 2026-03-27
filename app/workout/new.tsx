import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, FlatList, KeyboardAvoidingView, Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../contexts/AppContext";
import { EXERCISE_TEMPLATES, MUSCLE_GROUPS } from "../../constants/exercises";
import { WorkoutExercise, MuscleGroup } from "../../types";

let idSeq = 0;
function uid() { return `ex_${Date.now()}_${idSeq++}`; }

interface ExItem extends WorkoutExercise {
  sets: number;
  reps: number;
}

export default function NewWorkoutScreen() {
  const app = useApp();
  const [name, setName]               = useState("");
  const [exercises, setExercises]     = useState<ExItem[]>([]);
  const [exModal, setExModal]         = useState(false);
  const [exSearch, setExSearch]       = useState("");
  const [customMode, setCustomMode]   = useState(false);
  const [customName, setCustomName]   = useState("");
  const [customGroup, setCustomGroup] = useState<MuscleGroup>("Full Body");

  const filteredEx = EXERCISE_TEMPLATES.filter((e) =>
    !exSearch || e.name.toLowerCase().includes(exSearch.toLowerCase())
  );

  function addExercise(name: string, muscleGroup: MuscleGroup) {
    setExercises((prev) => [...prev, { id: uid(), name, muscleGroup, sets: 3, reps: 12 }]);
    setExModal(false);
    setExSearch("");
    setCustomMode(false);
    setCustomName("");
  }

  function addCustomExercise() {
    if (!customName.trim()) { Alert.alert("Informe o nome do exercício"); return; }
    addExercise(customName.trim(), customGroup);
  }

  function updateSets(id: string, sets: number) {
    setExercises((prev) => prev.map((e) => e.id === id ? { ...e, sets } : e));
  }

  function updateReps(id: string, reps: number) {
    setExercises((prev) => prev.map((e) => e.id === id ? { ...e, reps } : e));
  }

  function removeExercise(id: string) {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }

  function save() {
    if (!name.trim()) { Alert.alert("Nome obrigatório"); return; }
    if (exercises.length === 0) { Alert.alert("Adicione ao menos 1 exercício"); return; }
    app.addCustomWorkout({ name: name.trim(), exercises, splitLabel: undefined });
    router.back();
  }

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-4">
          {/* Nome */}
          <Text className="text-zinc-500 text-xs mb-1.5">Nome do treino</Text>
          <TextInput
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12 text-white text-base mb-6"
            placeholder="Ex: Peito e Tríceps"
            placeholderTextColor="#52525b"
            value={name}
            onChangeText={setName}
          />

          {/* Exercícios */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-zinc-500 text-xs uppercase tracking-widest">Exercícios</Text>
            <TouchableOpacity
              onPress={() => setExModal(true)}
              className="flex-row items-center gap-1"
            >
              <Ionicons name="add-circle-outline" size={18} color="#6366f1" />
              <Text className="text-indigo-400 text-sm">Adicionar</Text>
            </TouchableOpacity>
          </View>

          {exercises.length === 0 ? (
            <TouchableOpacity
              onPress={() => setExModal(true)}
              activeOpacity={0.7}
              className="border border-dashed border-zinc-700 rounded-2xl p-8 items-center"
            >
              <Ionicons name="add" size={28} color="#3f3f46" />
              <Text className="text-zinc-500 text-sm mt-2">Nenhum exercício adicionado</Text>
            </TouchableOpacity>
          ) : (
            exercises.map((ex) => (
              <View key={ex.id} className="bg-zinc-900 rounded-2xl p-4 mb-2 border border-zinc-800">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1 mr-2">
                    <Text className="text-white font-semibold text-sm">{ex.name}</Text>
                    <Text className="text-zinc-500 text-xs mt-0.5">{ex.muscleGroup}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeExercise(ex.id)}>
                    <Ionicons name="trash-outline" size={18} color="#52525b" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-zinc-600 text-xs mb-1">Séries</Text>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => updateSets(ex.id, Math.max(1, ex.sets - 1))}
                        className="w-8 h-8 bg-zinc-800 rounded-lg items-center justify-center"
                      >
                        <Ionicons name="remove" size={14} color="#a1a1aa" />
                      </TouchableOpacity>
                      <Text className="text-white font-bold w-6 text-center">{ex.sets}</Text>
                      <TouchableOpacity
                        onPress={() => updateSets(ex.id, ex.sets + 1)}
                        className="w-8 h-8 bg-zinc-800 rounded-lg items-center justify-center"
                      >
                        <Ionicons name="add" size={14} color="#a1a1aa" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-zinc-600 text-xs mb-1">Repetições</Text>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => updateReps(ex.id, Math.max(1, ex.reps - 1))}
                        className="w-8 h-8 bg-zinc-800 rounded-lg items-center justify-center"
                      >
                        <Ionicons name="remove" size={14} color="#a1a1aa" />
                      </TouchableOpacity>
                      <Text className="text-white font-bold w-6 text-center">{ex.reps}</Text>
                      <TouchableOpacity
                        onPress={() => updateReps(ex.id, ex.reps + 1)}
                        className="w-8 h-8 bg-zinc-800 rounded-lg items-center justify-center"
                      >
                        <Ionicons name="add" size={14} color="#a1a1aa" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Botão salvar */}
      <View className="absolute bottom-6 left-5 right-5">
        <TouchableOpacity
          onPress={save}
          className="bg-indigo-500 h-14 rounded-2xl items-center justify-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Salvar treino</Text>
        </TouchableOpacity>
      </View>

      {/* Modal exercícios */}
      <Modal visible={exModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
          <TouchableOpacity className="flex-1 bg-black/60" activeOpacity={1} onPress={() => { setExModal(false); setCustomMode(false); }} />
          <View className="bg-zinc-900 rounded-t-3xl px-5 pt-5 pb-8" style={{ maxHeight: "80%" }}>

            {/* Header do modal */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-bold">
                {customMode ? "Criar exercício" : "Selecionar exercício"}
              </Text>
              {customMode ? (
                <TouchableOpacity onPress={() => setCustomMode(false)}>
                  <Text className="text-zinc-400 text-sm">Voltar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setCustomMode(true)}
                  className="flex-row items-center gap-1"
                >
                  <Ionicons name="add-circle-outline" size={16} color="#6366f1" />
                  <Text className="text-indigo-400 text-sm">Criar novo</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Modo: criar exercício personalizado */}
            {customMode ? (
              <View>
                <Text className="text-zinc-500 text-xs mb-1.5">Nome do exercício</Text>
                <TextInput
                  className="bg-zinc-800 rounded-xl px-4 h-11 text-white text-sm mb-4"
                  placeholder="Ex: Supino Inclinado Reverso"
                  placeholderTextColor="#52525b"
                  value={customName}
                  onChangeText={setCustomName}
                  autoFocus
                />
                <Text className="text-zinc-500 text-xs mb-2">Grupo muscular</Text>
                <FlatList
                  data={MUSCLE_GROUPS}
                  keyExtractor={(item) => item}
                  numColumns={2}
                  scrollEnabled={false}
                  columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setCustomGroup(item)}
                      className={`flex-1 py-2.5 rounded-xl items-center border ${
                        customGroup === item ? "bg-indigo-500 border-indigo-500" : "bg-zinc-800 border-zinc-700"
                      }`}
                    >
                      <Text className={`text-xs font-medium ${customGroup === item ? "text-white" : "text-zinc-400"}`}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={addCustomExercise}
                  className="bg-indigo-500 h-11 rounded-xl items-center justify-center mt-4"
                >
                  <Text className="text-white font-semibold">Adicionar exercício</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Modo: selecionar da lista */
              <>
                <View className="flex-row items-center bg-zinc-800 rounded-xl px-3 h-10 mb-3">
                  <Ionicons name="search-outline" size={16} color="#52525b" />
                  <TextInput
                    className="flex-1 text-white text-sm ml-2"
                    placeholder="Buscar exercício..."
                    placeholderTextColor="#52525b"
                    value={exSearch}
                    onChangeText={setExSearch}
                    autoFocus
                  />
                </View>
                <FlatList
                  data={filteredEx}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => addExercise(item.name, item.muscleGroup)}
                      activeOpacity={0.7}
                      className="flex-row items-center py-3.5 border-b border-zinc-800"
                    >
                      <View className="flex-1">
                        <Text className="text-white text-sm">{item.name}</Text>
                        <Text className="text-zinc-500 text-xs mt-0.5">{item.muscleGroup}</Text>
                      </View>
                      <Ionicons name="add-circle-outline" size={20} color="#6366f1" />
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
