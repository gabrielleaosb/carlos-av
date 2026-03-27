import { useState, useCallback } from "react";
import * as Location from "expo-location";
import { WorkoutLocation } from "../types";

interface LocationState {
  location: WorkoutLocation | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    address: null,
    isLoading: false,
    error: null,
    permissionGranted: null,
  });

  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === "granted";
    setState((prev) => ({ ...prev, permissionGranted: granted }));
    return granted;
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        permissionGranted: false,
        error: "Permissão de localização negada.",
      }));
      return null;
    }

    try {
      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = result.coords;

      // Geocodificação reversa para obter o endereço
      const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });

      const address = geo
        ? `${geo.street ?? ""} ${geo.streetNumber ?? ""}, ${geo.city ?? ""} - ${geo.region ?? ""}`
        : undefined;

      const location: WorkoutLocation = {
        latitude,
        longitude,
        address: address?.trim() || undefined,
      };

      setState((prev) => ({
        ...prev,
        location,
        address: address?.trim() || null,
        isLoading: false,
        permissionGranted: true,
      }));

      return location;
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Não foi possível obter a localização.",
      }));
      return null;
    }
  }, []);

  const clearLocation = useCallback(() => {
    setState((prev) => ({ ...prev, location: null, address: null }));
  }, []);

  return {
    ...state,
    requestPermission,
    getCurrentLocation,
    clearLocation,
  };
}
