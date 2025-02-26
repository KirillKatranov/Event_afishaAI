import React, {useEffect} from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useTagsStore} from "@/widgets/tags-list/model/store/useTagsStore";
import {TagCard} from "@/entities/tag";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";
import Animated, {LinearTransition, SharedValue} from "react-native-reanimated";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";

interface TagsListProps {
  scrollY: SharedValue<number>
}

export const TagsList: React.FC<TagsListProps> = ({
  scrollY
}) => {
  const { service } = useLocalSearchParams<{ service: "events" | "places" | "organizers" | "trips" }>()
  const { tags, preferences, isLoading, hasError, fetchTags, onTagLike } = useTagsStore();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const theme = useTheme<Theme>()

  useEffect(() => {
    fetchTags({ username: username, macro_category: service });
  }, []);

  if (isLoading) {
    return (
      <Animated.FlatList
        scrollEnabled={false}
        overScrollMode={"never"}
        showsVerticalScrollIndicator={false}
        data={Array(10)}
        renderItem={({ index }) => (
          <LoadingCard
            key={index}
            style={{ height: 186, width: "100%", marginBottom: -62, borderRadius: 40 }}
            loadingColors={[theme.colors.bg_color, theme.colors.secondary_bg_color]}
            index={index}
          />
        )}
        style={{width: "100%", paddingHorizontal: 10,}}
        contentContainerStyle={{gap: 12,}}
      />
    );
  }

  if (hasError) {
    return (
      <Box flex={1}>
        <ErrorCard style={{ backgroundColor: "transparent" }}/>
      </Box>
    );
  }

  return (
    <Box
      flex={1}
      style={{
        paddingHorizontal: 10,
        paddingBottom: 62,
      }}
    >
      {
        tags.map((item, index) => (
          <Animated.View
            key={item.id}
            layout={LinearTransition.duration(200)}
          >
            <TagCard
              key={item.id}
              service={service}
              index={index}
              liked={preferences.includes(item.id)}
              tag={item}
              onPress={() => {
                router.push({
                  pathname: "/tags/[service]/[tag]",
                  params: { service: service, tag: item.name }
                });
              }}
              onLike={ () => onTagLike({ username: username, tag_id: item.id })}
              scrollY={scrollY}
            />
          </Animated.View>
        ))
      }
    </Box>
  );
};
