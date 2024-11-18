import React from "react";
import {Box, OnboardingButton, Stepper} from "@/shared/ui";
import {useOnboardingStore} from "@/widgets/Onboarding/model/store/useOnboardingStore";
import {useRouter} from "expo-router";

export const OnboardingNav = () => {
  const router = useRouter();
  const { page, incPage } = useOnboardingStore();

  return (
    <Box
      width={"100%"}
      paddingBottom={"l"}
      style={{
        gap: 36,
        paddingHorizontal: 32,
      }}
    >
      <Stepper
        pagesCount={3}
        currentPage={page}
      />

      <OnboardingButton
        page={page}
        onPress={page == 3 ? () => router.replace("/(tabs)/feed") : incPage}
      />
    </Box>
  )
}
