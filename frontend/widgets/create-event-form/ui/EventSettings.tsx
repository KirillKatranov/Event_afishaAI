import React, {useState} from "react";
import {Modal, TouchableOpacity, View} from "react-native";
import {Button, Text,} from "@/shared/ui";
import {useEventSettingsStore} from "@/widgets/create-event-form";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useConfig} from "@/shared/providers/TelegramConfig";

export const EventSettings = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter();

  const state = useEventSettingsStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const user = useConfig().initDataUnsafe.user

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    state.deleteEvent( id, user.username ? user.username : user.id.toString(), () => router.back() );
  };

  return (
    <View
      style={{
        width: "100%",
        padding: 16,
        flexDirection: "column", gap: 16
      }}
    >
      <View>
        <Button theme={"organizers"} text={"Удалить мероприятие"} onPress={() => setShowDeleteModal(true)}/>

        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <View style={{backgroundColor: 'white', padding: 20, borderRadius: 16, width: '80%'}}>
              <Text style={{fontFamily: 'MontserratMedium', fontSize: 16, marginBottom: 20, textAlign: 'center'}}>
                Вы уверены, что хотите удалить это мероприятие?
              </Text>

              <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  style={{
                    paddingVertical: 10, paddingHorizontal: 20,
                    borderRadius: 8, borderWidth: 1, borderColor: '#B4C9FE'
                  }}
                >
                  <Text style={{ fontFamily: 'MontserratMedium' }}>Отмена</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDeleteConfirm}
                  style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#FF3B30'}}
                >
                  <Text style={{ color: 'white', fontFamily: 'MontserratMedium' }}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}
