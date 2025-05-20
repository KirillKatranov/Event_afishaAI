import React from "react";
import {StyleSheet, View} from "react-native";
import {Button, Switch, TextInput} from "@/shared/ui";
import {useEventSettingsStore} from "@/widgets/create-event-form";

export const EventSettings = () => {
  const state = useEventSettingsStore();

  return (
    <View
      style={{
        width: "100%",
        padding: 16,
        flexDirection: "column", gap: 16
      }}
    >
      <View style={styles.optionContainer}>
        <Switch
          theme={"organizers"}
          value={state.registrationClosed} onChange={state.setRegistrationClosed}
          text={"Закрыть регистрацию"}
        />
      </View>

      <View style={styles.optionContainer}>
        <Switch
          theme={"organizers"}
          value={state.eventEnded} onChange={state.setEventEnded}
          text={"Окончание проведения мероприятия"}
        />
      </View>

      <View style={styles.optionContainer}>
        <Switch
          theme={"organizers"}
          value={state.duplicateEvent} onChange={state.setDuplicateEvent}
          text={"Дублировать мероприятие"}
        />
      </View>

      <View style={styles.optionContainer}>
        <Switch
          theme={"organizers"}
          value={state.deleteEvent} onChange={state.setDeleteEvent}
          text={"Удалить мероприятие"}
        />
      </View>

      <View style={styles.optionContainer}>
        <Switch
          theme={"organizers"}
          value={state.blockUsers} onChange={state.setBlockUsers}
          text={"Блокировать участников"}
        />

        {state.blockUsers && (
          <View style={{ marginTop: 16, gap: 8 }}>
            <Button
              onPress={state.addBlockedUsername} text={"+"} theme={"organizers"}
            />

            {state.blockedUsernames.map((username, index) => (
              <View key={index} style={{ flexDirection: "row", gap: 8 }}>
                <TextInput
                  value={username}
                  onChange={(text: string) => state.updateBlockedUsername(index, text)}
                  placeholder={"@"}
                />

                <Button
                  theme={"organizers"}
                  text={"✖"}
                  onPress={() => state.removeBlockedUsername(index)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: "white",
    borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 16,
    paddingHorizontal: 20, paddingVertical: 10
  }
})
