import React from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useTagsStore} from "@/widgets/tags-list/model/store/useTagsStore";
import {TagCard} from "@/entities/tag";
import {Box, Text, ErrorCard, LoadingCard} from "@/shared/ui";
import Animated, {LinearTransition, SharedValue} from "react-native-reanimated";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import Illustration from "@/shared/ui/Illustrations/Illustration";

interface TagsListProps {
  scrollY: SharedValue<number>
}

export const TagsList: React.FC<TagsListProps> = ({
  scrollY
}) => {
  const { service } = useLocalSearchParams<{ service: "events" | "places" | "organizers" | "trips" }>();
  const { tags, preferences, isLoading, hasError, onTagLike } = useTagsStore();
  const router = useRouter();
  const username = useConfig().initDataUnsafe.user.username;
  const theme = useTheme<Theme>();

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

  if (!isLoading && tags.length === 0) {
    return (
      <Box
        flex={1} alignItems={"center"} justifyContent={"center"}
        style={{ gap: 32, paddingHorizontal: 10,  paddingBottom: 62 }}
      >
        <Text variant="body" color="text_color">
          В этом сервисе отсутвуют категории
        </Text>

        <Illustration name={"sadArrow"}/>
      </Box>
    )
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
              onPress={(event) => {
                event.preventDefault();
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
