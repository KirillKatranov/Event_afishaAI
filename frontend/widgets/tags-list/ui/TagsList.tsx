import React, {useEffect} from "react";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
import {useTagsStore} from "@/widgets/tags-list/model/store/useTagsStore";
import {useSelectedTagStore} from "@/features/tag-selected";
import {TagCard} from "@/entities/tag";
import {Theme} from "@/shared/providers/Theme";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";
import Animated, {useSharedValue} from "react-native-reanimated";

export const TagsList = () => {
  const { tags, isLoading, hasError, fetchTags } = useTagsStore();
  const { setTag } = useSelectedTagStore();
  const theme = useTheme<Theme>();
  const router = useRouter();

  const scrollY = useSharedValue(0);

  useEffect(() => {
    fetchTags();
  }, []);

  if (isLoading) {
    return (
      <Animated.FlatList
        overScrollMode={"never"}
        showsVerticalScrollIndicator={false}
        data={Array(10)}
        renderItem={({ index }) => (
          <LoadingCard
            key={index}
            style={{ height: 186, width: "100%", marginBottom: -62, borderRadius: 40 }}
            index={index}
          />
        )}
        style={{
          width: "100%",
          paddingHorizontal: 10,
        }}
        contentContainerStyle={{
          backgroundColor: theme.colors.bg_color,
          gap: 12,
        }}
      />
    );
  }

  if (hasError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <ErrorCard />
      </Box>
    );
  }

  return (
    <Animated.FlatList
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      overScrollMode={"never"}
      data={tags}
      renderItem={({item, index}) => (
        <TagCard
          index={index}
          tag={item}
          onPress={() => {
            setTag(item.name);
            router.replace("/feed");
          }}
          scrollY={scrollY}
        />
      )}
      keyExtractor={(item) => item.name}
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg_color,
        paddingHorizontal: 10,
        paddingBottom: 62,
        width: "100%",
      }}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: theme.colors.bg_color,
        gap: 0,
      }}
      // Track scroll position
      onScroll={(event) => {
        scrollY.value = event.nativeEvent.contentOffset.y;
        console.log(scrollY.value);
      }}
    />
  );
};
