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

  const username = useConfig().initDataUnsafe.user.username;

  useEffect(() => {
    if (organizers == null) getOrganizers();
  }, [organizers, getOrganizers]);

  useEffect(() => {
    if (userOrganizers == null) getUserOrganizers(username);
  }, [userOrganizers, getUserOrganizers]);

  return (
    <View style={{ width: "100%", flexDirection: "column", gap: 16, paddingTop: 62 }}>
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
            onPress={() => router.push({
              pathname: "/tags/organizers/events",
              params: { type: "organization", id: organizer.id }
            })}
            owned={true}
            onDelete={() => deleteOrganizer(organizer.id, username, () => {
              getUserOrganizers(username);
              getOrganizers();
            })}
          />
        ))}

        <Button
          theme={"organizers"} text={"Создать организацию"}
          variant={"secondary"} onPress={() => router.push("/tags/organizers/register")}
        />

        <Button
          theme={"organizers"} text={"Создать мероприятие"}
          variant={"secondary"} onPress={() => router.push("/tags/organizers/create")}
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
            onPress={() => router.push({
              pathname: "/tags/organizers/events",
              params: { type: "organization", id: organizer.id }
            })}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: { width: "100%", flexDirection: "column", gap: 16 },
  sectionTitle: { fontFamily: "MontserratMedium", fontSize: 16 }
})
