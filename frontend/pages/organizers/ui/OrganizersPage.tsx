import React from "react";
import {CreateEventForm} from "@/widgets/create-event-form";
import {ScrollView} from "react-native";

export const OrganizersPage = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, flexDirection: "column", gap: 16, backgroundColor: "white"}}
    >
      <CreateEventForm />
    </ScrollView>
  )
}
