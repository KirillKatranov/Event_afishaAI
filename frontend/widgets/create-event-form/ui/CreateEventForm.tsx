import React, {useEffect} from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import {Button, DateInput, Dropdown, Radio, TextInput} from "@/shared/ui";
import {useEventFormStore} from "@/widgets/create-event-form";
import * as ImagePicker from "expo-image-picker";
import {useConfig} from "@/shared/providers/TelegramConfig";
import {useUserOrganizersListStore} from "@/features/organizers-list";
import Icon from "@/shared/ui/Icons/Icon";
import {router} from "expo-router";

export const CreateEventForm = () => {
  const state = useEventFormStore();
  const user = useConfig().initDataUnsafe.user;
  const userOrganizers = useUserOrganizersListStore((state) => state.userOrganizers);

  useEffect(() => {
    state.getAvailableTags(user.username ? user.username : user.id.toString());
    state.getAvailableCities();
  }, []);

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

        state.setCoverImage(file);
      } catch (error) {
        console.error("Error creating file:", error);
      }
    }
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        padding: 24,
        borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 16,
        flexDirection: "column", gap: 24
      }}
    >
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Название
        </Text>

        <TextInput
          placeholder={"Название"}
          value={state.title} onChange={state.setTitle}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Описание
        </Text>

        <Text style={styles.sectionSubTitle}>
          Полное описание будет использовано на странице мероприятия.
        </Text>

        <TextInput
          placeholder={"Описание"}
          value={state.description} onChange={state.setDescription}
          style={{ height: 150 }}
          multiline
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Обложка
        </Text>

        <Text style={styles.sectionSubTitle}>
          Загружая изображение, вы подтверждаете, что обладаете всеми согласиями и правами на его использование и несете за это полную ответственность.
        </Text>

        {state.coverImage ? (
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: URL.createObjectURL(state.coverImage) }}
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
        <Text style={styles.sectionTitle}>Контакты организатора</Text>

        {state.contact.map((contact, index) => (
          <>
            <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, flexDirection: 'column', gap: 8,}}>
                <TextInput
                  placeholder="Название контакта"
                  value={contact.contactName}
                  onChange={(text) => state.updateContact(index, 'contactName', text)}
                  style={{ flex: 0.4 }}
                />

                <TextInput
                  placeholder="Значение контакта"
                  value={contact.contactValue}
                  onChange={(text) => state.updateContact(index, 'contactValue', text)}
                  style={{ flex: 0.6 }}
                />
              </View>

              <TouchableOpacity
                onPress={() => state.removeContact(index)}
                style={{marginLeft: 8, padding: 8,}}
              >
                <Icon name={"dislike"} size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%", height: 2, backgroundColor: "#ECEBE8" }}/>
          </>
        ))}

        <TouchableOpacity
          onPress={state.addContact}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12,
            borderWidth: 1, borderColor: '#007AFF', borderRadius: 8, borderStyle: 'dashed',
          }}
        >
          <Text style={{ color: '#007AFF', marginLeft: 8, fontWeight: '500' }}>Добавить контакт</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Формат мероприятия
        </Text>

        <Radio
          theme={"organizers"}
          checked={state.format === 'online'}
          text="Онлайн"
          onChange={() => state.setFormat('online')}
        />
        <Radio
          theme={"organizers"}
          checked={state.format === 'offline'}
          text="Офлайн"
          onChange={() => state.setFormat('offline')}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Город
        </Text>


        <Dropdown
          items={state.citiesOptions}
          onSelect={(value) => state.setCity(value[0])}
          selectedValues={[state.city]}
          placeholder="Выберите город"
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Адрес
        </Text>

        <TextInput
          placeholder={"Адрес"}
          value={state.address} onChange={state.setAddress}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Дата
        </Text>

        <View style={{ flexDirection: "row", gap: 4, width: "100%", alignItems: "center" }}>
          <Text style={styles.sectionTitle}>
            с
          </Text>

          <DateInput
            placeholder={"Дата начала"}
            date={state.dateStart}
            onChange={state.setDateStart}
            style={{ flex: 1 }}
          />

          <Text style={styles.sectionTitle}>
            по
          </Text>

          <DateInput
            placeholder={"Дата конца"}
            date={state.dateEnd}
            onChange={state.setDateEnd}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Время
        </Text>

        <TextInput  value={state.time} placeholder={"Время"} onChange={state.setTime}/>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Категория
        </Text>

        <Dropdown
          items={state.categoryOptions}
          onSelect={(value) => state.setCategory(value)}
          selectedValues={state.category}
          placeholder="Выберите категорию"
          multiple={true}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Билеты
        </Text>

        <Radio
          theme={"organizers"}
          checked={state.ticketType === 'free'}
          text="Бесплатно"
          onChange={() => state.setTicketType('free')}
        />
        <Radio
          theme={"organizers"}
          checked={state.ticketType === 'paid'}
          text="Платно"
          onChange={() => state.setTicketType('paid')}
        />

        {state.ticketType === 'paid' && (
          <>
            <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
              <Text style={styles.sectionTitle}>Цена</Text>
              <TextInput
                placeholder={"от"}
                value={state.priceStart}
                onChange={state.setPriceStart}
                style={{ flex: 1 }}
              />

              <Text style={styles.sectionTitle}>-</Text>

              <TextInput
                placeholder={"до"}
                value={state.priceEnd}
                onChange={state.setPriceEnd}
                style={{ flex: 1 }}
              />

              <Text style={styles.sectionCaption}>Руб.</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Публикация от
        </Text>

        <Radio
          theme={"organizers"}
          checked={state.publisherType === 'user'}
          text={`Пользователя ${user.username}`}
          onChange={() => state.setPublisherType('user')}
        />

        <Radio
          theme={"organizers"}
          checked={state.publisherType === 'organisation'}
          text={"Организатора"}
          onChange={() => state.setPublisherType('organisation')}
          disabled={!userOrganizers || userOrganizers.length == 0}
        />

        {state.publisherType === 'organisation' && userOrganizers && (
          <Dropdown
            items={userOrganizers.map((organizer) => ({ label: organizer.name, value: organizer.id.toString() }))}
            onSelect={(value) => state.setOrganizerId(value[0])}
            selectedValues={state.organisation_id ? [state.organisation_id] : []}
            placeholder="Выберите организатора"
          />
        )}
      </View>

      <Button
        theme={"organizers"}
        text={"Создать мероприятие"}
        onPress={() => state.submitForm(user.username ? user.username : user.id.toString(), () => router.back() )}
      />

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
