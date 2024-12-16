import React, {useEffect} from "react";
import {Box, ErrorCard, LoadingCard} from "@/shared/ui";
import {useSharedEventStore} from "@/widgets/shared-event/model/store/useSharedEventStore";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {EventCard} from "@/entities/event";
import {useLikesStore} from "@/features/likes-dislikes";
import {useRouter} from "expo-router";

export const SharedEventCard: React.FC = () => {
  const router = useRouter();
  const id = useConfig().initDataUnsafe.start_param;
  const username = useConfig().initDataUnsafe.user.username;

  const {
    event, getEvent,
    isLoading, hasError
  } = useSharedEventStore();

  const {
    saveAction, addLikedEvent, removeLikedEvent
  } = useLikesStore();

  useEffect(() => {
    if (!event) getEvent(id!)
  }, []);

  if (isLoading || !event) return <LoadingCard style={{ flex: 1 }}/>;
  if (hasError) return <ErrorCard/>;

  return (
    <Box
      flex={1}
    >
      <EventCard
        event={event}
        onLike={() => {
          router.replace("/feed");
          saveAction("like", event.id, username)
            .then(() => addLikedEvent(event))
        }}
        onDislike={() => {
          router.replace("/feed");
          saveAction("dislike", event.id, username)
            .then(() => removeLikedEvent(event.id))
        }}
      />
    </Box>
  )
}
