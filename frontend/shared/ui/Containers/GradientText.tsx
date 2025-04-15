import React from 'react';
import { TextProps, TextStyle } from 'react-native';
import { Svg, Defs, LinearGradient, Stop, Text as SvgText, TSpan } from 'react-native-svg';

type GradientTextProps = TextProps & {
  text: string;
  fontSize: number;
  textStyle?: TextStyle;
  colors?: string[];
  stops?: number[];
  gradientStart?: { x: number, y: number };
  gradientStop?: { x: number, y: number };
  id?: string;
  textAlign?: "left" | "center" | "right";
};

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  colors = ['#ff6a00', '#ee0979'],
  stops = [0, 1],
  fontSize,
  textStyle,
  gradientStart = { x: 0, y: 0 },
  gradientStop = { x: 0, y: 1 },
  id = Math.random().toString(),
  textAlign = "center",
}) => {
  const lines = text.split('\n');
  const lineHeight = fontSize * 1.2;

  return (
    <Svg width="100%" height={lineHeight * lines.length}>
      <Defs>
        <LinearGradient
          id={id}
          x1={`${gradientStart.x * 100}%`} y1={`${gradientStart.y * 100}%`}
          x2={`${gradientStop.x * 100}%`} y2={`${gradientStop.y * 100}%`}
        >
          {colors.map((color, index) => (
            <Stop
              key={index}
              offset={`${stops[index] * 100}%`}
              stopColor={color}
            />
          ))}
        </LinearGradient>
      </Defs>
      <SvgText
        fill={`url(#${id})`}
        fontSize={fontSize}
        fontFamily={textStyle?.fontFamily || 'Montserrat'}
        x={textAlign == "center" ? "50%" : "0%"}
        textAnchor={textAlign == "center" ? "middle" : "start"}
      >
        {lines.map((line, index) => (
          <TSpan
            key={index}
            x={textAlign == "center" ? "50%" : "0%"}
            dy={index === 0 ? fontSize : lineHeight}
          >
            {line}
          </TSpan>
        ))}
      </SvgText>
    </Svg>
  );
};
