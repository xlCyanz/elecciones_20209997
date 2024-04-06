import React from "react";
import * as Application from "expo-application";
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native";

import { EventTabScreenProps } from "app/navigators"

import { spacing } from "../theme"
import { ListItem, Screen, Text } from "../components"

export const AboutScreen: React.FC<EventTabScreenProps<"AboutScreen">> = function AboutScreen(
  _props,
) {
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" tx="EventNavigator.aboutScreen.tab" />
      <Image source={require("../../assets/images/contact-image.jpg")} style={$itemThumbnail} />
      <View style={$itemsContainer}>
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Delegado</Text>
              <Text>Johan Ezequiel Sierra Linares</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Matricula del delegado</Text>
              <Text>2020-9997</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Nombre de la aplicación</Text>
              <Text>{Application.applicationName}</Text>
            </View>
          }
        />
      </View>
      <View style={$buttonContainer}>
        {/* <Button style={$button} tx="common.logOut" onPress={logout} /> */}
      </View>
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.xxl,
}

const $itemsContainer: ViewStyle = {
  marginBottom: spacing.xl,
}

const $buttonContainer: ViewStyle = {
  marginBottom: spacing.md,
}

const $item: ViewStyle = {
  marginBottom: spacing.md,
}


const $itemThumbnail: ImageStyle = {
  width: 150,
  height: 150,
  marginBottom: 10,
  borderRadius: 100,
  alignSelf: "center",
}