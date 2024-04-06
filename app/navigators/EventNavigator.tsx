import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { CompositeScreenProps } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { Icon } from "../components"
import { translate } from "../i18n"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { EventListScreen, EventFormScreen, AboutScreen } from "../screens"

export type EventTabParamList = {
  AboutScreen: undefined
  EventListScreen: undefined
  EventFormScreen: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type EventTabScreenProps<T extends keyof EventTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<EventTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<EventTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `EventNavigator`.
 */
export function EventNavigator(): JSX.Element {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="EventListScreen"
        component={EventListScreen}
        options={{
          tabBarLabel: translate("EventNavigator.eventListScreen.tab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="calendar-event" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="EventFormScreen"
        component={EventFormScreen}
        options={{
          tabBarLabel: translate("EventNavigator.eventFormScreen.title"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="calendar-plus" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{
          tabBarLabel: translate("EventNavigator.aboutScreen.tab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="user" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: translate("EventNavigator.communityTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="community" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      /> */}

      {/* <Tab.Screen
        name="DemoPodcastList"
        component={EventListScreen}
        options={{
          tabBarAccessibilityLabel: translate("EventNavigator.podcastListTab"),
          tabBarLabel: translate("EventNavigator.podcastListTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="podcast" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
    */}
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
