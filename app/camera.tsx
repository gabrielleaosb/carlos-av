import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useWorkouts } from "../contexts/WorkoutContext";

const { width } = Dimensions.get("window");

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>("front");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { addProgressPhoto, progressPhotos } = useWorkouts();

  useEffect(() => {
    (async () => {
      await requestPermission();
      await requestMediaPermission();
    })();
  }, []);

  async function takePhoto() {
    if (!cameraRef.current || isTakingPhoto) return;
    setIsTakingPhoto(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        base64: false,
        skipProcessing: false,
      });
      if (photo) setCapturedPhoto(photo.uri);
    } catch {
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    } finally {
      setIsTakingPhoto(false);
    }
  }

  async function savePhoto() {
    if (!capturedPhoto) return;

    if (mediaPermission?.granted) {
      try {
        await MediaLibrary.saveToLibraryAsync(capturedPhoto);
      } catch {
        // ignore if can't save to library
      }
    }

    addProgressPhoto({
      uri: capturedPhoto,
      date: new Date().toISOString(),
      notes: "Foto de progresso",
    });

    Alert.alert("Foto salva!", "Sua foto de progresso foi registrada. 📸", [
      {
        text: "OK",
        onPress: () => {
          setCapturedPhoto(null);
        },
      },
    ]);
  }

  function discardPhoto() {
    setCapturedPhoto(null);
  }

  // ─── Permission screens ──────────────────────────────────────────────────

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center px-6">
        <View className="bg-orange-500/20 p-5 rounded-full mb-6">
          <Ionicons name="camera-outline" size={52} color="#f97316" />
        </View>
        <Text className="text-white text-2xl font-bold text-center mb-2">
          Câmera necessária
        </Text>
        <Text className="text-zinc-400 text-center mb-8 leading-relaxed">
          Precisamos de acesso à câmera para você registrar suas fotos de
          progresso físico.
        </Text>
        <TouchableOpacity
          className="bg-orange-500 px-8 py-4 rounded-xl w-full items-center"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold text-base">
            Conceder Permissão
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <Text className="text-zinc-400">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ─── Photo preview ───────────────────────────────────────────────────────

  if (capturedPhoto) {
    return (
      <View className="flex-1 bg-zinc-950">
        <Image source={{ uri: capturedPhoto }} className="flex-1" resizeMode="contain" />
        <SafeAreaView className="absolute bottom-0 left-0 right-0">
          <View className="flex-row gap-4 px-6 pb-6 pt-4 bg-zinc-950/90">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl py-4"
              onPress={discardPhoto}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text className="text-red-400 font-semibold">Descartar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 bg-orange-500 rounded-xl py-4"
              onPress={savePhoto}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text className="text-white font-semibold">Salvar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ─── Camera view ─────────────────────────────────────────────────────────

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} className="flex-1" facing={facing}>
        {/* Overlay guide */}
        <View className="flex-1 items-center justify-center">
          <View className="border-2 border-white/30 rounded-3xl w-64 h-96" />
          <Text className="text-white/50 text-xs mt-3 text-center px-6">
            Posicione-se dentro do guia
          </Text>
        </View>
      </CameraView>

      {/* Controls */}
      <SafeAreaView className="absolute bottom-0 left-0 right-0">
        <View className="pb-6 pt-4 items-center bg-black/50">
          {/* Previous photos strip */}
          {progressPhotos.length > 0 && (
            <View className="w-full mb-4">
              <FlatList
                data={progressPhotos.slice(0, 5)}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  gap: 8,
                }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.uri }}
                    className="w-14 h-14 rounded-xl border border-white/20"
                    resizeMode="cover"
                  />
                )}
              />
            </View>
          )}

          <View className="flex-row items-center justify-between w-full px-8">
            {/* Flip */}
            <TouchableOpacity
              className="bg-white/20 p-3.5 rounded-full"
              onPress={() =>
                setFacing((f) => (f === "front" ? "back" : "front"))
              }
            >
              <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Shutter */}
            <TouchableOpacity
              className={`bg-white rounded-full items-center justify-center ${
                isTakingPhoto ? "opacity-50" : ""
              }`}
              style={{ width: 72, height: 72 }}
              onPress={takePhoto}
              disabled={isTakingPhoto}
            >
              {isTakingPhoto ? (
                <ActivityIndicator color="#000" />
              ) : (
                <View className="bg-white w-16 h-16 rounded-full border-4 border-zinc-300" />
              )}
            </TouchableOpacity>

            {/* Gallery / back */}
            <TouchableOpacity
              className="bg-white/20 p-3.5 rounded-full"
              onPress={() => router.push("/(tabs)/progress")}
            >
              <Ionicons name="images-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
