import React from "react";
import { Box} from "@/shared/ui";
import { TagsHeader } from "@/pages/tags/ui/TagsHeader";
import { TagsList } from "@/widgets/tags-list";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

export const TagsPage = () => {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, 100],
      'clamp'
    );

    return {
      transform: [{ translateY: translateY }],
    };
  });

  return (
    <Box flex={1} backgroundColor="bg_color">
      <Animated.FlatList
        onScroll={onScroll}
        overScrollMode={"never"}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View style={headerStyle}>
            <TagsHeader />
          </Animated.View>
        }
        renderItem={(_props) => <TagsList />}
        data={Array(1)}
      />
    </Box>
  );
};
