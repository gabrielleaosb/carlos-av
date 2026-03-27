import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocation } from "../hooks/useLocation";
import { useWorkouts } from "../contexts/WorkoutContext";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

function CoordBox({ label, value }: { label: string; value: string }) {
  return (
    <View className="bg-zinc-800 rounded-xl p-3 flex-1">
      <Text className="text-zinc-400 text-xs mb-1">{label}</Text>
      <Text className="text-white font-mono font-semibold text-sm">
        {value}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  badge,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <View className="flex-row items-center py-3 border-b border-zinc-800">
      <View className="bg-zinc-800 p-2 rounded-lg mr-3">
        <Ionicons name={icon} size={16} color="#f97316" />
      </View>
      <View className="flex-1">
        <Text className="text-zinc-400 text-xs">{label}</Text>
        <Text className="text-white text-sm font-medium mt-0.5">{value}</Text>
      </View>
      {badge && <Badge label={badge} variant="orange" />}
    </View>
  );
}

export default function LocationScreen() {
  const locationHook = useLocation();
  const { workouts } = useWorkouts();

  const [watchId, setWatchId] = useState<Location.LocationSubscription | null>(
    null
  );
  const [isWatching, setIsWatching] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);

  // Workouts with GPS
  const workoutsWithLocation = workouts.filter((w) => w.location);

  useEffect(() => {
    // Auto fetch on mount
    locationHook.getCurrentLocation();
  }, []);

  async function startWatching() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Não é possível rastrear a localização.");
      return;
    }

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (loc) => {
        setAccuracy(loc.coords.accuracy ?? null);
        setAltitude(loc.coords.altitude ?? null);
        setSpeed(loc.coords.speed ?? null);
      }
    );

    setWatchId(sub);
    setIsWatching(true);
  }

  function stopWatching() {
    watchId?.remove();
    setWatchId(null);
    setIsWatching(false);
  }

  useEffect(() => {
    return () => {
      watchId?.remove();
    };
  }, [watchId]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5 pt-4">
          {/* Map placeholder */}
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl h-52 items-center justify-center mb-4 overflow-hidden">
            <View className="absolute inset-0 opacity-10">
              {/* Grid lines for map feel */}
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={`h${i}`}
                  className="absolute w-full h-px bg-zinc-400"
                  style={{ top: `${i * 14.28}%` }}
                />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={`v${i}`}
                  className="absolute h-full w-px bg-zinc-400"
                  style={{ left: `${i * 14.28}%` }}
                />
              ))}
            </View>
            {locationHook.isLoading ? (
              <ActivityIndicator size="large" color="#f97316" />
            ) : locationHook.location ? (
              <View className="items-center">
                <View className="bg-orange-500 p-3 rounded-full mb-2 shadow-lg shadow-orange-500/50">
                  <Ionicons name="location" size={28} color="#fff" />
                </View>
                <Text className="text-white font-semibold text-sm">
                  Localização capturada
                </Text>
                {locationHook.address && (
                  <Text
                    className="text-zinc-400 text-xs mt-0.5 text-center px-4"
                    numberOfLines={2}
                  >
                    {locationHook.address}
                  </Text>
                )}
              </View>
            ) : (
              <View className="items-center">
                <Ionicons
                  name="location-outline"
                  size={40}
                  color="#3f3f46"
                />
                <Text className="text-zinc-500 mt-2 text-sm">
                  Localização não capturada
                </Text>
              </View>
            )}
          </View>

          {/* Coordinates */}
          {locationHook.location && (
            <View className="flex-row gap-3 mb-4">
              <CoordBox
                label="Latitude"
                value={locationHook.location.latitude.toFixed(6) + "°"}
              />
              <CoordBox
                label="Longitude"
                value={locationHook.location.longitude.toFixed(6) + "°"}
              />
            </View>
          )}

          {/* Action buttons */}
          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 bg-orange-500 rounded-xl py-3.5"
              onPress={locationHook.getCurrentLocation}
              disabled={locationHook.isLoading}
            >
              {locationHook.isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="navigate-outline" size={18} color="#fff" />
              )}
              <Text className="text-white font-semibold">
                {locationHook.isLoading ? "Buscando..." : "Atualizar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3.5 border ${
                isWatching
                  ? "bg-red-500/10 border-red-500/40"
                  : "bg-zinc-800 border-zinc-700"
              }`}
              onPress={isWatching ? stopWatching : startWatching}
            >
              <Ionicons
                name={isWatching ? "stop-circle-outline" : "pulse-outline"}
                size={18}
                color={isWatching ? "#ef4444" : "#71717a"}
              />
              <Text
                className={`font-semibold ${
                  isWatching ? "text-red-400" : "text-zinc-400"
                }`}
              >
                {isWatching ? "Parar" : "Rastrear"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Real-time data */}
          {isWatching && (
            <Card className="mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-green-400 font-semibold text-sm">
                  Rastreamento ativo
                </Text>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-zinc-800 rounded-xl p-3 items-center">
                  <Ionicons
                    name="speedometer-outline"
                    size={18}
                    color="#f97316"
                  />
                  <Text className="text-white font-bold mt-1">
                    {speed != null
                      ? `${(speed * 3.6).toFixed(1)}`
                      : "—"}
                  </Text>
                  <Text className="text-zinc-400 text-xs">km/h</Text>
                </View>
                <View className="flex-1 bg-zinc-800 rounded-xl p-3 items-center">
                  <Ionicons
                    name="arrow-up-outline"
                    size={18}
                    color="#f97316"
                  />
                  <Text className="text-white font-bold mt-1">
                    {altitude != null ? `${altitude.toFixed(0)}m` : "—"}
                  </Text>
                  <Text className="text-zinc-400 text-xs">altitude</Text>
                </View>
                <View className="flex-1 bg-zinc-800 rounded-xl p-3 items-center">
                  <Ionicons name="locate-outline" size={18} color="#f97316" />
                  <Text className="text-white font-bold mt-1">
                    {accuracy != null ? `±${accuracy.toFixed(0)}m` : "—"}
                  </Text>
                  <Text className="text-zinc-400 text-xs">precisão</Text>
                </View>
              </View>
            </Card>
          )}

          {/* Error */}
          {locationHook.error && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex-row items-center gap-2">
              <Ionicons name="alert-circle-outline" size={18} color="#ef4444" />
              <Text className="text-red-400 text-sm flex-1">
                {locationHook.error}
              </Text>
            </View>
          )}

          {/* Permission status */}
          <Card className="mb-4">
            <Text className="text-white font-semibold mb-2">
              Permissões de Localização
            </Text>
            <InfoRow
              icon="shield-checkmark-outline"
              label="Status"
              value={
                locationHook.permissionGranted
                  ? "Permissão concedida"
                  : locationHook.permissionGranted === false
                  ? "Permissão negada"
                  : "Não solicitada"
              }
              badge={
                locationHook.permissionGranted ? "Ativo" : undefined
              }
            />
            <InfoRow
              icon="locate-outline"
              label="Provedor"
              value="GPS + Rede"
            />
            <View className="py-3">
              <View className="flex-row items-center">
                <View className="bg-zinc-800 p-2 rounded-lg mr-3">
                  <Ionicons name="information-circle-outline" size={16} color="#f97316" />
                </View>
                <Text className="text-zinc-400 text-xs flex-1 leading-relaxed">
                  A localização é usada para registrar onde seus treinos
                  acontecem. Os dados ficam armazenados apenas no dispositivo.
                </Text>
              </View>
            </View>
          </Card>

          {/* Workouts with location */}
          {workoutsWithLocation.length > 0 && (
            <Card>
              <Text className="text-white font-semibold mb-3">
                Treinos com GPS ({workoutsWithLocation.length})
              </Text>
              {workoutsWithLocation.map((w) => (
                <View
                  key={w.id}
                  className="flex-row items-center py-2.5 border-b border-zinc-800"
                >
                  <View className="bg-orange-500/20 p-2 rounded-lg mr-3">
                    <Ionicons name="location-outline" size={14} color="#f97316" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-sm font-medium">
                      {w.name}
                    </Text>
                    <Text className="text-zinc-400 text-xs" numberOfLines={1}>
                      {w.location?.gym ??
                        w.location?.address ??
                        `${w.location?.latitude.toFixed(4)}, ${w.location?.longitude.toFixed(4)}`}
                    </Text>
                  </View>
                  <Text className="text-zinc-500 text-xs">
                    {new Date(w.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
