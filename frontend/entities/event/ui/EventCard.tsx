import React, {useCallback, useEffect, useState} from "react";
import {Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Event, useEventCardStore} from "@/entities/event";
import {Box, CardControlsButton, Chip, LoadingCard} from "@/shared/ui";
import DropShadow from "react-native-drop-shadow";
import Illustration from "@/shared/ui/Illustrations/Illustration";
import {Marquee} from "@animatereactnative/marquee";
import {BlurView} from "expo-blur";
import Icon from "@/shared/ui/Icons/Icon";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {LinearGradient} from "expo-linear-gradient";
import {Hyperlink} from "react-native-hyperlink";
import {ServicesGradients} from "@/entities/service";
import {LikeGradient} from "@/shared/ui/Icons";

interface EventCardProps {
  event: Event;
  onLike: () => void;
  onDislike: () => void;
  expanded?: boolean;
  owned?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onLike,
  onDislike,
  expanded,
  owned
}) => {
  const [startX, setStartX] = useState(0);

  const [imageLoading, setImageLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(expanded ? expanded : false);

  const { setSwipeEnabled } = useEventCardStore();

  const openLink = useConfig().openLink;
  const openTgLink = useConfig().openTelegramLink;

  const onSharePress = () => {
    const link = `${process.env.EXPO_PUBLIC_WEB_APP_URL}?startapp=${event.id}`;
    const encodedMessage = encodeURIComponent(`Привет! Посмотри это мероприятие`);

    console.log("Sharing event with link:", link);

    openTgLink(`https://t.me/share/url?text=${encodedMessage}&url=${link}`);
  }

  useEffect(() => {
    if (modalVisible) setSwipeEnabled(false);
    else setSwipeEnabled(true);
  }, [modalVisible]);

  const renderTags = useCallback(
    () =>
      event.tags!.map((tag) => (
        <Chip key={tag.name} text={tag.name}  service={event.macro_category}/>
      )),
    [event.tags]
  );

  const renderSubInfo = () => (
    <View style={{ width: "100%", flexDirection: "column", alignItems: "center", gap: 8, padding: 20 }}>
      {event.location && (
        <Pressable
          onPressIn={(event) => {
            event.preventDefault()
            setStartX(event.nativeEvent.pageX);
          }}
          onPressOut={(e) => {
            e.preventDefault()
            const endX = e.nativeEvent.pageX;
            if (Math.abs(endX - startX) < 15) {
              openLink(`https://yandex.ru/maps/?text=${event.location}`, { try_instant_view: true })
            }
          }}
        >
          <Chip text={event.location} icon={"location"} service={event.macro_category}/>
        </Pressable>
      )}

      <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 8 }}>
        {event.cost !== null && event.cost !== undefined && (
          <Chip
            text={event.cost == '0' ? "Бесплатно" : event.cost}
            icon={"cost"}
            service={event.macro_category}
          />
        )}

        {event.tags && event.tags.length == 1 && (
          <Chip text={event.tags[0].name}  service={event.macro_category}/>
        )}
      </View>


      {event.tags && event.tags.length > 1 && (
        <Marquee spacing={8} speed={0.2}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {renderTags()}
          </View>
        </Marquee>
      )}
    </View>
  )

  return (
    <View style={{ flex: 1, width: "100%", flexDirection: "column", overflow: "hidden", backgroundColor: "white" }}>
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute", alignSelf: "center",
          zIndex: -1,
          width: "100%", height: 120,
          top: 0,
          opacity: 0.75, transform: [{ scaleX: -1 }]
        }}
      />

      {/* Image */}
      <View
        style={{
          flex: 1, flexDirection: "column", justifyContent: "flex-end",
          paddingTop: 80
        }}
      >
        <Image
          source={{ uri: event.image || undefined }}
          resizeMode="cover"
          onLoadEnd={() => setImageLoading(false)}
          style={{
            flex: 1, maxHeight: 390,
            display: imageLoading ? "none" : "flex",
            backgroundColor: "#ECEBE8",
          }}
        />

        {imageLoading && (
          <Box flex={1} maxHeight={390} alignItems={"center"} justifyContent={"center"}>
            <LoadingCard style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1, borderRadius: 8 }}/>
            <Illustration name={"strelka"} width={64} height={64} opacity={0.5}/>
          </Box>
        )}

        <DropShadow
          style={{
            width: "100%",
            padding: 10,
            shadowOffset: {width: 0, height: 7},
            shadowColor: "rgba(0,0,0,0.25)",
            shadowRadius: 10,
          }}
        >
          <Pressable
            onPressIn={(event) => {
              event.preventDefault()
              setStartX(event.nativeEvent.pageX);
            }}
            onPressOut={(e) => {
              e.preventDefault()
              const endX = e.nativeEvent.pageX;
              if (Math.abs(endX - startX) < 15) {
                setModalVisible(true)
              }
            }}
            style={{
              position: "absolute", top: -43, right: 12,
              borderRadius: 10, overflow: "hidden",
              shadowOffset: {width: 4, height: 4},
              backgroundColor: "rgba(255,255,255,0.3)",
              shadowRadius: 8,
              shadowColor: "rgba(0,0,0,0.25)"
            }}
          >
            <BlurView
              intensity={50} tint={"light"}
              style={{
                paddingHorizontal: 8, paddingVertical: 6, gap: 8,
                flexDirection: "row", alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "UnboundedRegular", fontSize: 14, color: "#393939"}}>
                подробнее
              </Text>

              <Icon name={"moreGradient"} size={10} color={"black"}/>
            </BlurView>
          </Pressable>


          <Text style={{ fontFamily: "UnboundedRegular", fontSize: 16, textAlign: "center", color: "#393939"}}>
            {event.name.toUpperCase()}
          </Text>
        </DropShadow>
      </View>

      {/* Controls */}
      <View
        style={{
          flexDirection: "column", alignItems: "center",
          gap: 8
        }}
      >
        {renderSubInfo()}

        <View style={{ flexDirection: "row", gap: 30, paddingBottom: 40, alignItems: "center" }}>
          <CardControlsButton type={"dislike"} onPress={onDislike} service={event.macro_category}/>
          <CardControlsButton type={"like"} onPress={onLike} service={event.macro_category}/>
          <CardControlsButton type={"share"} onPress={onSharePress} service={event.macro_category}/>
        </View>
      </View>

      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute", alignSelf: "center",
          zIndex: -1,
          width: "100%", height: 120,
          bottom: -25,
          opacity: 0.75, transform: [{ scaleX: -1 }, { scaleY: -1 }]
        }}
      />

      <Modal
        id={"modalEventDescription"}
        animationType={"fade"}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(true)}
        transparent
      >
        <BlurView style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 25 }}>
          <View style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: 20, overflow: "hidden" }}>
            <View
              style={{
                width: "100%", padding: 12,
                justifyContent: "space-between", alignItems:"center", flexDirection: "row"
              }}
            >
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ width: 50, height: 50, alignItems: "center", justifyContent: "center" }}
              >
                <Icon name={"chevronLeft"} color={"#393939"} size={24}/>
              </Pressable>

              <TouchableOpacity onPress={onLike} activeOpacity={0.7}>
                <DropShadow
                  style={{
                    shadowOffset: {width: 2, height: 3},
                    shadowColor: event.macro_category ? ServicesGradients[event.macro_category][1] : "rgba(0,0,0,0.25)",
                    shadowRadius: 5, borderRadius: 15,
                    height: 48, width: 48,
                    backgroundColor: "white",
                    alignItems: "center", justifyContent: "center"
                  }}
                >
                  <LikeGradient
                    width={28} height={28}
                    fill={{
                      id: event.id.toString(),
                      startColor: event.macro_category ? ServicesGradients[event.macro_category][0] : "black",
                      endColor: event.macro_category ? ServicesGradients[event.macro_category][1] : "black",
                      start: { x: 0, y: 0 },
                      end: { x: 0, y: 1 }
                    }}
                  />
                </DropShadow>
              </TouchableOpacity>
            </View>

            <View
              style={{
                shadowOffset: {width: 1, height: 4},
                shadowRadius: 7,
                shadowColor: "rgba(132,132,132,0.2)",
                paddingVertical: 18, paddingHorizontal: 8,
                marginBottom: 16
              }}
            >
              <Text style={{ fontFamily: "UnboundedRegular", fontSize: 16, color: "#393939", textAlign: "center" }}>
                {event.name}
              </Text>
            </View>

            {renderSubInfo()}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ width: "100%", flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20, gap: 16, justifyContent: "space-between" }}
            >
              <Text style={{ fontFamily: "UnboundedLight", fontSize: 12, color: "black" }}>
                {event.description}
              </Text>

              { event.contact && event.contact.length > 0 && !event.contact.every(obj => Object.keys(obj).length === 0) &&
                !event.contact.every(obj => Object.values(obj).length === 0) && (
                event.contact.map((con, index) => (
                  <LinearGradient
                    colors={[
                      event.macro_category ? ServicesGradients[event.macro_category][0] : "rgba(0,0,0,0.5)",
                      event.macro_category ? ServicesGradients[event.macro_category][1] : "rgba(0,0,0,0.5)",
                    ]}
                    style={{
                      padding: 12, gap: 16, borderRadius: 10,
                      flexDirection: "row", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Hyperlink
                      key={index}
                      linkDefault={true}
                      linkStyle={{ color: "white" }}
                      onPress={ () => openLink(Object.values(con)[0], { try_instant_view: true }) }
                      linkText={(url) => {
                        const contact = event.contact!.find((c) => Object.values(c)[0] === url);
                        return contact ? Object.keys(contact)[0] : url;
                      }}
                    >
                      <Text style={{ fontFamily: "UnboundedRegular", fontSize: 14, color: "white" }}>
                        {Object.values(con)[0]}
                      </Text>
                    </Hyperlink>

                    <Icon name={"moreGradient"} color={"white"} size={14}/>
                  </LinearGradient>
                ))
              )}
            </ScrollView>
          </View>
        </BlurView>
      </Modal>
    </View>
  )
}
