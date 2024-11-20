import React, {useEffect, useState} from "react";
import {Image, ImageBackground, Platform, Pressable} from "react-native";
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from "react-native-reanimated";
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

const DraggableScrollView = Platform.select({
  web: () => require('@/shared/providers/DraggableScroll').DraggableScrollView,
  default: () => ScrollView,
})();

interface EventCardProps {
  event: Event;
  tag?: string | undefined;
  onBackPressed?: () => void;
  onLike: () => void;
  onDislike: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onLike,
  tag,
  onBackPressed = () => console.log("Back Pressed"),
  onDislike
}) => {
  const theme = useTheme<Theme>();
  const config = useConfig();

  const heightValue = useSharedValue(125);

  const [cardHeight, setCardHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(200);

  const {
    descriptionScrolling, setDescriptionScrolling,
    descriptionScrollOnTop, setDescriptionScrollOnTop,
    descriptionSwiping, setDescriptionSwiping,
    descriptionExpanded, setDescriptionExpanded,
  } = useEventCardStore();

  useEffect(() => {
    heightValue.value = withTiming(
      descriptionExpanded ? (cardHeight - 36 - 16 - 10) : titleHeight,
      { duration: 300 },
    );
  }, [descriptionExpanded, titleHeight, cardHeight]);

  const animatedInfoStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  const panGesture = Gesture.Pan().runOnJS(true)
    .enabled((!descriptionScrolling || descriptionScrollOnTop))
    .onBegin(() => {
      setDescriptionSwiping(true);
    })
    .onUpdate((event) => {
      heightValue.value = Math.max(
        titleHeight,
        Math.min(cardHeight - 36 - 16 - 10,
          descriptionExpanded
            ? cardHeight - 36 - 16 - 10 - event.translationY
            : titleHeight - event.translationY
        )
      );
    })
    .onEnd((event) => {
      const threshold = 75;
      const isClosing = descriptionExpanded && event.translationY > threshold;
      const isOpening = !descriptionExpanded && event.translationY < -threshold;

      if (isOpening) {
        setDescriptionExpanded(true);
      } else if (isClosing) {
        setDescriptionExpanded(false);
      } else {
        heightValue.value = withTiming(
          descriptionExpanded ? cardHeight - 36 - 16 - 10 : titleHeight,
          { duration: 300 }
        );
      }
    })
    .onFinalize(() => {
      setDescriptionSwiping(false);
    });

  return (
    <GestureHandlerRootView>
      <ImageBackground
        source={{ uri: event.image ? event.image : undefined }}
        resizeMode="cover"
        blurRadius={16}
        style={{
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: theme.colors.secondary_bg_color,
        }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setCardHeight(height);
        }}
      >
        {/* Full event image */}
        <Image
          source={{ uri: event.image ? event.image : undefined }}
          resizeMode="contain"
          style={{
            width:"100%",
            height: "100%",
            position: "absolute"
          }}
        />

        {/* Back button */}
        {
          tag && (
            <Pressable
              onPress={onBackPressed}
              style={{
                backgroundColor: theme.colors.cardBGColor,
                width: 36, height: 36,
                position: "absolute",
                top: 16, left: 16,
                borderRadius: 50,
                zIndex: 1, alignItems: "center", justifyContent: "center"
              }}
            >
              <Icon name={"chevronLeft"} color={theme.colors.gray} size={24}/>
            </Pressable>
          )
        }

        {/* Card content */}
        <Box
          flex={1}
          justifyContent="flex-end"
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                animatedInfoStyle,
                {
                  backgroundColor: theme.colors.cardBGColor,
                  borderTopLeftRadius: 40, borderTopRightRadius: 40,
                  gap: theme.spacing.l,
                  paddingTop: theme.spacing.m
                }
              ]}
            >
              {/* Main info (name, tags) */}
              <Box
                gap={"s"}
                paddingHorizontal={"eventCardPadding"}
              >
                {/* Swipe indicator */}
                <Box
                  height={4} width={100} borderRadius={"xl"}
                  backgroundColor={"gray"}
                  alignSelf={"center"}
                />

                {/* Event Title */}
                <Text
                  variant={"cardHeader"}
                  color={"cardMainTextColor"}
                  textAlign={"center"}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setTitleHeight(height + 88);
                  }}
                >
                  { event.name }
                </Text>

                {/* Event Categories */}
                {
                  event.tags && event.tags.length > 0 && (
                    <DraggableScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      contentContainerStyle={{ gap: 4, flexGrow: 1, justifyContent: "center", alignItems: "center" }}
                    >
                      {
                        event.tags.map((tag) => (
                          <TagChip key={tag.name} text={tag.name}/>
                        ))
                      }
                    </DraggableScrollView>
                  )
                }
              </Box>

              {
                (descriptionSwiping || descriptionExpanded) && (
                  <>
                    {/* Sub info (location, price, date) */}
                    <Box
                      flexDirection="column"
                      gap="s"
                      paddingHorizontal={"eventCardPadding"}
                    >
                      {/* Location */}
                      {
                        event.location && (
                          <Box
                            flexDirection={"row"}
                            gap={"xs"}
                            alignItems={"center"}
                          >
                            <Icon name={"location"} color={theme.colors.white} size={16}/>

                            <Text
                              variant={"cardSubInfo"}
                              color={"cardMainTextColor"}
                            >
                              { event.location }
                            </Text>
                          </Box>
                        )
                      }

                      {/* Price here */}
                      {
                        event.cost && (
                          <Box
                            flexDirection={"row"}
                            gap={"xs"}
                            alignItems={"center"}
                          >
                            <Text
                              variant={"cardSubInfo"}
                              color={"cardMainTextColor"}
                            >
                              { event.cost }
                            </Text>
                          </Box>
                        )
                      }

                      {/* Date with time */}
                      <Box
                        flexDirection="row"
                        gap="xs"
                        alignItems="center"
                      >
                        {
                          event.date && (
                            <>
                              <Icon name={"calendar"} color={theme.colors.gray} size={16}/>

                              <Text
                                variant={"cardSubInfo"}
                                color={"cardMainTextColor"}
                              >
                                { formatDate(event.date) }
                              </Text>
                            </>
                          )
                        }

                        {
                          event.time && (
                            <Text
                              variant={"cardSubInfo"}
                              color={"cardMainTextColor"}
                            >
                              { `В ${event.time}` }
                            </Text>
                          )
                        }
                      </Box>
                    </Box>

                    {/* Description */}
                    {
                      (event.description || event.contact) && (
                        <Box
                          flex={1}
                          overflow={"hidden"}
                          marginHorizontal={"l"}
                          borderRadius={"l"}
                          backgroundColor={"cardBGColor"}
                          paddingHorizontal={"m"}
                          paddingVertical={"m"}
                        >
                          <ScrollView
                            onScroll={(event) => {
                              if (event.nativeEvent.contentOffset.y == 0) {
                                setDescriptionScrollOnTop(true);
                              } else if (descriptionScrollOnTop && event.nativeEvent.contentOffset.y != 0) {
                                setDescriptionScrollOnTop(false);
                              }
                            }}
                            onTouchStart={() => setDescriptionScrolling(true)}
                            onTouchEnd={() => setDescriptionScrolling(false)}
                            overScrollMode={"never"}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ gap: 10 }}
                          >
                            <Text
                              variant={"cardSubheader"}
                              color={"cardMainTextColor"}
                            >
                              { "О МЕРОПРИЯТИИ" }
                            </Text>

                            {
                              event.description && (
                                <Text
                                  variant={"cardText"}
                                  color={"cardSubtextColor"}
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
                                    color={"cardSubtextColor"}
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
                      )
                    }

                    {/* Like/Dislike buttons */}
                    <Box
                      flexDirection={"row"}
                      width={"100%"}
                      paddingBottom={"l"}
                      paddingHorizontal={"l"}
                      gap={"s"}
                    >
                      <ActionButton
                        type={"dislike"}
                        onPress={() => {
                          onDislike();
                          setDescriptionExpanded(false);
                        }}
                      />
                      <ActionButton
                        type={"like"}
                        onPress={() => {
                          onLike();
                          setDescriptionExpanded(false);
                        }}
                      />
                    </Box>
                  </>
                )
              }

            </Animated.View>
          </GestureDetector>
        </Box>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};
