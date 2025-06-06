import React, {useEffect} from 'react'
import {StyleSheet, Text, View} from "react-native";
import {useOrganizersListStore} from "@/features/organizers-list/model/OrganizersListStore";
import {OrganizerCard} from "@/entities/organizers";
import {Button} from "@/shared/ui";
import {useRouter} from "expo-router";

export const OrganizersList = () => {
  const router = useRouter();
  const {organizers, getOrganizers, isLoading} = useOrganizersListStore();

  useEffect(() => {
    if (organizers == null) getOrganizers();
  }, [organizers, getOrganizers]);

  if (organizers == null || isLoading) {
    return (
      <View>Загрузка</View>
    )
  }

  return (
    <View style={{ width: "100%", flexDirection: "column", gap: 16, paddingTop: 62 }}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Ваши ораганизации
        </Text>

        {organizers.map((organizer) => (
          <OrganizerCard organizer={organizer} onPress={() => {}}/>
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

        {organizers.map((organizer) => (
          <OrganizerCard organizer={organizer} onPress={() => {}}/>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: { width: "100%", flexDirection: "column", gap: 16 },
  sectionTitle: { fontFamily: "MontserratMedium", fontSize: 16 }
})
