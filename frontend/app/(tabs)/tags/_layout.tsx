import {Stack} from "expo-router";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }}/>
      <Stack.Screen name='[service]' options={{ headerShown: false }}/>
      <Stack.Screen name='organizers' options={{ headerShown: false }}/>
      <Stack.Screen name='trips' options={{ headerShown: false }}/>
    </Stack>
  )
}

export default StackLayout;
