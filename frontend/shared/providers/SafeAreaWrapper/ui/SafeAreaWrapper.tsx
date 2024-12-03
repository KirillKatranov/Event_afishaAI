import React, { createContext, useContext } from "react";
import { SafeAreaProvider, useSafeAreaInsets as useNativeSafeAreaInsets } from "react-native-safe-area-context";
import { useConfig } from "@/shared/providers/TelegramConfig";

type Insets = { top: number; bottom: number; left: number; right: number };

const SafeAreaContext = createContext<Insets>({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const SafeAreaWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useConfig();
  const nativeInsets = useNativeSafeAreaInsets();

  const insets = config.safeAreaInset
    ? {
      top: config.safeAreaInset.top || nativeInsets.top,
      bottom: config.safeAreaInset.bottom || nativeInsets.bottom,
      left: config.safeAreaInset.left || nativeInsets.left,
      right: config.safeAreaInset.right || nativeInsets.right,
    }
    : nativeInsets;

  console.log("Applied safe area insets", insets);

  return (
    <SafeAreaProvider>
      <SafeAreaContext.Provider value={insets}>{children}</SafeAreaContext.Provider>
    </SafeAreaProvider>
  );
};

export const useSafeAreaInsets = (): Insets => {
  return useContext(SafeAreaContext);
};
