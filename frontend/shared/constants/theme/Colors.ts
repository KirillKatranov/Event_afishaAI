export const Colors = {
  cardBGColor: "rgba(30,30,30,0.7)",
  cardMainTextColor: "#FFFFFF",
  cardSubtextColor: "#D8DFE9",
  cardDescriptionTextColor: "#393939",
  lime: "#E1F44B",
  black: "#393939",
  totalBlack: "#000000",
  gray: "#ECEBE8",
  toxicBlue: "#5352EB",
  blue: "#6361DD",
  lightblue: "#B4C9FE",
  white: "#FFFFFF",
  transparent: "transparent",
  red: "#F44B4B",
  calendarDisabledDay: "#DADADA",
  calendarTodayDay: "#D8DFE9",
  calendarStartingEndingDay: "#6361DD",
  calendarSelectedDay: "#B4C9FE",
  calendarAcceptButton: "#E1F44B",
  calendarAcceptButtonDisabled: "#e1f4aa",
  events: "#FF47FF",
  places: "#E1F44B",
  organizers: "#6361DD",
  trips: "#930CFF",
}

export const getTint = (color: string): "default" | "dark" => {
  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map((char) => char + char).join("");
    }
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const getLuminance = (r: number, g: number, b: number) => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  let r, g, b;

  if (color.startsWith("#")) {
    [r, g, b] = hexToRgb(color);
  } else if (color.startsWith("rgb")) {
    [r, g, b] = color.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
  } else {
    throw new Error("Invalid color format");
  }

  const luminance = getLuminance(r, g, b);
  return luminance > 128 ? "default" : "dark";
};
