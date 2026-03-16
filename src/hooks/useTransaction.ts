import { useState, useCallback } from "react";
import { sendXLM } from "@/lib/stellar";

interface TxResult {
  hash: string;
  success: boolean;
  timestamp: string;
}

interface TxError {
  message: string;
}

export function useTransaction() {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<TxResult | null>(null);
  const [error, setError] = useState<TxError | null>(null);

  const send = useCallback(
    async (
      fromPublicKey: string,
      toAddress: string,
      amount: string,
      memo?: string
    ) => {
      setIsSending(true);
      setResult(null);
      setError(null);

      try {
        const res = await sendXLM(fromPublicKey, toAddress, amount, memo);
        setResult({
          hash: res.hash,
          success: true,
          timestamp: new Date().toISOString(),
        });
        return res;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Transaction failed";
        setError({ message: msg });
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { isSending, result, error, send, reset };
}
