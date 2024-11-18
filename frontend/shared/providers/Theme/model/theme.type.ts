import {Spacing, BorderRadii, Text, Colors} from "@/shared/constants";

export type Theme = {
  colors: TelegramTheme & typeof Colors;
  spacing: typeof Spacing;
  borderRadii: typeof BorderRadii
  textVariants: typeof Text;
};
