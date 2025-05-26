import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Button, TextInput} from "@/shared/ui";
import {useSignUpOrganizerStore} from "@/widgets/organizers-auth";

export const SignUpOrganizerForm = () => {
  const state = useSignUpOrganizerStore();

  return (
    <View
      style={{
        width: "100%", flexDirection: "column",
        backgroundColor: "white",
        padding: 24, gap: 24,
        borderRadius: 16, borderWidth: 1, borderColor: "#D9D9D9",
      }}
    >
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Название организации</Text>

        <TextInput placeholder={"Название"} value={state.organizationName} onChange={state.setOrganizationName}/>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Телефон</Text>

        <TextInput placeholder={"Телефон"} value={state.phoneNumber} onChange={state.setPhoneNumber}/>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Email</Text>

        <TextInput placeholder={"Email"} value={state.email} onChange={state.setEmail}/>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Пароль</Text>

        <TextInput placeholder={"Пароль"} value={state.password} onChange={state.setPassword}/>
      </View>

      <Text style={styles.sectionTitle}>Телефон и почта нужны для связи с вами.</Text>

      <Button theme={"organizers"} text={"Продолжить регистрацию"} onPress={state.submitSignUp}/>
    </View>
  )
}


const styles = StyleSheet.create({
  sectionContainer: { gap: 8 },
  sectionTitle: { fontFamily: "MontserratRegular", fontSize: 16, color: "#1E1E1E"},
  sectionSubTitle: { fontFamily: "MontserratRegular", fontSize: 14, color: "#737171"},
  sectionCaption: { fontFamily: "MontserratRegular", fontSize: 12, color: "#1E1E1E"},
})
