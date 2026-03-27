import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { UserGoal } from "../types";

const GOALS: { value: UserGoal; label: string; description: string; icon: string }[] = [
  { value: "muscle_gain",  label: "Ganhar Massa",      description: "Aumentar volume muscular", icon: "barbell-outline" },
  { value: "fat_loss",     label: "Perder Gordura",    description: "Reduzir peso e gordura",   icon: "flame-outline" },
  { value: "bf_reduction", label: "Reduzir BF%",       description: "Definição muscular",       icon: "body-outline" },
  { value: "general",      label: "Saúde Geral",       description: "Melhorar condicionamento", icon: "heart-outline" },
];

export default function OnboardingScreen() {
  const { updateUser, user } = useAuth();
  const [step,   setStep]   = useState(0);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal,   setGoal]   = useState<UserGoal | null>(null);

  async function finish() {
    await updateUser({
      weight:         weight ? parseFloat(weight) : undefined,
      height:         height ? parseFloat(height) : undefined,
      goal:           goal ?? "general",
      onboardingDone: true,
    });
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-10">
            {/* Progress dots */}
            <View className="flex-row gap-2 mb-12">
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  className={`h-1 rounded-full flex-1 ${
                    i <= step ? "bg-indigo-500" : "bg-zinc-800"
                  }`}
                />
              ))}
            </View>

            {/* Step 0: Boas-vindas + Dados físicos */}
            {step === 0 && (
              <View className="flex-1">
                <Text className="text-white text-3xl font-bold mb-2">
                  Olá, {user?.name?.split(" ")[0]}!
                </Text>
                <Text className="text-zinc-400 text-base mb-10">
                  Vamos configurar seu perfil para personalizar sua experiência.
                </Text>

                <Text className="text-zinc-300 text-sm font-medium mb-4">Dados físicos</Text>

                <View className="gap-4 mb-8">
                  <View>
                    <Text className="text-zinc-500 text-xs mb-1.5">Peso atual (kg)</Text>
                    <View className="flex-row items-center bg-zinc-900 rounded-xl px-4 h-12 border border-zinc-800">
                      <Ionicons name="scale-outline" size={18} color="#6366f1" style={{ marginRight: 10 }} />
                      <TextInput
                        className="flex-1 text-white text-base"
                        placeholder="Ex: 75"
                        placeholderTextColor="#52525b"
                        keyboardType="decimal-pad"
                        value={weight}
                        onChangeText={setWeight}
                      />
                      <Text className="text-zinc-500 text-sm">kg</Text>
                    </View>
                  </View>

                  <View>
                    <Text className="text-zinc-500 text-xs mb-1.5">Altura (cm)</Text>
                    <View className="flex-row items-center bg-zinc-900 rounded-xl px-4 h-12 border border-zinc-800">
                      <Ionicons name="resize-outline" size={18} color="#6366f1" style={{ marginRight: 10 }} />
                      <TextInput
                        className="flex-1 text-white text-base"
                        placeholder="Ex: 175"
                        placeholderTextColor="#52525b"
                        keyboardType="number-pad"
                        value={height}
                        onChangeText={setHeight}
                      />
                      <Text className="text-zinc-500 text-sm">cm</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setStep(1)}
                  className="bg-indigo-500 h-13 rounded-2xl items-center justify-center mt-auto"
                >
                  <Text className="text-white font-semibold text-base">Continuar</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 1: Objetivo */}
            {step === 1 && (
              <View className="flex-1">
                <Text className="text-white text-3xl font-bold mb-2">Qual seu objetivo?</Text>
                <Text className="text-zinc-400 text-base mb-8">
                  Isso vai guiar suas metas e recomendações.
                </Text>

                <View className="gap-3 mb-8">
                  {GOALS.map((g) => (
                    <TouchableOpacity
                      key={g.value}
                      onPress={() => setGoal(g.value)}
                      activeOpacity={0.7}
                      className={`flex-row items-center p-4 rounded-2xl border ${
                        goal === g.value
                          ? "bg-indigo-500/10 border-indigo-500"
                          : "bg-zinc-900 border-zinc-800"
                      }`}
                    >
                      <View
                        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                          goal === g.value ? "bg-indigo-500" : "bg-zinc-800"
                        }`}
                      >
                        <Ionicons
                          name={g.icon as any}
                          size={20}
                          color={goal === g.value ? "#fff" : "#71717a"}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className={`font-semibold text-sm ${goal === g.value ? "text-white" : "text-zinc-300"}`}>
                          {g.label}
                        </Text>
                        <Text className="text-zinc-500 text-xs mt-0.5">{g.description}</Text>
                      </View>
                      {goal === g.value && (
                        <Ionicons name="checkmark-circle" size={20} color="#6366f1" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="flex-row gap-3 mt-auto">
                  <TouchableOpacity
                    onPress={() => setStep(0)}
                    className="flex-1 h-13 rounded-2xl items-center justify-center border border-zinc-800"
                  >
                    <Text className="text-zinc-400 font-medium">Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    disabled={!goal}
                    className={`flex-2 flex-1 h-13 rounded-2xl items-center justify-center ${
                      goal ? "bg-indigo-500" : "bg-zinc-800"
                    }`}
                  >
                    <Text className={`font-semibold text-base ${goal ? "text-white" : "text-zinc-600"}`}>
                      Continuar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 2: Pronto */}
            {step === 2 && (
              <View className="flex-1 items-center justify-center">
                <View className="w-20 h-20 bg-indigo-500 rounded-3xl items-center justify-center mb-6">
                  <Ionicons name="checkmark" size={40} color="#fff" />
                </View>
                <Text className="text-white text-3xl font-bold mb-3 text-center">
                  Tudo pronto!
                </Text>
                <Text className="text-zinc-400 text-base text-center mb-12">
                  Seu perfil está configurado. Agora é hora de treinar.
                </Text>

                <TouchableOpacity
                  onPress={finish}
                  className="bg-indigo-500 h-13 rounded-2xl items-center justify-center w-full"
                >
                  <Text className="text-white font-semibold text-base">Começar agora</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
