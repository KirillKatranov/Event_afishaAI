import React, { useEffect, useState } from "react";
import {ScrollView, ActivityIndicator, Image, View} from "react-native";
import { SignInOrganizerForm, SignUpOrganizerForm } from "@/widgets/organizers-auth";
import { CreateEventForm } from "@/widgets/create-event-form";
import { useOrganizerStore } from "@/entities/organizers";
import { Box } from "@/shared/ui";

export const OrganizersPage = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const {
    isAuthenticated, checkAuthenticated, showSignUp
  } = useOrganizerStore();

  useEffect(() => {
    checkAuthenticated().then(() => setIsCheckingAuth(false));
  }, []);

  if (isCheckingAuth) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{
        flexGrow: 1, minHeight: '100%',
        padding: 16, gap: 16,
        justifyContent: 'center',
      }}
    >
      <Image
        source={require("@/shared/assets/images/BlurredCircles.png")}
        resizeMode="stretch"
        style={{
          position: "absolute",
          zIndex: 0,
          width: "100%",
          height: 120,
          top: -15,
          opacity: 0.75,
          alignSelf: "center"
        }}
      />

      <View style={{ flex: 1, width: '100%', justifyContent: 'center', paddingTop: 50 }}>
        {isAuthenticated ? (
          <CreateEventForm/>
        ) : showSignUp ? (
          <SignUpOrganizerForm/>
        ) : (
          <SignInOrganizerForm/>
        )}
      </View>
    </ScrollView>
  );
};
