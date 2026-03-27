import React from "react";
import { View, Text } from "react-native";

type BadgeVariant = "orange" | "green" | "red" | "blue" | "zinc" | "yellow";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantClasses: Record<BadgeVariant, { bg: string; text: string }> = {
  orange: { bg: "bg-orange-500/20", text: "text-orange-400" },
  green:  { bg: "bg-green-500/20",  text: "text-green-400"  },
  red:    { bg: "bg-red-500/20",    text: "text-red-400"    },
  blue:   { bg: "bg-blue-500/20",   text: "text-blue-400"   },
  zinc:   { bg: "bg-zinc-700",      text: "text-zinc-300"   },
  yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
};

export function Badge({ label, variant = "zinc", size = "sm" }: BadgeProps) {
  const { bg, text } = variantClasses[variant];
  return (
    <View className={`${bg} rounded-full ${size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1"}`}>
      <Text className={`${text} ${size === "sm" ? "text-xs" : "text-sm"} font-medium`}>
        {label}
      </Text>
    </View>
  );
}
