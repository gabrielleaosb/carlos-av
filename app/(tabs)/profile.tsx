import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, Modal, TextInput,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { UserGoal } from "../../types";

const GOAL_CONFIG: Record<UserGoal, { label: string; icon: string; color: string }> = {
  muscle_gain:  { label: "Ganhar Massa",    icon: "barbell-outline",      color: "#6366f1" },
  fat_loss:     { label: "Perder Gordura",  icon: "flame-outline",        color: "#f97316" },
  bf_reduction: { label: "Reduzir BF%",     icon: "body-outline",         color: "#10b981" },
  general:      { label: "Saúde Geral",     icon: "heart-outline",        color: "#ec4899" },
};

function bmi(weight?: number, height?: number) {
  if (!weight || !height) return null;
  return (weight / Math.pow(height / 100, 2)).toFixed(1);
}

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const app = useApp();

  const [editModal, setEditModal]   = useState(false);
  const [goalModal, setGoalModal]   = useState(false);
  const [editWeight, setEditWeight] = useState(String(user?.weight ?? ""));
  const [editHeight, setEditHeight] = useState(String(user?.height ?? ""));

  const totalWorkouts  = app.logs.length;
  const latestWeight   = app.weightHistory[0]?.weight ?? user?.weight;
  const bmiVal         = bmi(latestWeight, user?.height);
  const goalCfg        = user?.goal ? GOAL_CONFIG[user.goal] : null;

  const GOALS: UserGoal[] = ["muscle_gain", "fat_loss", "bf_reduction", "general"];

  function saveEdit() {
    updateUser({
      weight: editWeight ? parseFloat(editWeight) : undefined,
      height: editHeight ? parseFloat(editHeight) : undefined,
    });
    setEditModal(false);
  }

  function handleSignOut() {
    Alert.alert("Sair", "Deseja sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => { await signOut(); router.replace("/(auth)/login"); },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View className="px-5 pt-5 pb-6">
          <Text className="text-white text-2xl font-bold">Perfil</Text>
        </View>

        {/* Avatar */}
        <View className="px-5 flex-row items-center gap-4 mb-8">
          <View className="w-16 h-16 rounded-2xl bg-indigo-500 items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">{user?.name}</Text>
            <Text className="text-zinc-500 text-sm">{user?.email}</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row px-5 gap-3 mb-8">
          <View className="flex-1 bg-zinc-900 rounded-2xl p-4 items-center border border-zinc-800">
            <Text className="text-white text-xl font-bold">{totalWorkouts}</Text>
            <Text className="text-zinc-500 text-xs mt-1">Realizados</Text>
          </View>
          <View className="flex-1 bg-zinc-900 rounded-2xl p-4 items-center border border-zinc-800">
            <Text className="text-white text-xl font-bold">
              {latestWeight ? `${latestWeight}` : "—"}
            </Text>
            <Text className="text-zinc-500 text-xs mt-1">Peso (kg)</Text>
          </View>
          <View className="flex-1 bg-zinc-900 rounded-2xl p-4 items-center border border-zinc-800">
            <Text className="text-white text-xl font-bold">{bmiVal ?? "—"}</Text>
            <Text className="text-zinc-500 text-xs mt-1">IMC</Text>
          </View>
        </View>

        {/* Objetivo */}
        <View className="px-5 mb-6">
          <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Objetivo</Text>
          <TouchableOpacity
            onPress={() => setGoalModal(true)}
            activeOpacity={0.7}
            className="flex-row items-center bg-zinc-900 rounded-2xl p-4 border border-zinc-800"
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: goalCfg ? goalCfg.color + "20" : "#27272a" }}
            >
              <Ionicons
                name={(goalCfg?.icon ?? "flag-outline") as any}
                size={20}
                color={goalCfg?.color ?? "#52525b"}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold">
                {goalCfg?.label ?? "Não definido"}
              </Text>
              <Text className="text-zinc-500 text-xs mt-0.5">Toque para alterar</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#3f3f46" />
          </TouchableOpacity>
        </View>

        {/* Dados físicos */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-zinc-500 text-xs uppercase tracking-widest">Dados físicos</Text>
            <TouchableOpacity onPress={() => setEditModal(true)}>
              <Text className="text-indigo-400 text-sm">Editar</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <View className="flex-row items-center px-4 py-3.5 border-b border-zinc-800">
              <Ionicons name="scale-outline" size={18} color="#52525b" style={{ marginRight: 12 }} />
              <Text className="text-white flex-1">Peso</Text>
              <Text className="text-zinc-400">{latestWeight ? `${latestWeight} kg` : "—"}</Text>
            </View>
            <View className="flex-row items-center px-4 py-3.5">
              <Ionicons name="resize-outline" size={18} color="#52525b" style={{ marginRight: 12 }} />
              <Text className="text-white flex-1">Altura</Text>
              <Text className="text-zinc-400">{user?.height ? `${user.height} cm` : "—"}</Text>
            </View>
          </View>
        </View>

        {/* Sair */}
        <View className="px-5">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center bg-zinc-900 rounded-2xl px-4 py-4 border border-zinc-800"
          >
            <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 12 }} />
            <Text className="text-red-400 flex-1">Sair da conta</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-zinc-700 text-xs text-center mt-8">FitTrack Pro v2.0</Text>
      </ScrollView>

      {/* Modal editar dados */}
      <Modal visible={editModal} transparent animationType="slide">
        <TouchableOpacity className="flex-1 bg-black/60" activeOpacity={1} onPress={() => setEditModal(false)} />
        <View className="bg-zinc-900 rounded-t-3xl px-6 py-6">
          <Text className="text-white text-lg font-bold mb-5">Editar dados físicos</Text>
          <View className="gap-4 mb-6">
            <View>
              <Text className="text-zinc-500 text-xs mb-1.5">Peso (kg)</Text>
              <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 h-12">
                <TextInput
                  className="flex-1 text-white"
                  placeholder="75"
                  placeholderTextColor="#52525b"
                  keyboardType="decimal-pad"
                  value={editWeight}
                  onChangeText={setEditWeight}
                />
                <Text className="text-zinc-500 text-sm">kg</Text>
              </View>
            </View>
            <View>
              <Text className="text-zinc-500 text-xs mb-1.5">Altura (cm)</Text>
              <View className="flex-row items-center bg-zinc-800 rounded-xl px-4 h-12">
                <TextInput
                  className="flex-1 text-white"
                  placeholder="175"
                  placeholderTextColor="#52525b"
                  keyboardType="number-pad"
                  value={editHeight}
                  onChangeText={setEditHeight}
                />
                <Text className="text-zinc-500 text-sm">cm</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={saveEdit} className="bg-indigo-500 h-12 rounded-xl items-center justify-center">
            <Text className="text-white font-semibold">Salvar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal alterar objetivo */}
      <Modal visible={goalModal} transparent animationType="slide">
        <TouchableOpacity className="flex-1 bg-black/60" activeOpacity={1} onPress={() => setGoalModal(false)} />
        <View className="bg-zinc-900 rounded-t-3xl px-6 py-6">
          <Text className="text-white text-lg font-bold mb-5">Alterar objetivo</Text>
          <View className="gap-3 mb-4">
            {GOALS.map((g) => {
              const cfg = GOAL_CONFIG[g];
              return (
                <TouchableOpacity
                  key={g}
                  onPress={() => { updateUser({ goal: g }); setGoalModal(false); }}
                  activeOpacity={0.7}
                  className={`flex-row items-center p-4 rounded-2xl border ${
                    user?.goal === g ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-800 bg-zinc-800"
                  }`}
                >
                  <Ionicons name={cfg.icon as any} size={20} color={cfg.color} style={{ marginRight: 12 }} />
                  <Text className="text-white flex-1">{cfg.label}</Text>
                  {user?.goal === g && <Ionicons name="checkmark-circle" size={20} color="#6366f1" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
