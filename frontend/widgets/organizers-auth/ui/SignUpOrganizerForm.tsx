import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
import {Button, TextInput} from "@/shared/ui";
import {useSignUpOrganizerStore} from "@/widgets/organizers-auth";
import * as ImagePicker from 'expo-image-picker';
import {useConfig} from "@/shared/providers/TelegramConfig";

export const SignUpOrganizerForm = () => {
  const state = useSignUpOrganizerStore();
  const username = useConfig().initDataUnsafe.user.username;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        state.setImage(file);
      } catch (error) {
        console.error("Error creating file:", error);
      }
    }
  };

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

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Изображение организации</Text>

        {state.image ? (
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: URL.createObjectURL(state.image) }}
                style={styles.imagePreview}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
            <Text style={styles.uploadText}>Нажмите чтобы загрузить изображение</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Button
          theme={"organizers"}
          text={"Зарегистрироваться"}
          disabled={state.isLoading || !state.isFormValid}
          onPress={() => state.submitSignUp(username, () => console.log("Successful registration"))}/>
      </View>

      {state.errorMessage && (
        <Text style={styles.sectionTitle}>{state.errorMessage}</Text>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  sectionContainer: { gap: 8 },
  sectionTitle: { fontFamily: "MontserratRegular", fontSize: 16, color: "#1E1E1E"},
  sectionSubTitle: { fontFamily: "MontserratRegular", fontSize: 14, color: "#737171"},
  sectionCaption: { fontFamily: "MontserratRegular", fontSize: 12, color: "#1E1E1E"},
  imageContainer: { alignItems: 'center', gap: 8, },
  imageUpload: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  imagePreview: {width: '100%', height: 150, borderRadius: 8,},
  uploadText: {fontFamily: "MontserratRegular", color: '#737171', textAlign: 'center', paddingHorizontal: 20, },
})
