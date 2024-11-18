import React, {useEffect} from "react";
import {FlatList} from "react-native";
import {useRouter} from "expo-router";
import {useTheme} from "@shopify/restyle";
import {useTagsStore} from "@/widgets/tags-list/model/store/useTagsStore";
import {useSelectedTagStore} from "@/features/tag-selected";
import {TagCard} from "@/entities/tag";
import {Theme} from "@/shared/providers/Theme";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";

export const TagsList = () => {
  const {
    tags,
    isLoading,
    hasError,
    fetchTags,
  } = useTagsStore();

  const { setTag } = useSelectedTagStore();

  const theme = useTheme<Theme>();
  const router = useRouter();

  useEffect(() => {
    fetchTags();
  }, []);

  if (isLoading) {
    return (
      <FlatList
        overScrollMode={"never"}
        showsVerticalScrollIndicator={false}
        data={ Array(10) }
        renderItem={({ index }) => (
          <LoadingCard key={index} style={{ height: 150, flex: 1, borderRadius: 16 }}/>
        )}
        numColumns={2}
        style={{width: "100%"}}
        contentContainerStyle={{
          backgroundColor: theme.colors.bg_color,
          paddingHorizontal: theme.spacing.m,
          paddingVertical: theme.spacing.s,
          gap: 12
        }}
        columnWrapperStyle={{gap: 12}}
      />
    )
  }

  if (hasError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <ErrorCard />
      </Box>
    );
  }

  return (
    <FlatList
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      overScrollMode={"never"}
      data={ tags }
      renderItem={({ item }) => (
        <TagCard
          name={ item.name }
          description={ item.description }
          image={ item.image }
          onPress={ () => {
            setTag(item.name);
            router.replace("/feed") ;
          }}
        />
      )}
      keyExtractor={item => item.name}
      numColumns={2}
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg_color,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        width: "100%"
      }}
      contentContainerStyle={{
        flex: 1,
        backgroundColor: theme.colors.bg_color,
        gap: 12
      }}
      columnWrapperStyle={{
        gap: 12
      }}
    />
  )
}
