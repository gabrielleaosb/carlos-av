import React, { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, TextInput, FlatList, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { WeightEntry } from "../../types";

type Tab = "peso" | "cargas";

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function bmi(weight?: number, height?: number) {
  if (!weight || !height) return null;
  return (weight / Math.pow(height / 100, 2)).toFixed(1);
}

export default function ProgressScreen() {
  const { user }  = useAuth();
  const app       = useApp();
  const [tab, setTab]               = useState<Tab>("peso");
  const [weightModal, setWeightModal] = useState(false);
  const [newWeight, setNewWeight]   = useState("");
  const [selectedEx, setSelectedEx] = useState<string | null>(null);

  // Todos os exercícios já logados
  const exerciseNames = useMemo(() => {
    const names = new Set<string>();
    app.logs.forEach((log) => log.exercises.forEach((e) => names.add(e.name)));
    return Array.from(names).sort();
  }, [app.logs]);

  const exHistory = useMemo(() =>
    selectedEx ? app.getExerciseHistory(selectedEx) : [],
  [selectedEx, app.logs]);

  const latestWeight  = app.weightHistory[0]?.weight;
  const prevWeight    = app.weightHistory[1]?.weight;
  const weightDiff    = latestWeight && prevWeight ? latestWeight - prevWeight : null;
  const bmiVal        = bmi(latestWeight ?? user?.weight, user?.height);

  function saveWeight() {
    const val = parseFloat(newWeight);
    if (!val || val < 20 || val > 300) {
      Alert.alert("Valor inválido", "Informe um peso entre 20 e 300 kg.");
      return;
    }
    app.addWeightEntry({ date: todayStr(), weight: val });
    setNewWeight("");
    setWeightModal(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="px-5 pt-5 pb-4">
        <Text className="text-white text-2xl font-bold">Progresso</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row mx-5 mb-4 bg-zinc-900 rounded-xl p-1">
        {(["peso", "cargas"] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg items-center ${t === tab ? "bg-indigo-500" : ""}`}
          >
            <Text className={`text-sm font-semibold capitalize ${t === tab ? "text-white" : "text-zinc-500"}`}>
              {t === "peso" ? "Peso" : "Cargas"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── Tab Peso ─────────────────────────────────────────────────── */}
      {tab === "peso" && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Cards de resumo */}
          <View className="flex-row px-5 gap-3 mb-6">
            <View className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <Text className="text-zinc-500 text-xs mb-1">Peso atual</Text>
              <Text className="text-white text-2xl font-bold">
                {latestWeight ?? user?.weight ?? "—"} <Text className="text-zinc-500 text-sm">kg</Text>
              </Text>
              {weightDiff !== null && (
                <View className="flex-row items-center mt-1">
                  <Ionicons
                    name={weightDiff >= 0 ? "arrow-up" : "arrow-down"}
                    size={12}
                    color={weightDiff >= 0 ? "#f87171" : "#34d399"}
                  />
                  <Text className={`text-xs ml-1 ${weightDiff >= 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {Math.abs(weightDiff).toFixed(1)} kg
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-1 bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <Text className="text-zinc-500 text-xs mb-1">IMC</Text>
              <Text className="text-white text-2xl font-bold">
                {bmiVal ?? "—"}
              </Text>
              {bmiVal && (
                <Text className="text-zinc-500 text-xs mt-1">
                  {parseFloat(bmiVal) < 18.5 ? "Abaixo do peso"
                    : parseFloat(bmiVal) < 25 ? "Peso normal"
                    : parseFloat(bmiVal) < 30 ? "Sobrepeso"
                    : "Obesidade"}
                </Text>
              )}
            </View>
          </View>

          {/* Registrar peso */}
          <View className="px-5 mb-6">
            <TouchableOpacity
              onPress={() => setWeightModal(true)}
              className="flex-row items-center justify-center gap-2 bg-zinc-900 rounded-2xl p-4 border border-dashed border-zinc-700"
            >
              <Ionicons name="add-circle-outline" size={20} color="#6366f1" />
              <Text className="text-indigo-400 font-medium">Registrar peso de hoje</Text>
            </TouchableOpacity>
          </View>

          {/* Histórico */}
          <View className="px-5">
            <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Histórico</Text>
            {app.weightHistory.length === 0 ? (
              <View className="items-center py-8">
                <Ionicons name="scale-outline" size={36} color="#27272a" />
                <Text className="text-zinc-600 text-sm mt-3">Nenhum registro ainda</Text>
              </View>
            ) : (
              <FlatList
                data={app.weightHistory}
                keyExtractor={(item) => item.date}
                scrollEnabled={false}
                renderItem={({ item, index }) => {
                  const prev = app.weightHistory[index + 1];
                  const diff = prev ? item.weight - prev.weight : null;
                  return (
                    <View className="flex-row items-center justify-between py-3.5 border-b border-zinc-900">
                      <Text className="text-zinc-400 text-sm">{fmtDate(item.date)}</Text>
                      <View className="flex-row items-center gap-2">
                        {diff !== null && (
                          <Text className={`text-xs ${diff > 0 ? "text-red-400" : diff < 0 ? "text-emerald-400" : "text-zinc-600"}`}>
                            {diff > 0 ? "+" : ""}{diff.toFixed(1)} kg
                          </Text>
                        )}
                        <Text className="text-white font-semibold">{item.weight} kg</Text>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* ─── Tab Cargas ───────────────────────────────────────────────── */}
      {tab === "cargas" && (
        <View className="flex-1 px-5">
          {exerciseNames.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="barbell-outline" size={40} color="#27272a" />
              <Text className="text-zinc-500 text-base font-semibold mt-4">Sem dados ainda</Text>
              <Text className="text-zinc-600 text-sm mt-1 text-center">
                Registre treinos com cargas para ver a progressão aqui.
              </Text>
            </View>
          ) : (
            <>
              {/* Seletor de exercício */}
              <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Selecione o exercício</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
                style={{ maxHeight: 48, flexGrow: 0 }}
              >
                {exerciseNames.map((name) => (
                  <TouchableOpacity
                    key={name}
                    onPress={() => setSelectedEx(name)}
                    className={`px-3 py-1.5 rounded-full border ${
                      selectedEx === name
                        ? "bg-indigo-500 border-indigo-500"
                        : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <Text className={`text-sm ${selectedEx === name ? "text-white" : "text-zinc-400"}`}>
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {selectedEx && (
                <>
                  <Text className="text-zinc-500 text-xs uppercase tracking-widest mt-4 mb-3">
                    Progressão — {selectedEx}
                  </Text>
                  {exHistory.length === 0 ? (
                    <Text className="text-zinc-600 text-sm">Nenhum registro para este exercício.</Text>
                  ) : (
                    <FlatList
                      data={exHistory}
                      keyExtractor={(item) => item.date}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 100 }}
                      renderItem={({ item, index }) => {
                        const prev = exHistory[index - 1];
                        const diff = prev ? item.maxWeight - prev.maxWeight : null;
                        const isPR = exHistory.every((e, i) => i >= index || e.maxWeight <= item.maxWeight);
                        return (
                          <View className="flex-row items-center justify-between py-3.5 border-b border-zinc-900">
                            <View className="flex-row items-center gap-2">
                              <Text className="text-zinc-400 text-sm">{fmtDate(item.date)}</Text>
                              {isPR && index === exHistory.length - 1 && (
                                <View className="bg-amber-500/10 px-1.5 py-0.5 rounded">
                                  <Text className="text-amber-400 text-xs font-bold">PR</Text>
                                </View>
                              )}
                            </View>
                            <View className="flex-row items-center gap-2">
                              {diff !== null && diff !== 0 && (
                                <Text className={`text-xs ${diff > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                  {diff > 0 ? "+" : ""}{diff.toFixed(1)} kg
                                </Text>
                              )}
                              <Text className="text-white font-semibold">{item.maxWeight} kg</Text>
                            </View>
                          </View>
                        );
                      }}
                    />
                  )}
                </>
              )}

              {!selectedEx && (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-zinc-600 text-sm">Selecione um exercício acima</Text>
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* Modal registrar peso */}
      <Modal visible={weightModal} transparent animationType="slide">
        <TouchableOpacity
          className="flex-1 bg-black/60"
          activeOpacity={1}
          onPress={() => setWeightModal(false)}
        />
        <View className="bg-zinc-900 rounded-t-3xl px-6 py-6">
          <Text className="text-white text-lg font-bold mb-4">Registrar peso</Text>
          <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 h-12 mb-5">
            <TextInput
              className="flex-1 text-white text-base"
              placeholder="Ex: 75.5"
              placeholderTextColor="#52525b"
              keyboardType="decimal-pad"
              value={newWeight}
              onChangeText={setNewWeight}
              autoFocus
            />
            <Text className="text-zinc-500">kg</Text>
          </View>
          <TouchableOpacity
            onPress={saveWeight}
            className="bg-indigo-500 h-12 rounded-xl items-center justify-center"
          >
            <Text className="text-white font-semibold">Salvar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
