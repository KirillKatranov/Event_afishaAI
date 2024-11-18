import {useEffect, useState} from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {ConfigProvider} from "@/shared/providers/TelegramConfig";
import {DynamicThemeProvider} from "@/shared/providers/Theme";
import {getFirstLaunchStatus, storeFirstLaunchStatus} from "@/shared/utils/storage/firstLaunch";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MontserratRegular: require('@/shared/assets/fonts/Montserrat-Regular.ttf'),
    MontserratSemiBold: require('@/shared/assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratBold: require('@/shared/assets/fonts/Montserrat-Bold.ttf'),
    TTTravelsDemiBold: require('@/shared/assets/fonts/TT-Travels-DemiBold.otf'),
  });

  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    getFirstLaunchStatus()
      .then((status) => {
        storeFirstLaunchStatus(false)
          .then(() => console.log("First launch status set to false"));
        setFirstLaunch(status);
      });
  }, []);

  useEffect(() => {
    if (fontsLoaded && firstLaunch != null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, firstLaunch]);

  if (!fontsLoaded || firstLaunch == null) {
    return null;
  }

  return (
    <ConfigProvider>
      <DynamicThemeProvider>
        <Stack initialRouteName={firstLaunch ? "onboarding" : "(tabs)"}>
          <Stack.Screen name="index" options={{ headerShown: false }} redirect />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </DynamicThemeProvider>
    </ConfigProvider>
  );
}
