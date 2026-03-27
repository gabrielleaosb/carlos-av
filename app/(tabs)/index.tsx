import React, { useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, ListRenderItem } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { WorkoutLog } from "../../types";

const DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const DAY_NAMES  = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function HomeScreen() {
  const { user }     = useAuth();
  const app          = useApp();
  const today        = new Date().getDay();
  const todayRoutine = app.getTodayRoutine();
  const doneDays     = app.getDoneThisWeek();
  const recentLogs   = app.getThisWeekLogs().slice(0, 5);
  const scheduled    = app.routine.map((d) => d.dayOfWeek);

  const renderLog: ListRenderItem<WorkoutLog> = useCallback(({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/workout/${item.workoutId}`)}
      className="flex-row items-center bg-zinc-900 rounded-2xl px-4 py-3.5 mb-2"
      activeOpacity={0.7}
    >
      <View className="w-9 h-9 bg-emerald-500/10 rounded-xl items-center justify-center mr-3">
        <Ionicons name="checkmark" size={18} color="#10b981" />
      </View>
      <View className="flex-1">
        <Text className="text-white text-sm font-semibold" numberOfLines={1}>{item.workoutName}</Text>
        <Text className="text-zinc-500 text-xs mt-0.5">{fmtDate(item.date)} · {item.duration} min</Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color="#3f3f46" />
    </TouchableOpacity>
  ), []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <View className="px-5 pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-zinc-500 text-sm">{greeting()},</Text>
            <Text className="text-white text-2xl font-bold">{user?.name?.split(" ")[0]}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/routine")}
            className="w-10 h-10 bg-zinc-900 rounded-xl items-center justify-center"
          >
            <Ionicons name="calendar-outline" size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Semana */}
        <View className="px-5 mb-6">
          <View className="bg-zinc-900 rounded-2xl p-4">
            <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Esta semana</Text>
            <View className="flex-row justify-between">
              {DAY_LABELS.map((label, i) => {
                const isDone  = doneDays.includes(i);
                const isSched = scheduled.includes(i);
                const isToday = i === today;
                return (
                  <View key={i} className="items-center gap-1.5">
                    <Text className={`text-xs ${isToday ? "text-white font-bold" : "text-zinc-600"}`}>
                      {label}
                    </Text>
                    <View
                      className={`w-9 h-9 rounded-full items-center justify-center ${
                        isDone ? "bg-emerald-500" : isSched ? "bg-indigo-500/20" : "bg-zinc-800"
                      } ${isToday ? "border-2 border-indigo-400" : ""}`}
                    >
                      {isDone    && <Ionicons name="checkmark" size={16} color="#fff" />}
                      {!isDone && isSched && <View className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Treino de hoje */}
        <View className="px-5 mb-6">
          <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
            Hoje — {DAY_NAMES[today]}
          </Text>
          {todayRoutine ? (
            <TouchableOpacity
              onPress={() => router.push(`/workout/${todayRoutine.workoutId}`)}
              activeOpacity={0.8}
              className="bg-indigo-500 rounded-2xl p-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-indigo-200 text-xs mb-1">Treino programado</Text>
                  <Text className="text-white text-xl font-bold" numberOfLines={2}>
                    {todayRoutine.workoutName}
                  </Text>
                </View>
                <View className="w-12 h-12 bg-white/15 rounded-xl items-center justify-center">
                  <Ionicons name="play" size={22} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push("/routine")}
              activeOpacity={0.7}
              className="bg-zinc-900 rounded-2xl p-5 border border-dashed border-zinc-800 items-center"
            >
              <Ionicons name="add-circle-outline" size={24} color="#6366f1" />
              <Text className="text-zinc-500 text-sm mt-2">Nenhum treino programado</Text>
              <Text className="text-indigo-400 text-sm font-medium mt-1">Montar rotina</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Histórico desta semana */}
        <View className="px-5">
          <Text className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
            Registros desta semana
          </Text>
          {recentLogs.length > 0 ? (
            <FlatList
              data={recentLogs}
              renderItem={renderLog}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center py-8">
              <Ionicons name="barbell-outline" size={36} color="#27272a" />
              <Text className="text-zinc-600 text-sm mt-3 text-center">
                Nenhum treino registrado ainda.{"\n"}Vamos começar!
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
