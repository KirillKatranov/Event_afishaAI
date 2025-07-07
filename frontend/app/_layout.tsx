import {useEffect, useState} from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {ConfigProvider} from "@/shared/providers/TelegramConfig";
import {DynamicThemeProvider} from "@/shared/providers/Theme";
import {SafeAreaWrapper} from "@/shared/providers/SafeAreaWrapper";
import {getStartParam} from "@/shared/providers/TelegramConfig/ui/TelegramConfig";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    TDMars: require("@/shared/assets/fonts/TD-Mars.otf"),
    UnboundedExtraBold: require('@/shared/assets/fonts/Unbounded-ExtraBold.ttf'),
    UnboundedSemiBold: require('@/shared/assets/fonts/Unbounded-SemiBold.ttf'),
    UnboundedMedium: require('@/shared/assets/fonts/Unbounded-Medium.ttf'),
    UnboundedRegular: require('@/shared/assets/fonts/Unbounded-Regular.ttf'),
    UnboundedLight: require('@/shared/assets/fonts/Unbounded-Light.ttf'),
    MontserratLight: require('@/shared/assets/fonts/Montserrat-Light.ttf'),
    MontserratRegular: require('@/shared/assets/fonts/Montserrat-Regular.ttf'),
    MontserratMedium: require('@/shared/assets/fonts/Montserrat-Medium.ttf'),
    MontserratSemiBold: require('@/shared/assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratBold: require('@/shared/assets/fonts/Montserrat-Bold.ttf'),
    TTTravelsDemiBold: require('@/shared/assets/fonts/TT-Travels-DemiBold.otf'),
    InterRegular: require('@/shared/assets/fonts/Inter-Regular.otf'),
  });
  const [startParam, setStartParam] = useState<string | null>(null);

  useEffect(() => {
    setStartParam(getStartParam());
  }, []);

  useEffect(() => {
    if (fontsLoaded && startParam != null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, startParam]);

  if (!fontsLoaded || startParam == null) {
    return null;
  }

  return (
    <ConfigProvider>
      <DynamicThemeProvider>
        <SafeAreaWrapper>
          <Stack
            initialRouteName={
              startParam ? "shared" : "(tabs)"
            }
          >
            <Stack.Screen name="index" options={{ headerShown: false }} redirect />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="shared" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name='profile' options={{ headerShown: false }} />
          </Stack>
        </SafeAreaWrapper>
      </DynamicThemeProvider>
    </ConfigProvider>
  );
}
