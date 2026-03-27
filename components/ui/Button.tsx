import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from "react-native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-indigo-500 active:bg-indigo-600",
  secondary: "bg-zinc-700 active:bg-zinc-600",
  outline: "border border-indigo-500 bg-transparent active:bg-indigo-500/10",
  ghost: "bg-transparent active:bg-zinc-800",
  danger: "bg-red-600 active:bg-red-700",
};

const textClasses: Record<Variant, string> = {
  primary: "text-white font-semibold",
  secondary: "text-white font-semibold",
  outline: "text-indigo-500 font-semibold",
  ghost: "text-zinc-300 font-semibold",
  danger: "text-white font-semibold",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 rounded-lg",
  md: "px-5 py-3.5 rounded-xl",
  lg: "px-6 py-4 rounded-xl",
};

const textSizeClasses: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`
        flex-row items-center justify-center
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-50" : ""}
        ${className ?? ""}
      `}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? "#6366f1" : "#fff"}
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <View className="mr-2">{icon}</View>
          )}
          <Text
            className={`${textClasses[variant]} ${textSizeClasses[size]}`}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <View className="ml-2">{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
