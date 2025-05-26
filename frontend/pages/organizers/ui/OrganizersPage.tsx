import React from "react";
import {ScrollView} from "react-native";
import {SignInOrganizerForm} from "@/widgets/organizers-auth";

export const OrganizersPage = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, flexDirection: "column", gap: 16, backgroundColor: "white"}}
    >
      <SignInOrganizerForm/>
    </ScrollView>
  )
}
