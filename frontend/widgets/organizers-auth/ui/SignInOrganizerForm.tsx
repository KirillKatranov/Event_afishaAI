import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, TextInput} from "@/shared/ui";
import {useSignInOrganizerStore} from "@/widgets/organizers-auth";

export const SignInOrganizerForm = () => {
  const state = useSignInOrganizerStore();

  return (
    <View
      style={{
        flex: 1, flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24, gap: 60,
      }}
    >
      <View style={{ flexDirection: "column", alignItems: "center", gap: 16 }}>
        <Text style={styles.pageTitle}>Привет!</Text>

        <Text style={styles.sectionTitle}>Авторизуйтесь для создания мероприятия</Text>
      </View>

      <View style={{ flexDirection: "column", gap: 24, width: "100%", maxWidth: 400 }}>
        <TextInput placeholder={"Электронная почта"} value={state.email} onChange={state.setEmail}/>

        <TextInput placeholder={"Пароль"} value={state.password} onChange={state.setPassword} password/>

        <Button theme={"organizers"} text={"Войти"} onPress={state.submitSignIn}/>

        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.75}
        >
          <Text style={styles.sectionSubTitle}>Забыли пароль?</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  pageTitle: { fontFamily: "UnboundedSemiBold", fontSize: 25, color: "#393939" },
  sectionTitle: { fontFamily: "MontserratRegular", fontSize: 16, color: "#1E1E1E", textAlign: "center" },
  sectionSubTitle: { fontFamily: "MontserratRegular", fontSize: 16, color: "#737171", textAlign: "center" },
})
