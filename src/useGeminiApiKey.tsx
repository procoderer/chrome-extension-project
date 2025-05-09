import { useState, useEffect, useCallback } from "react";

/** Persisted in chrome.storage.local so the key follows the user to other Chrome profiles. */
export default function useGeminiApiKey() {
  const [apiKey, setApiKey] = useState<string>("");

  /* Load once */
  useEffect(() => {
    chrome.storage.local.get("geminiApiKey", ({ geminiApiKey }) => {
      if (geminiApiKey) setApiKey(geminiApiKey);
    });
  }, []);

  /* Save wrapper */
  const saveKey = useCallback((k: string) => {
    setApiKey(k);
    chrome.storage.local.set({ geminiApiKey: k });
  }, []);

  return { apiKey, saveKey };
}
