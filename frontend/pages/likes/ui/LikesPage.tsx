import React from "react";
import { DislikesList, LikesList } from "@/widgets/liked-events-list";
import { TabView } from "react-native-tab-view";
import {Image, Pressable, useWindowDimensions} from "react-native";
import {Box} from "@/shared/ui";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/shared/providers/Theme";
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useConfig} from "@/shared/providers/TelegramConfig";

export const LikesPage = React.memo(() => {
  const theme = useTheme<Theme>();
  const layout = useWindowDimensions();
  const platform = useConfig().platform;
  const [index, setIndex] = React.useState(0);

  const routes = React.useMemo(
    () => [
      { key: 'likes', title: 'Понравилось' },
      { key: 'dislikes', title: 'Не понравилось' },
    ],
    []
  );

  const renderScene = (scene: any) => {
    switch (scene.route.key) {
      case 'likes':
        return <LikesList />;
      case 'dislikes':
        return <DislikesList/>;
      default:
        return null;
    }
  }

  // Shared Value for controlling animations
  const animationValue = useSharedValue(index);

  const indicatorTranslateX = useAnimatedStyle(() => {
    const translateX = interpolate(animationValue.value, [0, 1], [0, (layout.width - 80 + 20) / 2]);
    return {
      transform: [{ translateX }],
    };
  });

  const likesOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(animationValue.value, [0, 1], [1, 0.3]);
    return { opacity };
  });

  const dislikesOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(animationValue.value, [0, 1], [0.3, 1]);
    return { opacity };
  });

  const onIndexChange = (newIndex: number) => {
    animationValue.value = withTiming(newIndex, { duration: 300 });
    setIndex(newIndex);
  };

  return (
    <Box
      flex={1}
      backgroundColor={"bg_color"}
      style={{
        paddingTop: 70,
      }}
    >
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: 120,
          top: -15,
          opacity: 0.75,
          alignSelf: "center"
        }}
      />

      <Box
        flexDirection="row"
        height={44}
        alignItems={"center"}
        style={{ paddingHorizontal: 40, gap: 20 }}
      >
        <Pressable
          onPress={() => onIndexChange(0)}
          style={{flex: 1, height: 44, alignItems: "center", justifyContent: "center"}}
        >
          <Animated.Text
            selectable={false}
            style={[{color: theme.colors.text_color, ...theme.textVariants.reactionsPages, textAlign: "center" }, likesOpacity]}
          >
            { "Избранное" }
          </Animated.Text>
        </Pressable>

        <Pressable
          onPress={() => onIndexChange(1)}
          style={{flex: 1, height: 44, alignItems: "center", justifyContent: "center"}}
        >
          <Animated.Text
            selectable={false}
            style={[{color: theme.colors.text_color, ...theme.textVariants.reactionsPages, textAlign: "center" }, dislikesOpacity]}
          >
            { "Не понравились" }
          </Animated.Text>
        </Pressable>

        {/* Animated Indicator */}
        <Animated.View
          style={[
            {
              position: "absolute", bottom: 0,
              height: 4, width: (layout.width - 80 - 20) / 2,
              borderRadius: 10,
              backgroundColor: "#BA25F7",
            },
            indicatorTranslateX,
          ]}
        />
      </Box>

      <TabView
        commonOptions={{
          labelStyle: theme.textVariants.body,
        }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={() => null}
        onIndexChange={() => null}
        initialLayout={{ width: layout.width }}
        onSwipeEnd={() => onIndexChange((index + 1) % 2)}
        swipeEnabled={ platform != "tdesktop" }
      />
    </Box>
  );
});
