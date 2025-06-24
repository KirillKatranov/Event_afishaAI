import React from "react";
import {createTheme, ThemeProvider} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme/model/theme.type";
import {Colors, BorderRadii, Spacing, Text} from "@/shared/constants";
import {baseTheme} from "@/shared/constants/theme/Colors";

export const DynamicThemeProvider:  React.FC<{ children: React.ReactNode }> = (
  { children }
) => {
  const theme: Theme = createTheme({
    colors: {
      bg_color: baseTheme.bg_color,
      secondary_bg_color: baseTheme.secondary_bg_color,
      section_bg_color: baseTheme.section_bg_color,
      section_separator_color: baseTheme.section_separator_color,
      header_bg_color: baseTheme.header_bg_color,
      text_color: baseTheme.text_color,
      hint_color: baseTheme.hint_color,
      link_color: baseTheme.link_color,
      button_color: baseTheme.button_color,
      button_text_color: baseTheme.button_text_color,
      accent_text_color: baseTheme.accent_text_color,
      section_header_text_color: baseTheme.section_header_text_color,
      subtitle_text_color: baseTheme.subtitle_text_color,
      destructive_text_color: baseTheme.destructive_text_color,
      bottom_bar_bg_color: baseTheme.bottom_bar_bg_color,
      ...Colors
    },
    spacing: Spacing,
    borderRadii: BorderRadii,
    textVariants: Text,
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
