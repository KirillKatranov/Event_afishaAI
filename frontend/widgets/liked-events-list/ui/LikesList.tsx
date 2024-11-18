import React, {useEffect, useState} from "react";
import {Box, ErrorCard, LoadingCard, Text} from "@/shared/ui";
import {FlatList, ImageBackground, Modal, Pressable, RefreshControl, ScrollView} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useTheme} from "@shopify/restyle";
import {Hyperlink} from "react-native-hyperlink";
import {useLikedEventListStore} from "@/widgets/liked-events-list/model/useLikedEventListStore";
import {useCalendarStore} from "@/features/dates";
import {useLikesStore} from "@/features/likes-dislikes";
import {LikedEventCard} from "@/entities/event";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";

export const LikesList = () => {
  const theme = useTheme<Theme>();
  const username = useConfig().initDataUnsafe.user.username;
  const openLink = useConfig().openLink;

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

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchLikes(username, borders.date_start, borders.date_end);
    setRefreshing(false);
  };

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
              <Text
                variant="header"
                style={{
                  color: "white"
                }}
              >
                { selectedEvent != undefined && likes[selectedEvent].name }
              </Text>

              <Text
                variant="body"
                style={{
                  color: "white"
                }}
              >
                { selectedEvent != undefined  && likes[selectedEvent].description }
              </Text>

              {
                selectedEvent != undefined && likes[selectedEvent].contact && (
                  <Box
                    gap={"s"}
                  >
                    <Text
                      variant={"body"}
                      color={"cardSubtextColor"}
                    >
                      { "\nСсылки:" }
                    </Text>

                    {likes[selectedEvent].contact?.map((con, index) => {
                      return (
                        <Hyperlink
                          key={index}
                          linkDefault={true}
                          linkStyle={{ color: theme.colors.link_color }}
                          onPress={ () => openLink(Object.values(con)[0], { try_instant_view: true }) }
                          linkText={(url) => {
                            const con = likes[selectedEvent].contact?.find((c) => Object.values(c)[0] === url);
                            return con ? Object.keys(con)[0] : url;
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

              <Box
                bottom={0}
                width={"100%"}
                flexDirection={"row"}
                paddingHorizontal={"m"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Pressable
                  onPress={ () => {
                    setModalVisible(false);
                    saveAction("dislike", likes[selectedEvent!].id, username)
                      .then(() => {
                        removeLikedEvent(likes[selectedEvent!].id);
                        setEventSelected(undefined);
                      });
                  }}
                >
                  <Box width={44} height={44} alignItems={"center"} justifyContent={"center"}
                       style={{ borderRadius: 25, backgroundColor: 'rgb(255,0,0)'}}>
                    <MaterialIcons name="thumb-down" size={20} color="white" />
                  </Box>
                </Pressable>

                <Pressable
                  onPress={ () => setModalVisible(false) }
                >
                  <Box width={44} height={44} alignItems={"center"} justifyContent={"center"}
                       backgroundColor={"button_color"}
                       style={{ borderRadius: 25 }}>
                    <MaterialIcons name="close" size={20} color="white" />
                  </Box>
                </Pressable>
              </Box>
            </Box>
          </ScrollView>
        </ImageBackground>
      </Modal>
    </Box>
  )
}
