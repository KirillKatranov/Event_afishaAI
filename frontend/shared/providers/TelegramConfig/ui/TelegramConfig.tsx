import React, {createContext, useContext} from "react";
import {Platform} from "react-native";
import {baseTheme} from "@/shared/constants/theme/Colors";

export const MockConfig: TelegramWebapp = {
  backgroundColor: "",
  close(): void { console.log("MockConfig.close() call"); },
  expand(): void { console.log("MockConfig.expand() call"); },
  disableVerticalSwipes(): void { console.log("MockConfig.disableVerticalSwipes() call"); },
  openLink(url: string, options: { try_instant_view?: boolean } | undefined): void {
    console.log(`MockConfig.openLink() call with ${url} ${options}`);
  },
  openTelegramLink(url: string): void { console.log(`MockConfig.openTelegramLink() call with ${url}`); },
  headerColor: "",
  initData: "",
  platform: "",
  version: "",
  themeParams: {
    accent_text_color: "#168acd",
    bg_color: "#ffffff",
    bottom_bar_bg_color: "#ffffff",
    button_color: "#40a7e3",
    button_text_color: "#ffffff",
    destructive_text_color: "#d14e4e",
    header_bg_color: "#ffffff",
    hint_color: "#999999",
    link_color: "#168acd",
    secondary_bg_color: "#f1f1f1",
    section_bg_color: "#ffffff",
    section_header_text_color: "#168acd",
    section_separator_color: "#e7e7e7",
    subtitle_text_color: "#999999",
    text_color: "#000000",
  },
  onEvent: () => {},
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
  },
  setHeaderColor: (color) => console.log(color),
  setBottomBarColor: (color) => console.log(color),
  setBackgroundColor: (color) => console.log(color),
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

    if (!TelegramWebappConfig.initDataUnsafe.user.username) {
      TelegramWebappConfig.initDataUnsafe.user.username = TelegramWebappConfig.initDataUnsafe.user.id.toString()
    }

    TelegramWebappConfig.setHeaderColor(baseTheme.bg_color);
    TelegramWebappConfig.setBottomBarColor(baseTheme.bg_color);
    TelegramWebappConfig.setBackgroundColor(baseTheme.bg_color);

    console.log("Calling config functions");
    TelegramWebappConfig.expand();
    TelegramWebappConfig.disableVerticalSwipes();

    console.log("Start param:", TelegramWebappConfig.initDataUnsafe.start_param);
    console.log(TelegramWebappConfig)

    return TelegramWebappConfig;
  } else {
    return MockConfig;
  }
};

export const getStartParam = (): string => {
  if (Platform.OS !== "web") {
    return "";
  }

  // @ts-ignore
  if (typeof window !== undefined && window.Telegram?.WebApp?.initDataUnsafe) {
    // @ts-ignore

    const startParam =  window.Telegram.WebApp.initDataUnsafe.start_param;
    return startParam ? startParam : "";
  } else {
    return "";
  }
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = getTelegramConfig();

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => useContext(ConfigContext);
