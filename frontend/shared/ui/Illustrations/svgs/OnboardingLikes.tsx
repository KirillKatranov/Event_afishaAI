import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {IllustrationComponentProps} from "@/shared/ui/Illustrations/IllustrationComponentProps";

export const OnboardingLikes: React.FC<IllustrationComponentProps> = ({width = 140, height = 61}) => (

    <Svg
      width={width}
      height={height}
      viewBox="0 0 140 61"
      fill="none"
    >
      <Path
        d="M38.935 10.451l1.155 1.393 1.154-1.393c1.002-1.208 2.532-1.965 4.085-1.965 2.71 0 4.904 2.186 4.904 5.131 0 1.796-.77 3.54-2.406 5.614-1.655 2.096-4.049 4.35-7.076 7.193l-.002.002-.66.621-.659-.621-.002-.002c-3.027-2.842-5.42-5.097-7.075-7.193-1.637-2.074-2.407-3.818-2.407-5.614 0-2.945 2.193-5.13 4.904-5.13 1.553 0 3.083.756 4.085 1.964zM109.957 14.01l1.159 1.41 1.159-1.41c2.78-3.384 7.032-5.524 11.416-5.524 7.719 0 13.869 6.303 13.869 14.554 0 5.03-2.159 9.713-6.231 14.917-4.09 5.227-9.969 10.805-17.193 17.647l-.002.002-3.018 2.87-3.018-2.87-.002-.002c-7.225-6.842-13.103-12.42-17.193-17.647-4.072-5.204-6.231-9.888-6.231-14.917 0-8.251 6.15-14.554 13.87-14.554 4.383 0 8.635 2.14 11.415 5.524z"
        fill="#fff"
        stroke="#000"
        strokeWidth={3}
      />
    </Svg>
);
