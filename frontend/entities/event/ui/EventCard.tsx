import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {Image, ImageBackground, Platform, Pressable, Modal, FlatList} from "react-native";
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
import {ActionButton, LoadingCard, TagChip} from "@/shared/ui";
import {ScrollView} from "react-native-gesture-handler";
import {ServicesColors} from "@/entities/service";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import {router} from "expo-router";
import ParticipantsService from "@/features/participants/api/ParticipantsService";
import {User} from "@/entities/user";
import {userEmoji} from "@/features/participants";

const DraggableScrollView = Platform.select({
  web: () => require('@/shared/providers/DraggableScroll').DraggableScrollView,
  default: () => ScrollView,
})();

interface EventCardProps {
  event: Event;
  onLike: () => void;
  onDislike: () => void;
  expanded?: boolean;
  owned?: boolean;
}

export const EventCard: React.FC<EventCardProps> = memo(({
  event,
  onLike,
  onDislike,
  expanded,
  owned
}) => {
  const theme = useTheme<Theme>();
  const config = useConfig();
  const heightValue = useSharedValue(0);

  const [cardHeight, setCardHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const [contactsHeight, setContactsHeight] = useState(0);
  const [additionalInfoHeight, setAdditionalInfoHeight] = useState(0);

  const [tagsScrolling, setTagsScrolling] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(expanded ? expanded : false);
  const [imageLoading, setImageLoading] = useState(true);

  const { setSwipeEnabled } = useEventCardStore();

  useEffect(() => {
    heightValue.value = withTiming(
      descriptionExpanded ? Math.min((cardHeight - titleHeight), descriptionHeight + contactsHeight + 42 + 32 + additionalInfoHeight) : 0,
      { duration: 250 },
    );
  }, [descriptionExpanded, cardHeight]);

  useEffect(() => {
    if (descriptionExpanded || tagsScrolling) {
      setSwipeEnabled(false)
    } else {
      setSwipeEnabled(true)
    }
  }, [descriptionExpanded, tagsScrolling]);

  const animatedInfoStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  const toggleDescription = useCallback(() => {
    setDescriptionExpanded(!descriptionExpanded);
  }, [descriptionExpanded]);

  const renderTags = useCallback(
    () =>
      event.tags!.map((tag) => (
        <TagChip key={tag.name} text={tag.name} color={event.macro_category ? ServicesColors[event.macro_category] : theme.colors.white} />
      )),
    [event.tags]
  );


  const [participants, setParticipants] = useState<User[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [participantsModalVisible, setParticipantsModalVisible] = useState(false);

  // Загрузка участников при монтировании
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const response = await ParticipantsService.getParticipants({
          content_id: event.id.toString()
        });
        if (response?.data) {
          console.log(event.id.toString())
          setParticipants(response.data);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoadingParticipants(false);
      }
    };

    loadParticipants();
  }, [event.id]);

  // Добавляем эмоджи к участникам
  const participantsWithEmojis = useMemo(() => {
    return participants.map(participant => ({
      ...participant,
      emoji: userEmoji[participant.id % userEmoji.length] // Детерминированный выбор эмоджи
    }));
  }, [participants]);

  const renderParticipantItem = useCallback(({ item }: { item: User & { emoji: string } }) => (
    <Box flexDirection="row" alignItems="center" padding="s" gap="s">
      <Box
        width={40}
        height={40}
        borderRadius={"eventCard"}
        backgroundColor="gray"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={20}>{item.emoji}</Text>
      </Box>
      <Text variant="cardText" color="cardMainTextColor">
        {item.username}
      </Text>
    </Box>
  ), []);

  const renderParticipantsPreview = useCallback(() => {
    if (participantsWithEmojis.length === 0) return null;

    const previewParticipants = participantsWithEmojis.slice(0, 3);
    const remainingCount = participantsWithEmojis.length - 3;

    return (
      <Pressable onPress={() => setParticipantsModalVisible(true)}>
        <Box flexDirection="row" alignItems="center" paddingHorizontal="eventCardPadding">
          <Text variant="cardSubInfo" color="cardMainTextColor" marginRight="s">
            Понравилось:
          </Text>
          {previewParticipants.map((participant, index) => (
            <Box
              key={participant.id}
              width={24}
              height={24}
              borderRadius={"eventCard"}
              borderWidth={1}
              borderColor={"gray"}
              backgroundColor="white"
              justifyContent="center"
              alignItems="center"
              style={{ marginLeft: index > 0 ? -8 : 0 }}
            >
              <Text fontSize={12}>{participant.emoji}</Text>
            </Box>
          ))}
          {remainingCount > 0 && (
            <Box
              width={24}
              height={24}
              borderRadius={"eventCard"}
              backgroundColor="gray"
              justifyContent="center"
              alignItems="center"
              style={{ marginLeft: -8 }}
            >
              <Text variant="cardSubInfo" color="white">
                +{remainingCount}
              </Text>
            </Box>
          )}
        </Box>
      </Pressable>
    );
  }, [participantsWithEmojis]);

  return (
    <ImageBackground
      source={{ uri: event.image || undefined }}
      resizeMode="cover"
      blurRadius={25}
      style={{
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.colors.secondary_bg_color,
        width: "100%"
      }}
    >
      <Image
        source={{ uri: event.image || undefined }}
        resizeMode="contain"
        onLoadEnd={() => setImageLoading(false)}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: imageLoading ? "none" : "flex"
        }}
      />

      {imageLoading && (
        <Box position={"absolute"} width={"100%"} height={"100%"} alignItems={"center"} justifyContent={"center"}>
          <LoadingCard style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1, borderRadius: 8 }}/>
          <Illustration name={"strelka"} width={64} height={64}/>
        </Box>
      )}

      <Box
        flex={1}
        justifyContent="flex-end"
        onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
      >
        <Box
          backgroundColor={"cardBGColor"}
          borderTopRightRadius={"xl"} borderTopLeftRadius={"xl"}
          gap={"s"}
          paddingHorizontal={"eventCardPadding"} paddingVertical={"m"}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setTitleHeight(height + 72);
          }}
        >
          {/* Event Title */}
          <Pressable onPress={toggleDescription}>
            <Text
              variant={"cardHeader"}
              color={"cardMainTextColor"}
              textAlign={"center"}
            >
              { event.name }
            </Text>
          </Pressable>

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

          {/* Reaction buttons */}
          <Box
            flexDirection="row"
            width="100%"
            justifyContent="center"
            gap="s"
            paddingVertical="s"
          >
            <ActionButton type="dislike" onPress={onDislike} />
            <ActionButton type="like" onPress={onLike} />
          </Box>
        </Box>

        <Animated.View style={[
          animatedInfoStyle,
          { backgroundColor: theme.colors.cardBGColor, gap: theme.spacing.m }]}
        >
          {/* Location */}
          <Box flexDirection="column" gap="s" paddingHorizontal="eventCardPadding"
               onLayout={(e) => setAdditionalInfoHeight(e.nativeEvent.layout.height)}
          >
            {
              event.location && (
                <Box flexDirection="row" gap="xs" alignItems="center">
                  <Icon name="location" color={theme.colors.white} size={16} />

                  <Text
                    variant={"cardSubInfo"} color={"cardMainTextColor"}
                    onPress={() => config.openLink(`https://yandex.ru/maps/?text=${event.location}`, { try_instant_view: true })}>
                    {event.location}
                  </Text>
                </Box>
              )
            }

            {/* Cost */}
            {
              event.cost != undefined && event.cost != "0" && (
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
              event.date_start && (
                <Box flexDirection="row" gap="xs" alignItems="center">
                  <Icon name="calendar" color={theme.colors.gray} size={16} />

                  <Text variant={"cardSubInfo"} color={"cardMainTextColor"}>
                    { `${formatDate(event.date_start)} ${ event.date_end && event.date_start != event.date_end ? '- ' + formatDate(event.date_end): ""}` }
                  </Text>

                  {
                    event.time && event.time !== "00:00" && (
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
              style={{ backgroundColor: "#ECEBE8", marginBottom: participants.length > 0 ? 0 : 16 }}
              maxHeight={descriptionHeight + contactsHeight + 42}
            >
              <ScrollView
                overScrollMode="never"
                style={{ flex: 1 }}
                contentContainerStyle={{ gap: 10 }}
              >
                {
                  event.description && (
                    <Text
                      variant={"cardText"}
                      color={"cardDescriptionTextColor"}
                      onLayout={(e) => setDescriptionHeight(e.nativeEvent.layout.height + 42)}
                    >
                      {event.description}
                    </Text>
                  )
                }

                {
                  event.contact && event.contact.length > 0 && !event.contact.every(obj => Object.keys(obj).length === 0) && (
                    <Box
                      gap={"s"}
                      onLayout={(e) => setContactsHeight(e.nativeEvent.layout.height)}
                    >
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

          {!loadingParticipants && renderParticipantsPreview()}
        </Animated.View>
      </Box>

      {/* Participants Modal */}
      <Modal
        visible={participantsModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setParticipantsModalVisible(false)}
      >
        <Box flex={1} backgroundColor="cardBGColor" padding="m">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="m">
            <Text variant="cardHeader" color="cardMainTextColor">
              Участники
            </Text>
            <Pressable onPress={() => setParticipantsModalVisible(false)}>
              <Icon name="dislike" color={theme.colors.cardMainTextColor} size={24} />
            </Pressable>
          </Box>

          {loadingParticipants ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <LoadingCard />
            </Box>
          ) : (
            <FlatList
              data={participantsWithEmojis}
              renderItem={renderParticipantItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <Box flex={1} justifyContent="center" alignItems="center">
                  <Text variant="cardText" color="cardMainTextColor">
                    Пока нет участников
                  </Text>
                </Box>
              }
            />
          )}
        </Box>
      </Modal>

      {owned && (
        <Pressable
          style={{ width: "100%", backgroundColor: "#ECEBE8", padding: 12, alignItems: "center", justifyContent: "center" }}
          onPress={() => router.push({
            pathname: "/tags/organizers/manage",
            params: { id: event.id }
          })}
        >
          <Text style={{ fontFamily: "MontserratRegular", fontSize: 14 }} selectable={false}>
            Управление мероприятием
          </Text>
        </Pressable>
      )}
    </ImageBackground>
  );
});
