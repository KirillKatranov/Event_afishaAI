import React, {useEffect} from 'react'
import {StyleSheet, Text, View} from "react-native";
import {useOrganizersListStore, useUserOrganizersListStore} from "@/features/organizers-list";
import {OrganizerCard} from "@/entities/organizers";
import {Button} from "@/shared/ui";
import {useRouter} from "expo-router";
import {useConfig} from "@/shared/providers/TelegramConfig";

export const OrganizersList = () => {
  const router = useRouter();

  const {organizers, getOrganizers } = useOrganizersListStore();
  const allLoading = useOrganizersListStore((state) => state.isLoading);

  const {userOrganizers, getUserOrganizers, deleteOrganizer } = useUserOrganizersListStore();
  const userLoading = useUserOrganizersListStore((state) => state.isLoading);

  const user = useConfig().initDataUnsafe.user;

  useEffect(() => {
    if (organizers == null) getOrganizers();
  }, [organizers, getOrganizers]);

  useEffect(() => {
    if (userOrganizers == null) getUserOrganizers(user.username ? user.username : user.id.toString());
  }, [userOrganizers, getUserOrganizers]);

  return (
    <View style={{ width: "100%", flexDirection: "column", gap: 16, paddingTop: 62 }}>
      <Button
        theme={"organizers"} text={`Мероприятия от ${user.username ? user.username : user.id.toString()}`}
        onPress={() => router.replace({
          pathname: "/tags/organizers/events",
          params: {
            type: "user",
            id: user.username ? user.username : user.id.toString(),
            owned: 1,
          }
        })}
      />

      <Button
        theme={"organizers"} text={"Создать мероприятие"}
        variant={"secondary"} onPress={() => router.replace("/tags/organizers/create")}
      />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Ваши ораганизации
        </Text>

        {(userOrganizers === null || userLoading) && (
          <OrganizerCard/>
        )}

        {userOrganizers !== null && userOrganizers.map((organizer) => (
          <OrganizerCard
            organizer={organizer}
            onPress={() => router.replace({
              pathname: "/tags/organizers/events",
              params: { type: "organization", id: organizer.id, owned: 1 },
            })}
            owned={true}
            onDelete={() => deleteOrganizer(organizer.id, user.username ? user.username : user.id.toString(), () => {
              getUserOrganizers(user.username ? user.username : user.id.toString());
              getOrganizers();
            })}
          />
        ))}

        {userOrganizers !== null && userOrganizers.length == 0 && (
          <Text style={{ fontFamily: "MontserratRegular", fontSize: 16, textAlign: "center" }}>
            У вас нет организаций
          </Text>
        )}

        <Button
          theme={"organizers"} text={"Создать организацию"}
          variant={"secondary"} onPress={() => router.replace("/tags/organizers/register")}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Все организации
        </Text>

        {(organizers === null || allLoading) && (
          <OrganizerCard/>
        )}

        {organizers !== null && organizers.map((organizer) => (
          <OrganizerCard
            organizer={organizer}
            onPress={() => router.replace({
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
  sectionTitle: { fontFamily: "MontserratMedium", fontSize: 16 }
})
