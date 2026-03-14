import { useState, useCallback, useEffect, useRef } from "react";
import { fetchBalance } from "@/lib/stellar";

interface WalletState {
  publicKey: string | null;
  balance: string | null;
  isConnecting: boolean;
  isLoadingBalance: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    publicKey: null,
    balance: null,
    isConnecting: false,
    isLoadingBalance: false,
    error: null,
  });

  // Ref to avoid stale closure in refreshBalance
  const publicKeyRef = useRef<string | null>(null);
  publicKeyRef.current = state.publicKey;

  const refreshBalance = useCallback(async (pk?: string) => {
    const key = pk ?? publicKeyRef.current;
    if (!key) return;

    setState((s) => ({ ...s, isLoadingBalance: true }));
    try {
      const bal = await fetchBalance(key);
      setState((s) => ({ ...s, balance: bal, isLoadingBalance: false }));
    } catch {
      setState((s) => ({ ...s, balance: "Error", isLoadingBalance: false }));
    }
  }, []);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      // Freighter v1.7 API
      const freighter = await import("@stellar/freighter-api");

      const connected = await freighter.isConnected();
      if (!connected) {
        throw new Error(
          "Freighter not found. Install the Freighter browser extension from freighter.app"
        );
      }

      // Request permission / get address
      const address = await freighter.getPublicKey();

      if (!address || typeof address !== "string") {
        throw new Error("Could not get wallet address. Check Freighter is unlocked.");
      }

      setState((s) => ({
        ...s,
        publicKey: address,
        isConnecting: false,
      }));

      await refreshBalance(address);
    } catch (err: unknown) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to connect wallet",
      }));
    }
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    setState({
      publicKey: null,
      balance: null,
      isConnecting: false,
      isLoadingBalance: false,
      error: null,
    });
  }, []);

  // Auto-refresh balance every 15s
  useEffect(() => {
    if (!state.publicKey) return;
    const interval = setInterval(() => refreshBalance(), 15000);
    return () => clearInterval(interval);
  }, [state.publicKey, refreshBalance]);

  return {
    ...state,
    connect,
    disconnect,
    refreshBalance: () => refreshBalance(),
  };
}
