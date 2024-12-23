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

export const DislikesList = React.memo(() => {
  const theme = useTheme<Theme>();
  const username = useConfig().initDataUnsafe.user.username;

  const [selectedEvent, setEventSelected] = React.useState<Event | undefined>(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);

  const {
    dislikes,
    isDislikesLoading, hasDislikesError,
    fetchReactions,
  } = useReactionsStore();

  const { selectedDays } = useCalendarStore();

  useEffect(() => {
    if (dislikes.length == 0) {
      const borders = getPeriodBorders(Object.keys(selectedDays));
      fetchReactions({
        username: username,
        date_start: borders.date_start, date_end: borders.date_end,
        value: "False"
      });
    }
  }, [selectedDays]);

  if (isDislikesLoading) {
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

  if (hasDislikesError) {
    return (
      <Box flex={1} backgroundColor="bg_color">
        <ErrorCard />
      </Box>
    );
  }

  if (dislikes.length === 0) {
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
        data={ dislikes }
        renderItem={({ item }) => (
          <LikedEventCard
            name={item.name}
            date={item.date}
            image={item.image}
            onPress={() => {
              setEventSelected(item);
              setModalVisible(true);
            }}
          />
        )}
        keyExtractor={item => item.name}
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
          type={"disliked"}
          selectedEvent={selectedEvent}
          setEventSelected={setEventSelected} setModalVisible={setModalVisible}
        />
      </Modal>
    </Box>
  )
})
