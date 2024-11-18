import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncStorageKeys} from "@/shared/constants";

export const storeFirstLaunchStatus = async (
  state: boolean
) => {
  try {
    await AsyncStorage.setItem(AsyncStorageKeys.firstLaunch, state.toString());
  } catch (e) {
    console.log("Error in saving user: ", e);
  }
};

export const getFirstLaunchStatus = async (): Promise<boolean> => {
  try {
    const flag = await AsyncStorage.getItem(AsyncStorageKeys.firstLaunch);
    return flag === 'true' || flag == null;
  } catch (e) {
    console.log("Error in saving user: ", e);
    return false;
  }
};

export const deleteFirstLaunchStatus = async () => {
  try {
    await AsyncStorage.removeItem(AsyncStorageKeys.firstLaunch);
  } catch (e) {
    console.log("Error in removing user: ", e);
  }
};
