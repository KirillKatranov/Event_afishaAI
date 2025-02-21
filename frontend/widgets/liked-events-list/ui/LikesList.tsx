import React, {useEffect} from "react";
import {Box, ErrorCard, LoadingCard, Text} from "@/shared/ui";
import {FlatList, Modal} from "react-native";
import {useTheme} from "@shopify/restyle";
import {useCalendarStore} from "@/features/dates";
import {useReactionsStore} from "@/features/likes-dislikes";
import {Event, LikedEventCard} from "@/entities/event";
import {Theme} from "@/shared/providers/Theme";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {getPeriodBorders} from "@/shared/scripts/date";
import {SelectedEvent} from "@/widgets/liked-events-list/ui/SelectedEvent";

export const LikesList = React.memo(() => {
  const theme = useTheme<Theme>();
  const username = useConfig().initDataUnsafe.user.username;

  const [selectedEvent, setEventSelected] = React.useState<Event | undefined>(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);

  const {
    likes,
    isLikesLoading, hasLikesError,
    fetchReactions,
  } = useReactionsStore();

  const { selectedDays } = useCalendarStore();

  useEffect(() => {
    const borders = getPeriodBorders(Object.keys(selectedDays));
    fetchReactions({
      username: username,
      date_start: borders.date_start, date_end: borders.date_end
    });
  }, [selectedDays]);

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
          style={{ width: "100%" }}
          contentContainerStyle={{
            padding: theme.spacing.m,
            gap: 12
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
    >
      <FlatList
        data={ likes }
        renderItem={({ item }) => (
          <LikedEventCard
            event={item}
            onPress={() => {
              setEventSelected(item);
              setModalVisible(true);
            }}
          />
        )}
        keyExtractor={item => item.id.toString()}
        style={{
          width: "100%"
        }}
        contentContainerStyle={{
          padding: theme.spacing.m,
          gap: 12
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onDismiss={ () => setEventSelected(undefined) }
        transparent
      >
        <SelectedEvent
          type={"liked"}
          selectedEvent={selectedEvent}
          setEventSelected={setEventSelected} setModalVisible={setModalVisible}
        />
      </Modal>
    </Box>
  )
})
