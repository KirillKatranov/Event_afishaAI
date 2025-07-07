import {NumberProp} from "react-native-svg";
import {ColorValue} from "react-native";

export type GradientProps = {
    id: string;
    startColor: string;
    endColor: string;
    start?: {x: number; y: number};
    end?: {x: number; y: number};
};

export interface IconComponentProps {
    width: NumberProp;
    height: NumberProp;
    fill: ColorValue | GradientProps;
}
