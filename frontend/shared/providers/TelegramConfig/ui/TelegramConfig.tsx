import React, { createContext, useContext } from "react";
import { Platform } from "react-native";

export const MockConfig: TelegramWebapp = {
  backgroundColor: "",
  close(): void { console.log("MockConfig.close() call"); },
  expand(): void { console.log("MockConfig.expand() call"); },
  disableVerticalSwipes(): void { console.log("MockConfig.disableVerticalSwipes() call"); },
  openLink(url: string, options: { try_instant_view?: boolean } | undefined): void {
    console.log(`MockConfig.openLink() call with ${url} ${options}`);
  },
  headerColor: "",
  initData: "",
  platform: "",
  version: "",
  themeParams: {
    bg_color: "#292929",
    secondary_bg_color: "#1f1f1f",
    section_bg_color: "#000",
    section_separator_color: "#8b8b8b",
    header_bg_color: "#2c2c2c",
    text_color: "#fff",
    hint_color: "#949494",
    link_color: "",
    button_color: "#358ffe",
    button_text_color: "",
    accent_text_color: "#0f75f1",
    section_header_text_color: "",
    subtitle_text_color: "",
    destructive_text_color: "",
  },
  initDataUnsafe: {
    user: {
      username: "mock_user",
      is_premium: false,
      photo_url: "mock_user",
      first_name: "mock_user",
      last_name: "mock_user",
      id: 0,
      is_bot: false
    },
  }
};

export const ConfigContext = createContext<TelegramWebapp>(MockConfig);

const getTelegramConfig = (): TelegramWebapp => {
  if (Platform.OS !== "web") {
    return MockConfig;
  }

  // @ts-ignore
  if (typeof window !== undefined && window.Telegram.WebApp.initDataUnsafe.user) {
    // @ts-ignore
    const TelegramWebappConfig: TelegramWebapp = window.Telegram.WebApp;

    console.log("Calling config functions");
    TelegramWebappConfig.expand();
    TelegramWebappConfig.disableVerticalSwipes();

    return TelegramWebappConfig;
  } else {
    return MockConfig;
  }
};


export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = getTelegramConfig();

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => useContext(ConfigContext);
