import React from "react";
import {CreateEventForm, EventSettings} from "@/widgets/create-event-form";
import {ScrollView} from "react-native";

export const OrganizersPage = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, flexDirection: "column", gap: 16, backgroundColor: "white"}}
    >
      <EventSettings/>
    </ScrollView>
  )
}
