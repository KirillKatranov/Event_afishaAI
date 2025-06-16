export const THEME_COLORS = {
  events: {
    normal: "#FF47FF",
    pressed: "#ef43ef",
    text: "#FFFFFF",
  },
  places: {
    normal: "#E1F44B",
    pressed: "#d6e848",
    text: "#000000",
  },
  organizers: {
    normal: "#6361DD",
    pressed: "#5d5bcf",
    text: "#FFFFFF",
  },
  trips: {
    normal: "#930CFF",
    pressed: "#860aea",
    text: "#FFFFFF",
  },
};

export type ThemeType = keyof typeof THEME_COLORS;
