import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function LoginScreen() {
  const { signInWithEmail, isLoading } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!email.trim())                       e.email    = "E-mail obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email))   e.email    = "E-mail inválido";
    if (!password)                           e.password = "Senha obrigatória";
    else if (password.length < 6)           e.password = "Mínimo 6 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    try {
      await signInWithEmail(email, password);
      router.replace("/");
    } catch (err: any) {
      const msg =
        err?.code === "auth/invalid-credential" ||
        err?.code === "auth/wrong-password" ||
        err?.code === "auth/user-not-found"
          ? "E-mail ou senha incorretos."
          : err?.code === "auth/too-many-requests"
          ? "Muitas tentativas. Aguarde alguns minutos."
          : "Erro ao fazer login. Tente novamente.";
      Alert.alert("Erro", msg);
    }
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
          <View className="flex-1 px-6 justify-center py-10">
            {/* Logo */}
            <View className="items-center mb-12">
              <View className="bg-indigo-500 w-20 h-20 rounded-3xl items-center justify-center mb-5">
                <Ionicons name="barbell" size={40} color="#fff" />
              </View>
              <Text className="text-white text-4xl font-bold tracking-tight">
                FitTrack <Text className="text-indigo-400">Pro</Text>
              </Text>
              <Text className="text-zinc-500 text-base mt-2">
                Monitore seu progresso
              </Text>
            </View>

            {/* Form */}
            <View className="mb-6">
              <Text className="text-white text-2xl font-bold mb-1">Bem-vindo de volta!</Text>
              <Text className="text-zinc-500 mb-6">Entre na sua conta para continuar</Text>

              <Input
                label="E-mail"
                placeholder="seu@email.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                icon="mail-outline"
                error={errors.email}
                autoComplete="email"
              />

              <Input
                label="Senha"
                placeholder="••••••••"
                isPassword
                value={password}
                onChangeText={setPassword}
                icon="lock-closed-outline"
                error={errors.password}
              />

              <Button
                title="Entrar"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="lg"
              />
            </View>

            {/* Sign up */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-zinc-500">Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text className="text-indigo-400 font-semibold">Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
