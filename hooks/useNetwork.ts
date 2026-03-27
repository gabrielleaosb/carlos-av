import { useState, useEffect } from "react";
import * as Network from "expo-network";
import { NetworkInfo } from "../types";

export function useNetwork() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isConnected: null,
    isWifi: false,
    ssid: null,
    ipAddress: null,
    type: "unknown",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchNetworkInfo = async () => {
    setIsLoading(true);
    try {
      const [state, ip] = await Promise.all([
        Network.getNetworkStateAsync(),
        Network.getIpAddressAsync().catch(() => null),
      ]);

      setNetworkInfo({
        isConnected: state.isConnected ?? false,
        isWifi: state.type === Network.NetworkStateType.WIFI,
        ssid: null, // expo-network não expõe SSID sem permissão especial
        ipAddress: ip,
        type: state.type ?? "UNKNOWN",
      });
    } catch {
      setNetworkInfo({
        isConnected: false,
        isWifi: false,
        ssid: null,
        ipAddress: null,
        type: "UNKNOWN",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  return { networkInfo, isLoading, refresh: fetchNetworkInfo };
}
