import {Stack} from "expo-router";
import {useSafeAreaInsets} from "@/shared/providers/SafeAreaWrapper";
import {Box} from "@/shared/ui";

const StackLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Box
      flex={1}
      backgroundColor={'bg_color'}

      style={{
        paddingBottom: insets.bottom, paddingTop: insets.top,
        paddingLeft: insets.left, paddingRight: insets.right,
      }}
    >
      <Stack >
        <Stack.Screen name='index' options={{ headerShown: false }}/>
        <Stack.Screen name='city' options={{ headerShown: false }}/>
      </Stack>
    </Box>
  )
}

export default StackLayout;
