import React, {memo, useCallback, useEffect, useState} from "react";
import {Image, ImageBackground, Platform, Pressable} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useTheme} from "@shopify/restyle";
import {Hyperlink} from "react-native-hyperlink";
import {useEventCardStore} from "@/entities/event/model/store/useEventCardStore";
import {Event} from "@/entities/event/model/types/events";
import {Box} from "@/shared/ui/Base/Box";
import {Text} from "@/shared/ui/Base/Text";
import {formatDate} from "@/shared/scripts/date";
import {Theme} from "@/shared/providers/Theme";
import Icon from "@/shared/ui/Icons/Icon";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {ActionButton, TagChip} from "@/shared/ui";
import {Gesture, GestureDetector, GestureHandlerRootView, ScrollView} from "react-native-gesture-handler";
import { WEB_APP_URL } from '@env';

const DraggableScrollView = Platform.select({
  web: () => require('@/shared/providers/DraggableScroll').DraggableScrollView,
  default: () => ScrollView,
})();

interface EventCardProps {
  event: Event;
  onLike: () => void;
  onDislike: () => void;
}

export const EventCard: React.FC<EventCardProps> = memo(({ event, onLike, onDislike }) => {
  const theme = useTheme<Theme>();
  const config = useConfig();
  const heightValue = useSharedValue(0);

  const [cardHeight, setCardHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);

  const [tagsScrolling, setTagsScrolling] = useState(false);
  const [descriptionScrolling, setDescriptionScrolling] = useState(false);
  const [descriptionScrollOnTop, setDescriptionScrollOnTop] = useState(true);
  const [descriptionSwiping, setDescriptionSwiping] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const { setSwipeEnabled } = useEventCardStore();

  useEffect(() => {
    heightValue.value = withTiming(
      descriptionExpanded ? (cardHeight - titleHeight) : 0,
      { duration: 250 },
    );
  }, [descriptionExpanded, cardHeight]);

  useEffect(() => {
    if (descriptionExpanded || descriptionSwiping || tagsScrolling) {
      setSwipeEnabled(false)
    } else {
      setSwipeEnabled(true)
    }
  }, [descriptionExpanded, descriptionSwiping, tagsScrolling]);

  const animatedInfoStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  const handlePanGestureUpdate = useCallback((event: { translationY: number }) => {
    heightValue.value = Math.max(
      0,
      Math.min(
        (cardHeight - titleHeight),
        descriptionExpanded
          ? (cardHeight - titleHeight) - event.translationY
          : 0 - event.translationY
      )
    );
  }, [cardHeight, descriptionExpanded, heightValue]);

  const handlePanGestureEnd = useCallback(
    (event: { translationY: number }) => {
      const threshold = 75;
      const isClosing = descriptionExpanded && event.translationY > threshold;
      const isOpening = !descriptionExpanded && event.translationY < -threshold;

      if (isOpening) {
        setDescriptionExpanded(true);
      } else if (isClosing) {
        setDescriptionExpanded(false);
      } else {
        heightValue.value = withTiming(
          descriptionExpanded ? (cardHeight - titleHeight) : 0,
          { duration: 250 }
        );
      }
    },
    [cardHeight, descriptionExpanded, heightValue ]
  );

  const panGesture = Gesture.Pan().runOnJS(true)
    .enabled(!tagsScrolling && (!descriptionScrolling || descriptionScrollOnTop))
    .onBegin(() => setDescriptionSwiping(true))
    .onUpdate(handlePanGestureUpdate)
    .onEnd(handlePanGestureEnd)
    .onFinalize(() => setDescriptionSwiping(false));

  const renderTags = useCallback(
    () =>
      event.tags!.map((tag) => <TagChip key={tag.name} text={tag.name} />),
    [event.tags]
  );

  return (
    <GestureHandlerRootView>
      <ImageBackground
        source={{ uri: event.image || undefined }}
        resizeMode="cover"
        blurRadius={25}
        style={{
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: theme.colors.secondary_bg_color,
        }}
      >
        <Image
          source={{ uri: event.image || undefined }}
          resizeMode="contain"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />

        {/* Buttons area */}
        <Box
          flexDirection={"row"}
          height={16 + 40 + 16}
          gap={"m"}
          padding={"m"}
          justifyContent={"flex-end"}
        >
          <Pressable
            onPress={ () => {
              const link = `${WEB_APP_URL}?startapp=${event.id}`;
              const encodedMessage = encodeURIComponent(`Привет! Посмотри это мероприятие`);

              console.log("Sharing event with link:", link);

              config.openTelegramLink(`https://t.me/share/url?text=${encodedMessage}&url=${link}`);
            }}
          >
            <Box
              backgroundColor={"cardBGColor"}
              height={40}
              width={40}
              alignItems={"center"}
              justifyContent={"center"}
              borderRadius={"xl"}
            >
              <Icon
                name={"share"}
                color={theme.colors.white}
                size={24}
              />
            </Box>
          </Pressable>
        </Box>

        <Box
          flex={1}
          justifyContent="flex-end"
          onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
        >
          <GestureDetector gesture={panGesture}>
            <Box>
              <Box
                backgroundColor={"cardBGColor"}
                borderTopRightRadius={"xl"} borderTopLeftRadius={"xl"}
                gap={"s"}
                paddingHorizontal={"eventCardPadding"} paddingVertical={"m"}
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout;
                  setTitleHeight(height);
                }}
              >
                <Box
                  height={4} width={100}
                  borderRadius="xl"
                  backgroundColor="gray"
                  alignSelf="center"
                />

                {/* Event Title */}
                <Text
                  variant={"cardHeader"}
                  color={"cardMainTextColor"}
                  textAlign={"center"}
                >
                  { event.name }
                </Text>

                {/* Event Categories */}
                {
                  event.tags && event.tags.length > 0 && (
                    <DraggableScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      scrollEnabled={true}
                      onTouchStart={() => setTagsScrolling(true)}
                      onTouchEnd={() => setTagsScrolling(false)}
                      contentContainerStyle={{ gap: 4, flexGrow: 1, justifyContent: "center", alignItems: "center" }}
                    >
                      {renderTags()}
                    </DraggableScrollView>
                  )
                }
              </Box>

              <Animated.View style={[
                animatedInfoStyle,
                { backgroundColor: theme.colors.cardBGColor, gap: theme.spacing.m }]}
              >
                {/* Location */}
                <Box flexDirection="column" gap="s" paddingHorizontal="eventCardPadding">
                  {
                    event.location && (
                      <Box flexDirection="row" gap="xs" alignItems="center">
                        <Icon name="location" color={theme.colors.white} size={16} />

                        <Text variant="cardSubInfo" color="cardMainTextColor">
                          {event.location}
                        </Text>
                      </Box>
                    )
                  }

                  {/* Cost */}
                  {
                    event.cost && (
                      <Box flexDirection="row" gap="xs" alignItems="center">
                        <Icon name="cost" color={theme.colors.gray} size={16} />

                        <Text variant="cardSubInfo" color="cardMainTextColor">
                          { `${event.cost} руб.`}
                        </Text>
                      </Box>
                    )
                  }

                  {/* Date */}
                  {
                    event.date && (
                      <Box flexDirection="row" gap="xs" alignItems="center">
                        <Icon name="calendar" color={theme.colors.gray} size={16} />

                        <Text variant={"cardSubInfo"} color={"cardMainTextColor"}>
                          {formatDate(event.date)}
                        </Text>

                        {
                          event.time && (
                            <Text variant={"cardSubInfo"} color={"cardMainTextColor"}>
                              {`В ${event.time}`}
                            </Text>
                          )
                        }
                      </Box>
                    )
                  }
                </Box>

                {(event.description || event.contact) && (
                  <Box
                    flex={1}
                    overflow="hidden"
                    marginHorizontal="l"
                    borderRadius="l"
                    padding={"m"}
                    style={{ backgroundColor: "#ECEBE8" }}
                  >
                    <ScrollView
                      onScroll={(e) =>
                        setDescriptionScrollOnTop(e.nativeEvent.contentOffset.y === 0)
                      }
                      onTouchStart={() => setDescriptionScrolling(true)}
                      onTouchEnd={() => setDescriptionScrolling(false)}
                      overScrollMode="never"
                      style={{ flex: 1 }}
                      contentContainerStyle={{ gap: 10 }}
                    >
                      <Text
                        variant={"cardSubheader"}
                        color={"cardDescriptionTextColor"}
                      >
                        {"О МЕРОПРИЯТИИ"}
                      </Text>

                      {
                        event.description && (
                          <Text
                            variant={"cardText"}
                            color={"cardDescriptionTextColor"}
                          >
                            {event.description}
                          </Text>
                        )
                      }

                      {
                        event.contact && event.contact.length > 0 && (
                          <Box
                            gap={"s"}
                          >
                            <Text
                              variant={"cardText"}
                              color={"cardDescriptionTextColor"}
                            >
                              { "Ссылки:" }
                            </Text>

                            {event.contact.map((con, index) => {
                              return (
                                <Hyperlink
                                  key={index}
                                  linkDefault={true}
                                  linkStyle={{ color: theme.colors.link_color }}
                                  onPress={ () => config.openLink(Object.values(con)[0], { try_instant_view: true }) }
                                  linkText={(url) => {
                                    const contact = event.contact!.find((c) => Object.values(c)[0] === url);
                                    return contact ? Object.keys(contact)[0] : url;
                                  }}
                                >
                                  <Text
                                    variant={"cardText"}
                                  >
                                    {Object.values(con)[0]}
                                  </Text>
                                </Hyperlink>
                              );
                            })}
                          </Box>
                        )
                      }
                    </ScrollView>
                  </Box>
                )}

                <Box
                  flexDirection="row"
                  width="100%"
                  paddingBottom="l" paddingHorizontal="l"
                  gap="s"
                >
                  <ActionButton type="dislike" onPress={onDislike} />
                  <ActionButton type="like" onPress={onLike} />
                </Box>
              </Animated.View>
            </Box>
          </GestureDetector>
        </Box>
      </ImageBackground>
    </GestureHandlerRootView>
  );
});

