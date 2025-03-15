import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeys} from "@/shared/constants";

export const setEventCardsLayout = async (
  state: "swiper" | "catalog"
) => {
  try {
    await AsyncStorage.setItem(AsyncStorageKeys.eventCardsLayout, state.toString());
  } catch (e) {
    console.log("Error in saving event cards layout: ", e);
  }
};

export const getEventCardsLayout = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AsyncStorageKeys.eventCardsLayout);
  } catch (e) {
    console.log("Error in getting event cards layout: ", e);
    return null;
  }
};

export const deleteEventCardsLayout = async () => {
  try {
    await AsyncStorage.removeItem(AsyncStorageKeys.eventCardsLayout);
  } catch (e) {
    console.log("Error in removing event cards layout: ", e);
  }
};
