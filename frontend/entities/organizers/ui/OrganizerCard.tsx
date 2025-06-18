import React, {useState} from "react"
import {Organizer} from "@/entities/organizers";
import {Image, Pressable, View, Modal, TouchableOpacity} from "react-native";
import DropShadow from "react-native-drop-shadow";
import {Box, LoadingCard, Text} from "@/shared/ui";
import Illustration from "@/shared/ui/Illustrations/Illustration";

interface OrganizerCardProps {
  organizer?: Organizer,
  onPress?: () => void,
  owned?: boolean;
  onDelete?: () => void;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({
  organizer,
  onPress,
  owned,
  onDelete,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete?.();
  };

  if (!organizer) {
    return <LoadingCard style={{ width: "100%", height: 120, borderRadius: 5 }}/>
  }

  return (
    <>
      <Pressable onPress={onPress}>
        <DropShadow
          style={{
            borderRadius: 16,
            shadowRadius: 5,
            elevation: 20,
            shadowColor: "black",
            shadowOffset: { height: 5, width: 5 },
            shadowOpacity: 0.25
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              minHeight: 120,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#B4C9FE",
              borderRadius: 16,
            }}
          >
            <Image
              source={{ uri: organizer.image ? organizer.image : undefined }}
              resizeMode={"cover"}
              blurRadius={10}
              style={{
                height: "100%",
                width: "40%",
                position: "absolute",
                left: 0
              }}
            />

            <Image
              source={{ uri: organizer.image ? organizer.image : undefined }}
              resizeMode={"contain"}
              onLoadEnd={() => setImageLoading(false)}
              style={{
                height: "100%",
                width: "40%",
                display: imageLoading ? "none" : "flex"
              }}
            />

            {imageLoading && (
              <Box width={"40%"} height={"100%"} alignItems={"center"} justifyContent={"center"}>
                <LoadingCard style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1, borderRadius: 8 }}/>
                <Illustration name={"strelka"} width={64} height={64}/>
              </Box>
            )}

            <View
              style={{
                flex: 1,
                flexDirection: "column",
                backgroundColor: "white",
                paddingHorizontal: 16,
                paddingVertical: 20,
                justifyContent: "space-between"
              }}
            >
              <View>
                <Text style={{ fontFamily: 'MontserratMedium', fontSize: 14, color: "black" }}>
                  { organizer.name }
                </Text>

                {organizer.email && (
                  <Text style={{ fontFamily: 'MontserratMedium', fontSize: 12, color: "black" }}>
                    { organizer.email }
                  </Text>
                )}
              </View>

              {owned && onDelete && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                  }}
                  style={{
                    alignSelf: 'flex-end',
                    padding: 8,
                    backgroundColor: '#FF3B30',
                    borderRadius: 8,
                    marginTop: 10
                  }}
                >
                  <Text style={{ color: 'white', fontFamily: 'MontserratMedium', fontSize: 12 }}>
                    Удалить
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </DropShadow>
      </Pressable>

      {owned && onDelete && (
        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              width: '80%'
            }}>
              <Text style={{
                fontFamily: 'MontserratMedium',
                fontSize: 16,
                marginBottom: 20,
                textAlign: 'center'
              }}>
                Вы уверены, что хотите удалить этого организатора?
              </Text>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}>
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#B4C9FE'
                  }}
                >
                  <Text style={{ fontFamily: 'MontserratMedium' }}>Отмена</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDeleteConfirm}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    backgroundColor: '#FF3B30'
                  }}
                >
                  <Text style={{ color: 'white', fontFamily: 'MontserratMedium' }}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  )
}
