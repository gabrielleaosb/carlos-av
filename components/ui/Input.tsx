import React, { useState } from "react";
import { View, TextInput, Text, TextInputProps, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  icon,
  isPassword = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-zinc-300 text-sm font-medium mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row items-center
          bg-zinc-800 rounded-xl border
          ${error ? "border-red-500" : "border-zinc-700"}
          px-4 h-14
        `}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color="#71717a"
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          className="flex-1 text-white text-base"
          placeholderTextColor="#71717a"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#71717a"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-400 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
