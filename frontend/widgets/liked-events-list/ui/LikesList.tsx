import React, {useEffect, useState} from "react";
import {Box, ErrorCard, LoadingCard, Text} from "@/shared/ui";
import {FlatList, ImageBackground, Modal, Pressable, RefreshControl, ScrollView} from "react-native";
import {useTheme} from "@shopify/restyle";
import {Hyperlink} from "react-native-hyperlink";
import {useLikedEventListStore} from "@/widgets/liked-events-list/model/useLikedEventListStore";
import {useCalendarStore} from "@/features/dates";
import {useLikesStore} from "@/features/likes-dislikes";
import {LikedEventCard} from "@/entities/event";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";
import {WEB_APP_URL} from "@env";
import Icon from "@/shared/ui/Icons/Icon";
import {useEventsSwiperStore} from "@/features/content";

export const LikesList = () => {
  const theme = useTheme<Theme>();
  const username = useConfig().initDataUnsafe.user.username;
  const config = useConfig();

  const {
    likes,
    isLoading, hasError,
    removeLikedEvent,
    fetchLikes,
    saveAction
  } = useLikesStore();

  const {
    selectedEvent,
    setEventSelected,
    modalVisible,
    setModalVisible
  } = useLikedEventListStore();

  const { selectedDays } = useCalendarStore();
  const { addEvent } = useEventsSwiperStore()

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchLikes(username, borders.date_start, borders.date_end);
    setRefreshing(false);
  };

  useEffect(() => {
    if (config.BackButton) {
      if (modalVisible) {
        config.BackButton.show();
        config.BackButton.onClick(() => setModalVisible(false))
      } else {
        config.BackButton.hide();
      }
    }

    return () => { if (config.BackButton) config.BackButton!.hide(); }
  }, [modalVisible]);

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchLikes(username, borders.date_start, borders.date_end);
  }, [selectedDays]);

  if (isLoading) {
    return (
      <Box flex={1} paddingHorizontal={"m"}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={ Array(6) }
          renderItem={({ index }) => (
            <LoadingCard key={index} style={{ minHeight: 120, flex: 1, borderRadius: 16 }}/>
          )}
          style={{ width: "100%" }}
          contentContainerStyle={{
            paddingBottom: theme.spacing.s,
            gap: 12
          }}
        />
      </Box>
    )
  }

  if (hasError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <ErrorCard />
      </Box>
    );
  }

  if (likes.length === 0) {
    return (
      <Box flex={1} backgroundColor="bg_color" justifyContent="center" alignItems="center">
        <Text variant="body" color="text_color">
          { "Нет понравившихся мероприятий" }
        </Text>
      </Box>
    );
  }

  return (
    <Box
      flex={1}
      backgroundColor="bg_color"
      paddingHorizontal="m"
    >
      <FlatList
        data={ likes }
        renderItem={({ item, index }) => (
          <LikedEventCard
            name={item.name}
            date={item.date}
            image={item.image}
            onPress={() => {
              setEventSelected(index);
              setModalVisible(true);
            }}
          />
        )}
        keyExtractor={item => item.name}
        style={{
          width: "100%"
        }}
        contentContainerStyle={{
          paddingBottom: theme.spacing.s,
          gap: 12
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.button_color}
          />
        }
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onDismiss={ () => setEventSelected(undefined) }
        transparent
      >
        <ImageBackground
          source={{ uri: selectedEvent != undefined ? likes[selectedEvent].image : undefined }}
          blurRadius={4}
          style={{
            flex: 1,
            backgroundColor: "gray",
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)'
            }}
          >
            <Box
              gap="l"
              padding="m"
              paddingBottom="l"
            >
              <Box
                flexDirection={"row"}
                alignItems={"center"}
                gap={"s"}
              >
                <Text
                  variant="header"
                  color={"white"}
                  style={{
                    flex: 1
                  }}
                >
                  { selectedEvent != undefined && likes[selectedEvent].name }
                </Text>

                {
                  selectedEvent != undefined && (
                    <Pressable
                      onPress={ () => {
                        const link = `${WEB_APP_URL}?startapp=${likes[selectedEvent].id}`;
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
                  )
                }
              </Box>

              <Text
                variant="body"
                style={{
                  color: "white"
                }}
              >
                { selectedEvent != undefined  && likes[selectedEvent].description }
              </Text>

              {
                selectedEvent != undefined &&
                likes[selectedEvent].contact &&
                likes[selectedEvent].contact!.length > 0 &&
                (
                  <Box
                    gap={"s"}
                  >
                    <Text
                      variant={"body"}
                      color={"cardSubtextColor"}
                    >
                      { "Ссылки:" }
                    </Text>

                    {likes[selectedEvent].contact?.map((con, index) => {
                      return (
                        <Hyperlink
                          key={index}
                          linkDefault={true}
                          linkStyle={{ color: theme.colors.link_color }}
                          onPress={ () => config.openLink(Object.values(con)[0], { try_instant_view: true }) }
                          linkText={(url) => {
                            const contact = likes[selectedEvent].contact!.find((c) => Object.values(c)[0] === url);
                            return contact ? Object.keys(contact)[0] : url;
                          }}
                        >
                          <Text
                            variant={"body"}
                          >
                            {Object.values(con)[0]}
                          </Text>
                        </Hyperlink>
                      );
                    })}
                  </Box>
                )
              }
            </Box>

            <Box
              gap={"m"}
              padding={"m"}
            >
              <Pressable
                onPress={ () => {
                  setModalVisible(false);
                  saveAction({
                    action: "delete_mark",
                    contentId: likes[selectedEvent!].id,
                    username: username
                  })
                    .then(() => {
                      removeLikedEvent(likes[selectedEvent!].id);
                      addEvent(likes[selectedEvent!]);
                      setEventSelected(undefined);
                    });
                }}
              >
                <Box
                  width={"100%"} height={44}
                  alignItems={"center"} justifyContent={"center"}
                  backgroundColor={"lime"}
                  borderRadius={"m"}
                >
                  <Text
                    variant={"likedEventButton"}
                    color={"black"}
                    textAlign={"center"}
                  >
                    { "Удалить из избранного" }
                  </Text>
                </Box>
              </Pressable>

              <Pressable
                onPress={ () => {
                  setModalVisible(false);
                  saveAction({
                    action: "dislike",
                    contentId: likes[selectedEvent!].id,
                    username: username
                  })
                    .then(() => {
                      removeLikedEvent(likes[selectedEvent!].id);
                      setEventSelected(undefined);
                    });
                }}
              >
                <Box
                  width={"100%"} height={44}
                  alignItems={"center"} justifyContent={"center"}
                  backgroundColor={"gray"}
                  borderRadius={"m"}
                >
                  <Text
                    variant={"likedEventButton"}
                    color={"red"}
                    textAlign={"center"}
                  >
                    { "Не нравится" }
                  </Text>
                </Box>
              </Pressable>
            </Box>
          </ScrollView>
        </ImageBackground>
      </Modal>
    </Box>
  )
}
