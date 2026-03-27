import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "elevated";
}

export function Card({ children, variant = "default", className, ...props }: CardProps) {
  return (
    <View
      className={`
        bg-zinc-900 rounded-2xl p-4
        ${variant === "elevated" ? "shadow-lg shadow-black/50" : "border border-zinc-800"}
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </View>
  );
}
