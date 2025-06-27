import React, {useEffect, useState} from 'react'
import {Pressable, StyleSheet, Text, View, Modal} from "react-native";
import {useOrganizersListStore, useUserOrganizersListStore} from "@/features/organizers-list";
import {OrganizerCard} from "@/entities/organizers";
import {useRouter} from "expo-router";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {Button} from "@/shared/ui";

export const OrganizersList = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const {organizers, getOrganizers } = useOrganizersListStore();
  const allLoading = useOrganizersListStore((state) => state.isLoading);

  const {userOrganizers, getUserOrganizers } = useUserOrganizersListStore();

  const user = useConfig().initDataUnsafe.user;

  useEffect(() => {
    if (organizers == null) getOrganizers();
  }, [organizers, getOrganizers]);

  useEffect(() => {
    if (userOrganizers == null) getUserOrganizers(user.username ? user.username : user.id.toString());
  }, [userOrganizers, getUserOrganizers]);

  return (
    <View style={{ width: "100%", flexDirection: "column", gap: 16, paddingHorizontal: 16, paddingBottom: 16 }}>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{
          width: "100%", height: 40, justifyContent: "center",
          borderRadius: 20, borderWidth: 2, borderColor: "#6361DD"
        }}
      >
        <Text style={{ fontFamily: "UnboundedSemiBold", fontSize: 14, textAlign: "center" }} selectable={false}>
          Я – ОРГАНИЗАТОР
        </Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}/>

          <View style={styles.modalContent}>
            <Button
              theme={"organizers"} variant={"secondary"}
              text={"Мои мероприятия"}
              onPress={() => {}}
            />

            <Button
              theme={"organizers"}
              text={"Создать мероприятие"}
              onPress={() => router.replace("/tags/organizers/create")}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.sectionContainer}>
        {(organizers === null || allLoading) && (
          <OrganizerCard/>
        )}

        {organizers !== null && organizers.map((organizer) => (
          <OrganizerCard
            organizer={organizer}
            onPress={() => router.push({
              pathname: "/tags/organizers/events",
              params: { type: "organization", id: organizer.id }
            })}
          />
        ))}

        {organizers !== null && organizers.length == 0 && (
          <Text style={{ fontFamily: "MontserratRegular", fontSize: 16, textAlign: "center" }}>
            Организации отвутвуют
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: { width: "100%", flexDirection: "column", gap: 16 },
  sectionTitle: { fontFamily: "MontserratMedium", fontSize: 16 },
  modalOverlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20, gap: 16,
    width: '80%',
    alignItems: 'center',
  },
})
