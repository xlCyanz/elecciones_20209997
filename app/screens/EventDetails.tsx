import React from "react";
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
import { Button, Image, ImageStyle, View, ViewStyle } from "react-native";

import { useStores } from "app/models";
import { AppStackScreenProps } from "app/navigators"
import { ListItem, Screen, Text } from "../components"

import { spacing } from "../theme"

export const EventDetailsScreen: React.FC<AppStackScreenProps<"EventDetails">> = function EventDetails(
  _props,
) {
  const { eventStore } = useStores();
  const event = eventStore.get(_props.route.params.id);

  const [playbackObject, setPlaybackObject] = React.useState<Audio.Sound | null>(null);

  async function playRecording() {
    const play = new Audio.Sound();
    await play.loadAsync({ uri: FileSystem.documentDirectory + 'recordings/' + `${event?.audioName}` });
    await play.playAsync();
    setPlaybackObject(play)
  }

  return (
    <Screen preset="scroll" contentContainerStyle={$container}>
      <Image source={{ uri: 'data:image/jpeg;base64,' + (event?.photo ?? "") }} style={$itemThumbnail} />
      <View style={$itemsContainer}>
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Nombre del evento</Text>
              <Text>{event?.title}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Descripción del evento</Text>
              <Text>{event?.description}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Fecha del evento</Text>
              <Text>{event?.date}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Audio del evento</Text>
              {!playbackObject ? (
                <Button title="Escuchar audio" onPress={playRecording} />
              ) : (
                <Button title="Parar audio" color="red" onPress={async () => {
                  await playbackObject?.stopAsync();
                  setPlaybackObject(null);
                }} />
              )}
            </View>
          }
        />
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
}

const $item: ViewStyle = {
  marginBottom: spacing.md,
}

const $itemThumbnail: ImageStyle = {
  width: "100%",
  height: 150,
  marginBottom: 10,
  alignSelf: "center",
}