import React, {useCallback, useEffect} from "react";
import {Box, ErrorCard, LoadingCard, Text} from "@/shared/ui";
import {FlatList, Modal, Pressable} from "react-native";
import {useCalendarStore} from "@/features/dates";
import {useReactionsStore} from "@/features/likes-dislikes";
import {Event, EventCard} from "@/entities/event";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";
import {CatalogEventCard} from "@/entities/event/ui/CatalogEventCard";
import Icon from "@/shared/ui/Icons/Icon";

export const LikesList = React.memo(() => {
  const username = useConfig().initDataUnsafe.user.username;

  const [selectedEvent, setEventSelected] = React.useState<Event | undefined>(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);

  const {
    likes,
    isLikesLoading, hasLikesError,
    fetchReactions, saveAction
  } = useReactionsStore();

  const { selectedDays } = useCalendarStore();

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchReactions({
      username: username,
      date_start: borders.date_start, date_end: borders.date_end
    });
  }, [selectedDays]);

  const handleEventAction = useCallback(async (action: "like" | "dislike" | "delete_mark", event: Event) => {
    saveAction({
      action,
      contentId: event.id,
      username,
    }, () => {
      const borders = getPeriodBorders(Object.keys(selectedDays));
      fetchReactions({
        username: username,
        date_start: borders.date_start, date_end: borders.date_end
      });
    });
  }, [username]);

  const renderCatalogItem = useCallback(({ item }: { item: Event }) => (
    <CatalogEventCard
      event={item}
      liked={!!likes?.some((event) => event.id === item.id)}
      onLike={() => handleEventAction(!!likes?.some((event) => event.id === item.id) ? "dislike" : "like", item)}
      onPress={() => {
        setEventSelected(item);
        setModalVisible(true);
      }}
    />
  ), [likes]);

  if (isLikesLoading) {
    return (
      <Box flex={1}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={ Array(6) }
          renderItem={({ index }) => (
            <LoadingCard key={index} style={{ minHeight: 120, flex: 1, borderRadius: 16 }}/>
          )}
          numColumns={2}
          columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
          style={{
            flex: 1,
            gap: 16,
            paddingHorizontal: 16,
          }}
        />
      </Box>
    )
  }

  if (hasLikesError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <ErrorCard />
      </Box>
    );
  }

  if (likes !== undefined && likes.length === 0) {
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
    >
      <FlatList
        data={likes}
        renderItem={renderCatalogItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
        style={{
          flex: 1,
          gap: 16,
          paddingHorizontal: 16,
        }}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onDismiss={ () => setEventSelected(undefined) }
        transparent
      >
        {selectedEvent && (
          <Pressable
            onPress={ () => setModalVisible(false) }
            style={{ position: "absolute", zIndex: 10, right: 20, top: 20 }}
          >
            <Box
              backgroundColor={"cardBGColor"}
              width={40} height={40}
              borderRadius={"eventCard"}
              alignItems={"center"} justifyContent={"center"}
            >
              <Icon name={"chevronDown"} color={"#ECEBE8"} size={24}/>
            </Box>
          </Pressable>
        )}

        {selectedEvent && (
          <EventCard
            event={selectedEvent}
            liked={!!likes?.some((event) => event.id === selectedEvent.id)}
            onLike={() => handleEventAction("like", selectedEvent).then(() => setModalVisible(false))}
            onDislike={() => handleEventAction("dislike", selectedEvent).then(() => setModalVisible(false))}
          />
        )}
      </Modal>
    </Box>
  )
})
