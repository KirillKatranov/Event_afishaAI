import React from "react";
import {useOnboardingStore} from "@/widgets/onboarding-elements/model/store/useOnboardingStore";
import {Box, Stepper} from "@/shared/ui";

export const OnboardingNav = () => {
  const { page } = useOnboardingStore();

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
        pagesCount={4}
        currentPage={page}
      />
    </Box>
  )
}

