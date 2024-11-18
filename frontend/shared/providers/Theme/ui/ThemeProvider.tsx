import React from "react";
import {createTheme, ThemeProvider} from "@shopify/restyle";
import {useConfig} from "@/shared/providers/TelegramConfig/ui/TelegramConfig";
import {Theme} from "@/shared/providers/Theme/model/theme.type";
import {Colors, BorderRadii, Spacing, Text} from "@/shared/constants";

export const DynamicThemeProvider:  React.FC<{ children: React.ReactNode }> = (
  { children }
) => {
  const config = useConfig();

  const theme: Theme = createTheme({
    colors: {
      bg_color: config.themeParams.bg_color,
      secondary_bg_color: config.themeParams.secondary_bg_color,
      section_bg_color: config.themeParams.section_bg_color,
      section_separator_color: config.themeParams.section_separator_color,
      header_bg_color: config.themeParams.header_bg_color,
      text_color: config.themeParams.text_color,
      hint_color: config.themeParams.hint_color,
      link_color: config.themeParams.link_color,
      button_color: config.themeParams.button_color,
      button_text_color: config.themeParams.button_text_color,
      accent_text_color: config.themeParams.accent_text_color,
      section_header_text_color: config.themeParams.section_header_text_color,
      subtitle_text_color: config.themeParams.subtitle_text_color,
      destructive_text_color: config.themeParams.destructive_text_color,
      ...Colors
    },
    spacing: Spacing,
    borderRadii: BorderRadii,
    textVariants: Text,
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
