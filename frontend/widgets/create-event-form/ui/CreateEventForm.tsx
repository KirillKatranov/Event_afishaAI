import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {Button, Checkbox, Dropdown, Radio, TextInput} from "@/shared/ui";
import {useEventFormStore} from "@/widgets/create-event-form";

export const CreateEventForm = () => {
  const state = useEventFormStore();

  const recurrenceOptions = [
    { label: 'Ежедневно', value: 'daily' },
    { label: 'Еженедельно', value: 'weekly' },
    { label: 'Ежемесячно', value: 'monthly' },
  ];

  const categoryOptions = [
    { label: 'Концерт', value: 'concert' },
    { label: 'Выставка', value: 'exhibition' },
    { label: 'Мастер-класс', value: 'workshop' },
  ];

  const discountOptions = [
    { label: 'Нет', value: '-' },
  ];

  const ageRestrictionOptions = [
    { label: '0+', value: '0' },
    { label: '6+', value: '6' },
    { label: '12+', value: '12' },
    { label: '16+', value: '16' },
    { label: '18+', value: '18' },
  ];

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

        <Button
          text={"Загрузить обложку"} variant={"secondary"} theme={"organizers"}
          onPress={() => {}}
        />
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

        <TextInput
          placeholder={"Город"}
          value={state.city} onChange={state.setCity}
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

        <TextInput
          placeholder={"Дата начала"}
          value={state.dateStart} onChange={state.setDateStart}
        />

        <TextInput
          placeholder={"Дата конца"}
          value={state.dateEnd} onChange={state.setDateEnd}
        />

        <Checkbox
          theme={"organizers"}
          checked={state.isRecurring}
          text={"Мероприятие повторяется"}
          onChange={state.toggleRecurring}
        />

        {state.isRecurring && (
          <Dropdown
            items={recurrenceOptions}
            onSelect={(value) => state.setRecurrencePattern(value)}
            placeholder={"Периодичность"}
          />
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Категория
        </Text>

        <Dropdown
          items={categoryOptions}
          onSelect={(value) => state.setCategory(value)}
          placeholder="Выберите категорию"
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

            <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
              <Text style={styles.sectionTitle}>Количество билетов</Text>

              <TextInput
                placeholder={""}
                value={state.ticketsAmount}
                onChange={state.setTicketsAmount}
                style={{ flex: 1 }}
              />

              <Text style={styles.sectionCaption}>шт.</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Скидки
        </Text>

        <Dropdown
          items={discountOptions}
          onSelect={(value) => state.setDiscount(value)}
          placeholder={"Выберите скидки"}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Возрастное ограничение
        </Text>

        <Dropdown
          items={ageRestrictionOptions}
          onSelect={(value) => state.setAgeRestriction(value)}
          placeholder="Выберите ограничение"
        />
      </View>

      <Button theme={"organizers"} text={"Создать мероприятие"} onPress={() => {}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: { gap: 8 },
  sectionTitle: { fontFamily: "MontserratRegular", fontSize: 16, color: "#1E1E1E"},
  sectionSubTitle: { fontFamily: "MontserratRegular", fontSize: 14, color: "#737171"},
  sectionCaption: { fontFamily: "MontserratRegular", fontSize: 12, color: "#1E1E1E"},
})
