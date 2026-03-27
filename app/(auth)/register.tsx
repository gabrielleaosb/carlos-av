import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth();

  const [name, setName]                         = useState("");
  const [email, setEmail]                       = useState("");
  const [password, setPassword]                 = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!name.trim())                          e.name            = "Nome obrigatório";
    if (!email.trim())                         e.email           = "E-mail obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email))     e.email           = "E-mail inválido";
    if (!password)                             e.password        = "Senha obrigatória";
    else if (password.length < 6)             e.password        = "Mínimo 6 caracteres";
    if (password !== confirmPassword)          e.confirmPassword = "Senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    try {
      await signUp(name, email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      const msg =
        err?.code === "auth/email-already-in-use"
          ? "Este e-mail já está cadastrado."
          : err?.code === "auth/weak-password"
          ? "Senha fraca. Use ao menos 6 caracteres."
          : "Erro ao criar conta. Tente novamente.";
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
          <View className="flex-1 px-6 py-8">
            {/* Back */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center gap-1.5 mb-8 self-start"
            >
              <Ionicons name="arrow-back" size={18} color="#f97316" />
              <Text className="text-orange-500 text-sm">Voltar</Text>
            </TouchableOpacity>

            <Text className="text-white text-2xl font-bold mb-1">Criar conta</Text>
            <Text className="text-zinc-500 text-sm mb-8">
              Preencha os dados abaixo para começar
            </Text>

            <Input
              label="Nome"
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
              icon="person-outline"
              error={errors.name}
              autoCapitalize="words"
            />
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
              placeholder="Mínimo 6 caracteres"
              isPassword
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              error={errors.password}
            />
            <Input
              label="Confirmar senha"
              placeholder="Repita a senha"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="lock-closed-outline"
              error={errors.confirmPassword}
            />

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              size="lg"
            />

            <View className="flex-row justify-center mt-6">
              <Text className="text-zinc-500">Já tem conta? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-orange-500 font-medium">Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
