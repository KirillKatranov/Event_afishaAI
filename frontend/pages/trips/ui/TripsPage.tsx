import {Dimensions, View} from "react-native";
import {RoutesSwiper} from "@/widgets/events-swiper";
import {useRoutesStore} from "@/features/routes";
import {useEffect, useState} from "react";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";
import {useConfig} from "@/shared/providers/TelegramConfig";

export const TripsPage = () => {
  const {routes, isLoading, getRoutes} = useRoutesStore();
  const onEvent = useConfig().onEvent;

  const { height } = Dimensions.get('window');
  const NAV_BAR_HEIGHT = 57;
  const { bottom} = useSafeAreaInsets();
  const [swiperHeight, setSwiperHeight] = useState(height - NAV_BAR_HEIGHT - bottom);

  useEffect(() => {
    onEvent("viewportChanged", () => {
      // @ts-ignore
      setSwiperHeight(window.Telegram.WebApp.viewportHeight - NAV_BAR_HEIGHT - bottom);
    })
  }, [setSwiperHeight]);


  useEffect(() => {
    getRoutes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <RoutesSwiper routes={routes} isLoading={isLoading} containerHeight={swiperHeight}/>
    </View>
  )
}
