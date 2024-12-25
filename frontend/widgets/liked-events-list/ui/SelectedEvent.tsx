import React, {useEffect} from "react";
import {ImageBackground, Pressable, ScrollView} from "react-native";
import {Box, Text} from "@/shared/ui";
import {Event} from "@/entities/event"
import {WEB_APP_URL} from "@env";
import Icon from "@/shared/ui/Icons/Icon";
import {Hyperlink} from "react-native-hyperlink";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useTheme} from "@shopify/restyle";
import {Theme} from "@/shared/providers/Theme";
import {useReactionsStore} from "@/features/likes-dislikes";

interface SelectedEventProps {
  type: "liked" | "disliked";
  selectedEvent: Event | undefined;
  setModalVisible: (visible: boolean) => void;
  setEventSelected: (selectedEvent: Event | undefined) => void;
}

export const SelectedEvent: React.FC<SelectedEventProps> = (props) => {
  const config = useConfig();
  const theme = useTheme<Theme>();

  const {
    saveAction, removeLikedEvent, removeDislikedEvent, addLikedEvent
  } = useReactionsStore();

  useEffect(() => {
    if (config.BackButton) {
      if (props.selectedEvent) {
        config.BackButton.show();
        config.BackButton.onClick(() => props.setModalVisible(false))
      } else {
        config.BackButton.hide();
      }
    }

    return () => { if (config.BackButton) config.BackButton!.hide(); }
  }, [props.selectedEvent]);

  return (
    <ImageBackground
      source={{ uri: props.selectedEvent != undefined ? props.selectedEvent.image : undefined }}
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
              { props.selectedEvent != undefined && props.selectedEvent.name }
            </Text>

            <Box
              flexDirection={"column"}
              gap={"xs"}
            >
              {
                props.selectedEvent !== undefined && (
                  <Pressable
                    onPress={ () => {
                      const link = `${WEB_APP_URL}?startapp=${props.selectedEvent!.id}`;
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
          </Box>

          <Text
            variant="body"
            style={{
              color: "white"
            }}
          >
            { props.selectedEvent != undefined  && props.selectedEvent.description }
          </Text>

          {
            props.selectedEvent != undefined &&
            props.selectedEvent.contact &&
            props.selectedEvent.contact!.length > 0 &&
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

                {props.selectedEvent.contact?.map((con, index) => {
                  return (
                    <Hyperlink
                      key={index}
                      linkDefault={true}
                      linkStyle={{ color: theme.colors.link_color }}
                      onPress={ () => config.openLink(Object.values(con)[0], { try_instant_view: true }) }
                      linkText={(url) => {
                        const contact = props.selectedEvent!.contact!.find((c) => Object.values(c)[0] === url);
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
          {
            props.type == "disliked" && (
              <Pressable
                onPress={ () => {
                  props.setModalVisible(false);
                  saveAction({
                    action: "like",
                    contentId: props.selectedEvent!.id,
                    username: config.initDataUnsafe.user.username
                  })
                    .then(() => {
                      addLikedEvent(props.selectedEvent!);
                      removeDislikedEvent(props.selectedEvent!.id);
                      props.setEventSelected(undefined);
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
                    { "Понравилось" }
                  </Text>
                </Box>
              </Pressable>
            )
          }

          <Pressable
            onPress={ () => {
              props.setModalVisible(false);
              saveAction({
                action: "delete_mark",
                contentId: props.selectedEvent!.id,
                username: config.initDataUnsafe.user.username
              })
                .then(() => {
                  removeLikedEvent(props.selectedEvent!.id);
                  props.setEventSelected(undefined);
                });
            }}
          >
            <Box
              width={"100%"} height={44}
              alignItems={"center"} justifyContent={"center"}
              backgroundColor={"red"}
              borderRadius={"m"}
            >
              <Text
                variant={"likedEventButton"}
                color={"gray"}
                textAlign={"center"}
              >
                { "Удалить" }
              </Text>
            </Box>
          </Pressable>
        </Box>
      </ScrollView>
    </ImageBackground>
  )
}
