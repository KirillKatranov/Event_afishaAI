import {Stack} from "expo-router";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }}/>
      <Stack.Screen name='create' options={{ headerShown: false }}/>
      <Stack.Screen name='register' options={{ headerShown: false }}/>
      <Stack.Screen name='events' options={{ headerShown: false }}/>
      <Stack.Screen name='manage' options={{ headerShown: false }}/>
    </Stack>
  )
}

export default StackLayout;
